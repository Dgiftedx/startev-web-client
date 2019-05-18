import { Component, OnInit, OnDestroy} from '@angular/core';
import { User } from '../../../_models';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { AlertService, AuthenticationService, UserService } from '../../../_services';
import { FeedService } from '../../../_services/feed.service';
import { Feed } from '../../../_models/feed';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css'],
  providers: [FeedService],
})
export class FeedsComponent implements OnInit {

  currentUser : User;
  public isImage = false;
  public processedImage = '';
  public content : string = '';
  public title : string = '';
  public post_type: string = '';
  public image: any = null;

  public feeds: Feed[] = [];

  private feedSubscription: Subscription;
  private localFeedSubscription : Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private feedService : FeedService,
    private alert: AlertService,
    private userSerivce : UserService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //First push local feeds on load
    this.localFeedSubscription = feedService
    .getLocalFeeds()
    .subscribe((feed:any) => {
      feed.forEach((item) => {
        item.createdAt = new Date(item.createdAt);
        this.feeds.push(item);
      })
    });

    //Push cuccurrent feeds
    this.feedSubscription = feedService
    .getFeedItems()
    .subscribe((feed: Feed) => {
      if (_.size(feed) > 0) {
        this.feeds.push(feed);
      }
    });
  }

  ngOnInit() {
  }


  writePost(type: any){
    if (type === 'article') {
      this.post_type = 'post';
      $(document).find('#articlePostModal').modal();
    }

    if (type === 'image') {
      this.post_type = 'picture';
      $(document).find('#imagePostModal').modal();
    }

  }


  imageFileReader(file: File){
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.processedImage = event.target.result; 
    });

    reader.readAsDataURL(file);
  }

  fireImageUpload(){
    $(document).find('#postImageInput').click();
  }

  processPostImage(postImage: any): void {
    const newPostImage : File = postImage.files[0];
    this.imageFileReader(newPostImage);
    this.isImage = true;
    this.image = newPostImage;
  }


  submitArticlePost(){
    this.submitPost();
    $(document).find('#closeArticleModal').click();
  }


  submitImagePost(){
    this.submitPost();
    $(document).find('#closeImageModal').click();
  }

  cleanForm(){
    this.title = '';
    this.content = '';
    this.post_type = '';
  }


  submitPost(){

    if (_.size(this.content) === 0 || _.size(this.title) === 0) {
      this.alert.errorMsg("Sorry. You can't publish empty content","There is error in form");
      return;
    }

    if (typeof this.image == null || typeof this.image === "undefined") {
      return;
    }

    this.alert.infoMsg("Processing your post....","Processing");

    let formData = new FormData();
    formData.append('post_type',this.post_type);
    formData.append('user_id',this.currentUser.id);
    formData.append('title',this.title);
    formData.append('body',this.content);
    formData.append('image',this.image);
    this.http
    .post(`${this.authenticationService.endpoint}/feed-post-article`, formData)
    .toPromise()
    .then((data: { message: string; status: boolean }) => {
      this.alert.successMsg(data.message,"Success");
      this.cleanForm();
    })
    .catch(error => {
      this.alert.errorMsg(error, "Post submission failed");
    });
  }


  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
  }
}
