import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Cropper } from '../../../../../assets/lib/cropper.js';
import { User } from '../../../../_models';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { switchMap, first } from "rxjs/operators";
import { NgSelectConfig } from '@ng-select/ng-select';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { CustomFilePickerAdapter } from '../../../../file-picker.adapter';
import { StoreService } from '../../../../_services/store.service';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AlertService, AuthenticationService, BaseService} from '../../../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-user-manage-products',
  templateUrl: './user-manage-products.component.html',
  styleUrls: ['./user-manage-products.component.css']
})
export class UserManageProductsComponent implements OnInit {
  	currentUser: User;

	// Image uploader adapter
	imageAdapter = new CustomFilePickerAdapter(this.http);


	public temp:any[] = [];
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
	public selectedVenture:any = {};
	private productsSubscription : Subscription;
	private ventureSubscription : Subscription;

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
		private alert: AlertService,
		private baseService: BaseService,
		private formBuilder : FormBuilder,
		private storeService : StoreService,
		private authenticationService: AuthenticationService) {
		// Subscribe to current logged in user
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

		//disable resuable route
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};

		this.productsSubscription = this.storeService.getProducts(this.currentUser.id)
		.subscribe(data => { this.products = data; this.temp = [...this.products];});

		this.stableData();
	}


	ngOnInit() {

		this.createForm();
	}

	onSelect({ selected }) {
		this.selectedProducts.splice(0, this.selectedProducts.length);
		this.selectedProducts.push(...selected);
	}

	stableData(){
		this.productsSubscription = this.storeService.getProducts(this.currentUser.id)
		.subscribe(data => {this.products = data;});
	}

	createForm(){
		this.newProductForm = this.formBuilder.group({
			product_name: ['', Validators.required],
			highlight: ['', Validators.required],
		});
	}
	
	//====== Getter method for Current User Profile =======//

	get profile(){
		return JSON.parse(this.authenticationService.getUserData());
	}

	count(items:any)
	{
		return _.size(items);
	}



	//==================== Add New Product Trigger =====================//
	triggerAddNew(){
		this.formUrl = 'add-product';
		this.showAddNew = true;
		this.showMainBox = false;
	}

	onFileAdded(file: FilePreviewModel) {
		this.productImages.push(file);
	}

	onUploadSuccess(e: FilePreviewModel) {
		//do nothing
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
		this.newProductForm.get('highlight').setValue("");

		this.productImages = [];
		this.formData = new FormData();
		this.uploadNotice = false;
		this.closeNewProductForm();

	}

	closeNewProductForm(){
		this.showAddNew = false;
		this.showMainBox = true;
		this.uploadNotice = false;
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


		//convert fields to formData object
		let formData = this.convertToFormData(this.newProductForm.value);

		this.storeService.addProduct(formData,this.currentUser.id, this.formUrl)
		.subscribe(data => {
			this.stableData();
			this.cleanForm();
			this.alert.snotSimpleSuccess("Success. You can now assign to your ventures if you have one.");
		},

		error => {this.submitting = false;});

	}

	
	//================ table filtering ===================//

	updateFilter(event) {
		const val = event.target.value.toLowerCase();

		// filter our data
		const temp = this.temp.filter(function(d) {
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
		this.storeService.getSingleProduct(id)
		.subscribe(data => {
			this.singleProduct = data; 
			
			if (this.count(this.singleProduct.images) > 0) {
				this.selectedSingleImage = this.singleProduct.images[0]
			}
		});
	}

	// trigger to get single product view
	viewProduct(value:any){
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

	}


	// ==================== remove product ==================//
	deleteProduct(value) {
		this.storeService.deleteSingleProduct(value)
		.subscribe(data => {
			this.alert.snotSimpleSuccess("Product Removed successfully");
			this.stableData();
		});
	}



	// ================= Edit Product ======================//
	editProduct(value) {
		this.getProductToView(value);
		this.formUrl = 'edit-product/'+value;
		this.uploadNotice = true;
		this.productImages = [];


		this.storeService.getSingleProduct(value)
		.subscribe(data => {
			this.singleProduct = data; 
			this.newProductForm.get('product_name').setValue(this.singleProduct.product_name);
			this.newProductForm.get('highlight').setValue(this.singleProduct.highlight);
		});
	
		this.alert.infoMsg("Please Wait....", "Fetching Product Data");


		setTimeout(() => {
			this.showAddNew = true;
			this.showMainBox = false;
		}, 1500);
	}
}
