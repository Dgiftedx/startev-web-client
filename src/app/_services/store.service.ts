import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../_models';
import * as _ from 'lodash';
import { AuthenticationService } from './authentication.service';


@Injectable({
	providedIn: 'root'
})
export class StoreService {

	constructor(
		private http: HttpClient,
		private authenticationService : AuthenticationService) { }


	endpoint = this.authenticationService.endpoint;


	public getCommonData(url:string){
		return this.http.get(`${this.endpoint}/store/${url}`);
	}

	//======================= Methods Starts Here ==========================//

	public getStore(user_id: number, url:string){
		return this.http.get(`${this.endpoint}/store/${url}/${user_id}`);
	}

	public checkHasStore(user_id: number){
		return this.http.get(`${this.endpoint}/store/check-has-store/${user_id}`);
	}

	public dashboardData(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-dashboard-data/${user_id}`);
	}

	public getOrders(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-store-orders/${user_id}`);
	}

	public getVentures(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-ventures/${user_id}`);
	}


	public getReviews(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-reviews/${user_id}`);
	}

	public saveStoreSettings( user_id:number, formData: FormData ){
		return this.http.post(`${this.endpoint}/store/save-store-settings/${user_id}`, formData);
	}


	public importProducts(user_id:number, venture_id:number){
		return this.http.get(`${this.endpoint}/store/import-venture-products/${user_id}/${venture_id}`);
	}


	public syncProducts(user_id:number, venture_id:number){
		return this.http.get(`${this.endpoint}/store/sync-venture-products/${user_id}/${venture_id}`);
	}

	public detachProducts(user_id:number, venture_id:number){
		return this.http.get(`${this.endpoint}/store/detach-venture-products/${user_id}/${venture_id}`);
	}


	public trackOrder(order_id:number, user_id){
		return this.http.get(`${this.endpoint}/store/track-order/${order_id}/${user_id}`);
	}

	public getSingleOrder(identifier:number){
		return this.http.get(`${this.endpoint}/store/get-single-order/${identifier}`);
	}

	public getProducts(user_id:number){
		return this.http.get(`${this.endpoint}/store/get-store-products/${user_id}`);
	}

	public addProduct(formData:any, user_id:number, url:string){
		return this.http.post(`${this.endpoint}/store/${url}/${user_id}`, formData);
	}

	public getSingleProduct(product_id:number){
		return this.http.get(`${this.endpoint}/store/get-single-product/${product_id}`).pipe(delay(800));
	}

	public deleteSingleProduct(product_id:number){
		return this.http.get(`${this.endpoint}/store/delete-single-product/${product_id}`);
	}


	public forwardOrder(data:any){
		return this.http.post(`${this.endpoint}/store/forward-order`, data);
	}


	public storeManagerDashboardData( ventureId:any, user_id:any ){
		return this.http.get(`${this.endpoint}/store/store-manager/get-dashboard-data/${ventureId}/${user_id}`);
	}

	public storeManagerGetOrders(ventureId:any, user_id:number){
		return this.http.get(`${this.endpoint}/store/store-manager/get-store-orders/${ventureId}/${user_id}`);
	}

	public storeManagerGetProducts(ventureId:any, user_id:number){
		return this.http.get(`${this.endpoint}/store/store-manager/get-store-products/${ventureId}/${user_id}`);
	}

	public storeManagerAddProduct(formData:any, user_id:number, url:string){
		return this.http.post(`${this.endpoint}/store/store-manager/${url}/${user_id}`, formData);
	}

	public storeManagerGetSingleProduct(product_id:number){
		return this.http.get(`${this.endpoint}/store/store-manager/get-single-product/${product_id}`).pipe(delay(800));
	}

	public storeManagerDeleteSingleProduct(product_id:number){
		return this.http.get(`${this.endpoint}/store/store-manager/delete-single-product/${product_id}`);
	}

	public storeManagerAttachPToVenture( venture_id:number, formData: any ){
		return this.http.post(`${this.endpoint}/store/store-manager/attach-products-to-venture/${venture_id}`, formData);
	}

	public storeManagerGetVentures(user_id:number){
		return this.http.get(`${this.endpoint}/store/store-manager/get-ventures/${user_id}`).pipe(delay(1000));
	}

	public storeManagerDetachPFromVenture( venture_id:number ){
		return this.http.get(`${this.endpoint}/store/store-manager/detach-products-from-venture/${venture_id}`);
	}

	public storeManagerUpdateVenture(formData:any, business_id:number, url:string){
		return this.http.post(`${this.endpoint}/store/store-manager/${url}/${business_id}`, formData);
	}

	public storeManagerGetSettings(business_id:number){
		return this.http.get(`${this.endpoint}/store/store-manager/get-settings/${business_id}`);
	}

	public storeManagerUpdateSettings(business_id:number, formData:any){
		return this.http.post(`${this.endpoint}/store/store-manager/update-settings/${business_id}`, formData);
	}

	public storeManagerTrackOrder(order_id:number, business_id){
		return this.http.get(`${this.endpoint}/store/store-manager/track-order/${order_id}/${business_id}`);
	}

	public storeManagerOrderAction(data:any){
		return this.http.post(`${this.endpoint}/store/store-manager/order-action`, data);
	}



	////////////////////////////////////////////////////////////////////////////

	public mainStore(identifier:any){
		return this.http.get(`${this.endpoint}/store/main-store-get-products/${identifier}`);
	}

	public mainStoreSingleProduct(product_id:number){
		return this.http.get(`${this.endpoint}/store/main-store-get-single-product/${product_id}`);
	}

	public mainStoreByFilter(identifier:any, query:any){
		return this.http.get(`${this.endpoint}/store/main-store-get-products-with-query/${identifier}?${query}`);
	}

	public mainStoreGetCartItems(){
		return this.http.get(`${this.endpoint}/store/main-store-get-cart`);
	}

	public mainStoreAddToCart(data:any){
		return this.http.post(`${this.endpoint}/store/main-store-add-to-cart`, data);
	}

	public mainStoreRemoveFromCart(item_id:number){
		return this.http.get(`${this.endpoint}/store/main-store-remove-from-cart/${item_id}`);
	}

	public mainStorePlaceOrder(formData:any){
		return this.http.post(`${this.endpoint}/store/main-store-place-order`, formData);
	}

	
}
