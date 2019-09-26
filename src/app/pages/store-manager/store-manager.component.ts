declare var $: any;
import * as _ from 'lodash';
import { Subscription } from 'rxjs'
import { User } from '../../_models';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { Cropper } from '../../../assets/lib/cropper.js';
import { StoreService } from '../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { CustomFilePickerAdapter } from '../../file-picker.adapter';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { trigger, style, animate,state, transition } from '@angular/animations';
import { AlertService, AuthenticationService, BaseService } from '../../_services';


@Component({
  selector: 'app-store-manager',
  templateUrl: './store-manager.component.html',
  styleUrls: ['./store-manager.component.css'],
  animations: [
  trigger(
    'enterAnimation', [
    transition(':enter', [
      style({transform: 'translateY(-100%)'}),
      animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
    transition(':leave', [
      animate('200ms ease-out', style({transform: 'translateY(-100%)'}))
      ])
    ]),
  trigger('fadeAnimation', [

    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({opacity: 1})),

    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [
      style({opacity: 0}),
      animate(600 )
      ]),

    // fade out when destroyed. this could also be written as transition('void => *')
    transition(':leave',
      animate(600, style({opacity: 0})))
    ])
  ],
})


export class StoreManagerComponent implements OnInit {

  currentUser : User;

  public ventures:any = [];
  public ventureSubscription: Subscription;

  selectForm: FormGroup;

  //======= Dashboard Navigation ============//
  public navigation: Array<any> = [

  {id: 1, alias: "dashboard", name: "Dashboard", icon: "fa fa-dashboard"},
  {id: 2, alias: "manage_orders", name: "Manage Orders", icon: "fa fa-shopping-cart"},
  {id: 3, alias: "manage_products", name: "Manage Products", icon: "fa fa-list"},
  {id: 4, alias: "store_settings", name: "Store Settings", icon: "fa fa-cog"},
  {id: 5, alias: "order_tracking", name: "Track Order", icon: "fa fa-send"}

  ];

  public selectedNavigation = this.navigation[0];
  public selectedVenture:number;
  public lockView:boolean = false;


  //========================================================
  // Dashboard
  //========================================================
  public recentOrders:Array<any> = [];
  dashboardData:any = [];

  //========================================================
  // Manage Orders
  //========================================================
  public orders:any = [];
  public temp:any[] = [];

  public singleOrder:any = {};
  public selectedOrders:any[] = [];
  public showModBox:boolean = false;
  public showMainOrders:boolean = true;

  //========================================================
  // Manage Products
  //========================================================
  // Image uploader adapter
  imageAdapter = new CustomFilePickerAdapter(this.http);

  public proTemp:any[] = [];
  public products:any = [];
  public rows = [];
  public columns:any[] = [
  {name: 'Image'},
  {name : 'Product Name', prop: 'name'},
  {name: 'Product Sku', prop:'sku'},
  {name: 'Amount', prop:'amount'},
  {name: 'Status', prop:'status'},
  {name: 'Actions', prop:'id'},
  ];

  public selectedProducts:any[] = [];
  private productsSubscription : Subscription;

  public formUrl:string = '';
  public singleProduct:any = {};
  public selectedSingleImage :any = '';
  public active: boolean = true;
  public formData = new FormData();
  public showMainBox:boolean = true;
  public showProduct:boolean = false;
  public submitted: boolean = false;
  public submitting:boolean = false;
  public showAddNew:boolean = false;
  public sendingAssignment:boolean = false;
  public showVentureSelect:boolean = false;
  public uploadNotice:boolean = false;
  public showEditProduct:boolean = false;
  public showSubmitButton:boolean = false;
  public newProductForm: FormGroup;
  productImages: FilePreviewModel[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private config: NgSelectConfig,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private storeService : StoreService,
    private baseService : BaseService,
    private authenticationService: AuthenticationService) {
    // this.getIndustryList();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    //disable resuable route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    //======================================================
    // Create select form, check if there is at least a 
    // venture, and select the first as default.
    // since dashboard will be displayed first, 
    // get recent orders and other dahsboard statistics

    this.createSelectForm();

    this.ventureSubscription = this.storeService.storeManagerGetVentures(this.currentUser.id)
    .subscribe(data => {this.ventures = data;
      if (this.count(this.ventures) > 0) {
        this.selectForm.controls['selected'].setValue(this.ventures[0].id);
        this.selectedVenture = this.ventures[0].id;
        this.getRecentOrder(this.ventures[0].id);
      }else{
          setTimeout(() => {
            this.lockView = true;
          }, 1000);
      }
    });
  }


  ngOnInit() {

  }


  //========================================================
  // Default Properties & Methods
  //========================================================

  //== Create Venture Select Form
  createSelectForm(){
    this.selectForm = this.formBuilder.group({
      selected : [''],
    });
  }

  //== Get Profile
  get profile(){
    return JSON.parse(this.authenticationService.getUserData());
  }

  //== Count Items
  count(items:any)
  {
    return _.size(items);
  }


