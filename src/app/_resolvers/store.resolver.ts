import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from './../_services/store.service';
import { Subscription } from 'rxjs';

@Injectable()
export class MainStoreResolve implements Resolve<any> {
 constructor(private  storeService: StoreService){}
 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.storeService.mainStore(route.params.identifier);
  }
}