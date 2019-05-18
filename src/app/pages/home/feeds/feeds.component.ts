import { Component, OnInit, OnDestroy} from '@angular/core';
import { User } from '../../../_models';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { AlertService, AuthenticationService, UserService } from '../../../_services';
import { FeedService } from '../../../_services/feed.service';
import { Feed } from '../../../_models/feed';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css'],
  providers: [FeedService],
})
export class FeedsComponent implements OnInit {

  currentUser : User;

  public content : string = '';
  public title : string = 'Startev Feed System Test';
  public post_type: string = 'post';

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


  submitPost(){

    if (_.size(this.content) === 0) {
      return;
    }
    this.alert.infoMsg("Processing your post....","Processing");

    this.http
    .post(`${this.authenticationService.endpoint}/feed-post-article`, {
      post_type: this.post_type,
      user_id: this.currentUser.id,
      title: this.title,
      body: this.content,
    })
    .toPromise()
    .then((data: { message: string; status: boolean }) => {
      this.alert.successMsg(data.message,"Success");
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