  //== check null item and return default as required
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

    if (type === 'banner') {

      if (this.count(item) === 0) {
        return '/assets/images/default/default.png';
      }

      return this.authenticationService.baseurl+item;
    }
  }


  //========================================================
  // Set Active Navigation
  //========================================================
  setActiveNavigation(navigation:any) {

    if (navigation.alias === 'dashboard') {

      //Call recent order method
      this.getRecentOrder(this.selectedVenture);

    }

    if (navigation.alias === 'manage_orders') {

      //Get All Orders
      this.pageGetOrders(this.selectedVenture);
    }


    if (navigation.alias === 'manage_products') {
      // Get Products
      this.pageGetProducts(this.selectedVenture);
    }

    setTimeout(() => this.selectedNavigation = navigation);
  }


  

  setCurrentVenture(){
    this.selectedVenture = this.selectForm.value.selected;

    if (this.selectedNavigation.alias === 'dashboard') {

      //Call recent order method
      this.getRecentOrder(this.selectedVenture);

    }

    if (this.selectedNavigation.alias === 'manage_orders') {

      //Get All Orders
      this.pageGetOrders(this.selectedVenture);
    }


    if (this.selectedNavigation.alias === 'manage_products') {
      // Get Products
      this.pageGetProducts(this.selectedVenture);
    }
  }

  //============ Check if user has access to this page ================//
  // This route is meant for business owners

  hasAccess() {
  	return this.profile.role !== 'business'?false:true;
  }



  //==============================================================================================
  // Dashboard Methods & Features
  //==============================================================================================

  // Handle recent orders
  handleRecentOrders(data:any) {

  }


  getRecentOrder(ventureId:number) {
    if (ventureId) {
      this.storeService.storeManagerDashboardData(ventureId, this.currentUser.id)
      .subscribe((data:any) => {
        this.dashboardData = data; 
        this.recentOrders = [];
        let orders = data.recent_orders;
        for ( let identifier in orders ) {
          for (let index in orders[identifier]) {
            this.recentOrders.push(orders[identifier][index]);
          }
        }

      });
    }
  }


  //===============================================================================================
  // Manage Store Orders & Features
  //===============================================================================================

  //Get Orders
  pageGetOrders(ventureId:number){
    this.storeService.storeManagerGetOrders(ventureId ,this.currentUser.id)
    .subscribe(data => {
      this.handleOrdersInit(data);
    });
  }


  //Handle Order
  handleOrdersInit(data:any) {
    this.orders = [];
    
    for ( let identifier in data ) {
      this.orders.push({
        name: data[identifier][0].name,
        order_id: identifier,
        items: this.count(data[identifier]),
        date: data[identifier][0].date,
        status: data[identifier][0].status
      });
    }

    this.temp = [...this.orders];
  }

  onSelect({ selected }) {
    this.selectedOrders.splice(0, this.selectedOrders.length);
    this.selectedOrders.push(...selected);
  }

  //================ table filtering ===================//

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.order_id.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.orders = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  stableCall(ventureId:number){
    //Get orders
    this.storeService.storeManagerGetOrders(ventureId, this.currentUser.id)
    .subscribe(data => {
      this.handleOrdersInit(data);
    });
  }


  // ==================== View Order ===============================//

  viewOrder(order_id: number) {

    this.controlInputLock(true);
    this.storeService.storeManagerGetSingleOrder(order_id)
    .subscribe(data => {
      this.singleOrder = data;
      setTimeout(() => {
        this.showMainOrders = false;
        this.showModBox = true;
      });
    });
  }



  closeModBox(){
    this.showModBox = false;
    this.showMainOrders = true;
    this.controlInputLock(false);
  }



  finallizeOrder(action:string, identifier:any) {

    let data = {
      action: action,
      order_id: identifier
    };

    this.storeService.storeManagerOrderAction(data)
    .subscribe( data => {
      this.stableCall(this.selectedVenture);
      this.closeModBox();
      this.controlInputLock(false);
    })
  }


  //===============================================================================================
  // Manage Store Products & Features
  //===============================================================================================

  //Get Products
  pageGetProducts(ventureId:number){
    this.storeService.storeManagerGetProducts(ventureId, this.currentUser.id)
    .subscribe(data => { this.products = data; this.proTemp = [...this.products];});

    this.stableProductData(this.selectedVenture);
  }

  stableProductData(ventureId:number){
    this.storeService.storeManagerGetProducts(ventureId, this.currentUser.id)
    .subscribe(data => {this.products = data;});
  }

  createProductForm(){
    this.newProductForm = this.formBuilder.group({
      product_name: ['', Validators.required],
      sku : ['', Validators.required],
      product_price : [0,[Validators.required, Validators.minLength(3)]],
      highlight: ['', Validators.required],
      product_commission : [0, Validators.required],
      discount_price: [0, Validators.required]
    });
  }


  //==================== Add New Product Trigger =====================//
  triggerAddNew(){
    this.formUrl = 'add-product/'+this.selectedVenture;
    this.showAddNew = true;
    this.showMainBox = false;
    this.controlInputLock(true);
    this.createProductForm();
  }

  onFileAdded(file: FilePreviewModel) {
    this.productImages.push(file);
  }

  onUploadSuccess(e: FilePreviewModel) {

  }

  get p(){
    return this.newProductForm.controls;
  }


  convertToFormData(formValues:any): FormData{
    // let formData = new FormData();

    for ( let key in formValues ){

      // If there is an array value
      if (Array.isArray(formValues[key])) {
        this.formData.append(key, JSON.stringify(formValues[key]));
      }else{
        // append the single file
        this.formData.append(key, formValues[key]);
      }
    }

    return this.formData;
  }


  cleanForm(){
    this.formUrl = '';
    this.submitted = false;
    this.submitting = false;

    this.newProductForm.get('product_name').setValue("");
    this.newProductForm.get('sku').setValue("");
    this.newProductForm.get('product_price').setValue(0);
    this.newProductForm.get('highlight').setValue("");
    this.newProductForm.get('product_commission').setValue(0);
    this.newProductForm.get('discount_price').setValue(0);

    this.productImages = [];
    this.formData = new FormData();
    this.uploadNotice = false;
    this.closeNewProductForm();

  }

  closeNewProductForm(){
    this.showAddNew = false;
    this.showMainBox = true;
    this.uploadNotice = false;
    this.controlInputLock(false);
  }


  //======================== submit Product ============================//
  onSubmitProduct(){

    this.submitted = true;
    //trigger ladda
    this.submitting = true;

    if (this.newProductForm.invalid) {
      this.alert.errorMsg("There is error in your form. Please cross-check", "Error in form");
      this.submitting = false;
      return;
    }


    //clear formData;
    this.formData = new FormData();
    
    // If images are uploaded, attach to form
    if (this.count(this.productImages) > 0) {
      this.productImages.forEach(item => {
        this.formData.append('images[]', item.file)
      })
    }


    //
    let formData = this.convertToFormData(this.newProductForm.value);
    this.storeService.storeManagerAddProduct(formData,this.currentUser.id, this.formUrl)
    .subscribe(data => {
      this.controlInputLock(false);
      this.stableProductData(this.selectedVenture);
      this.cleanForm();
      this.alert.snotSimpleSuccess("Success. Product published successfully.");
    },

    error => {this.submitting = false;});

  }

  
  //================ table filtering ===================//

  updateProductFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.proTemp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.products = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  //================= Mangement Methods ================//

  getFirstLetter(word:string){
    return word.charAt(0);
  }


  // Get single image to view
  getProductToView(id:number){
    this.storeService.storeManagerGetSingleProduct(id)
    .subscribe(data => {
      this.singleProduct = data; 
     
      if (this.count(this.singleProduct.images) > 0) {
        this.selectedSingleImage = this.singleProduct.images[0]
      }
    });
  }

  // trigger to get single product view
  viewProduct(value:any){
    this.controlInputLock(true);
    this.getProductToView(value);

    setTimeout(() => {
      this.showProduct = true;
      this.showMainBox = false;
    }, 1000);
    
  }

  // set selected image
  setSelectedImage(image){
    if (image === this.selectedSingleImage) {
      return;
    }
    return this.selectedSingleImage = image;
  }


  closeViewProduct(){
    this.showProduct = false;
    this.showMainBox = true;
    this.controlInputLock(false);

  }


  // ==================== remove product ==================//
  deleteProduct(value) {
    this.storeService.storeManagerDeleteSingleProduct(value)
    .subscribe(data => {
      this.alert.snotSimpleSuccess("Product Removed successfully");
      this.stableProductData(this.selectedVenture);
    });
  }


  controlInputLock(type){
    if (type) {
      this.selectForm.controls['selected'].disable();
    }else{
      this.selectForm.controls['selected'].enable();
    }
  }



  // ================= Edit Product ======================//
  editProduct(value) {
    this.controlInputLock(true);
    this.createProductForm();

    this.getProductToView(value);
    this.formUrl = 'edit-product/'+value;
    this.uploadNotice = true;
    this.productImages = [];

    this.storeService.storeManagerGetSingleProduct(value)
    .subscribe(data => {
      this.singleProduct = data; 
      this.newProductForm.get('product_name').setValue(this.singleProduct.product_name);
      this.newProductForm.get('product_price').setValue(this.singleProduct.product_price);
      this.newProductForm.get('sku').setValue(this.singleProduct.sku);
      this.newProductForm.get('highlight').setValue(this.singleProduct.highlight);
      this.newProductForm.get('discount_price').setValue(this.singleProduct.discount_price);
      this.newProductForm.get('product_commission').setValue(this.singleProduct.product_commission);
    });

    this.alert.infoMsg("Please Wait....", "Fetching Product Data");


    setTimeout(() => {
      this.showAddNew = true;
      this.showMainBox = false;
    }, 1500);
  }




}
