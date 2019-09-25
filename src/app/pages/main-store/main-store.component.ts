declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { User } from '../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { StoreService } from '../../_services/store.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NavbarService } from '../../_services/navbar.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService } from '../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-main-store',
  templateUrl: './main-store.component.html',
  styleUrls: ['./main-store.component.css']
})
export class MainStoreComponent implements OnInit {

  currentUser : User;

  public singleProduct:any = {};
  public selectedSingleImage:any = '';


  public cart:any = [];
  public store:any = {};
  public cartIds:any = [];
  public products:any = [];
  private cartSubscription: Subscription;

  public selectedPriceFilter = 'high_low';
  public selectedSortFilter = 'desc';

  public productSortFilter = [
  {id: 1, name: "Sort By Newest", value: 'desc'},
  {id: 2, name: "Sort By Oldest", value: 'asc'}
  ];


  constructor(
    private nav : NavbarService,
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    this.config.notFoundText = 'item not found';
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    if (this.currentUser) {
      //user cart items
      this.cartSubscription = this.storeService.mainStoreGetCartItems()
      .subscribe(items => {
        this.cart = items;
      });
    }else{
      this.cart = this.getSavedCartInStorage();
    }
  }

  ngOnInit() {
    this.products = this.route.snapshot.data.store.products;
    this.store = this.route.snapshot.data.store.storeDetails;
  }


  // ============ check null item and return default as required =======//
  checkValue(item:any,  type:string, nullValue:string) {
    if (type === 'text') {
      if (this.count(item) === 0) {
        return nullValue;
      }
      return item;
    }

    if (type === 'avatar') {

      if (this.count(item) === 0) {
        return '/assets/images/default/avatar.jpg';
      }
      return this.authenticationService.baseurl+item;
    }
  }

  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  //============= Count ================//
  count(items:any){
    return _.size(items);
  }

  //===================== Search Handler ===================//
  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    // Your request...
    console.log(stringEmitted);
  }

  getFirstLetter(word:string){
    return word.charAt(0);
  }


  // set selected image
  setSelectedImage(image){
    if (image === this.selectedSingleImage) {
      return;
    }
    return this.selectedSingleImage = image;
  }

  

  triggerView(product:number){

    let search = _.findLast(this.products, ['id',product]);

    if (search) {
      this.singleProduct = search;
      this.selectedSingleImage = search.images[0];
    }

    $(document).find('#productPreviewModal').modal('show');
  }


  closeModal(){
    $(document).find('#productPreviewModal').modal('hide');
  }



  //================== Apply Product Filter =======================//
  applyFilter(){

    let query = '&sort='+this.selectedSortFilter;

    this.storeService.mainStoreByFilter(this.route.snapshot.params.identifier, query)
    .subscribe(data => {
      this.products = data;
      this.alert.snotSimpleSuccess("Filter Applied");
    });

  }

  updateCartIds(cart:any) {
    cart.forEach(item => {
      this.cartIds.push(item.product_id);
    });
  }



  //================= Cart View Modal ===========================//
  triggerCartView() {
    $(document).find('#cartViewModal').modal('show');
  }

  closeCartModal(){
    $(document).find('#cartViewModal').modal('hide');
  }

  goToCart(){
    $(document).find('.modal-backdrop').remove();

    setTimeout(() => {
      this.router.navigate(['/store/cart-view']);
    }, 500);
  }

  calculateTotal(){
    let total = 0;
    this.cart.forEach(item => {
      total += item.product.product_price;
    });

    return total;
  }

  //================== Add to cart ==============================//


  checkForError(data:any){
    if (data.error) {
      this.alert.infoMsg(data.error,"Info");
      return true;
    }
  }


  removeLocalStorageCart(){
    return localStorage.removeItem('cartItems');
  }

  getSavedCartInStorage(){
    return JSON.parse(localStorage.getItem('cartItems'));
  }


  saveToSession(data:any){

    if (this.count(this.getSavedCartInStorage()) === 0) {

      let $array = [];

      this.storeService.getCommonData('get-local-product?product_id='+data.product_id)
      .subscribe((item:any) => {

        if (this.count(data.store_identifier) === 0) {
          data.store_identifier = item.store_identifier;
        }

        data.product = item.product;
        data.store = item.store;
        data.quantity = 1;

        $array.push(data);
        localStorage.setItem('cartItems', JSON.stringify($array));
        this.alert.snotSimpleSuccess("Your product has been added to cart");
        this.cart = this.getSavedCartInStorage();

      });
    }else{

      //check is item already exists
      let cartItems = this.getSavedCartInStorage();
      let search = _.findLast(cartItems, ['product_id', data.product_id]);

      if (_.size(search) > 0) {
        this.alert.infoMsg("Your product already has been added to cart","Added already");
      }else{
        this.storeService.getCommonData('get-local-product?product_id='+data.product_id)
        .subscribe((item:any) => {

          if (this.count(data.store_identifier) === 0) {
            data.store_identifier = item.store_identifier;
          }

          data.product = item.product;
          data.store = item.store;
          data.quantity = 1;

          cartItems.push(data);
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          this.alert.snotSimpleSuccess("Your product has been added to cart");
          this.cart = this.getSavedCartInStorage();
        });

      }

    }

  }

    addToCart(productSku: any, productId:number) {

      let toCart = {
        product_id: productId, 
        product_sku: productSku,
        store_identifier: this.route.snapshot.params.identifier,
        user_id: this.currentUser?this.currentUser.id:0
      };


      //check if user is logged in
      if (this.currentUser) {
        this.storeService.mainStoreAddToCart(toCart)
        .subscribe( (resp:any) => {

          //first check for notice
          if (!this.checkForError(resp)) {
            this.cart = resp.items;
            this.alert.snotSimpleSuccess(resp.message);
          }

        });
      }else{
        //use local storage
        this.saveToSession(toCart);
      }


    }

  }
