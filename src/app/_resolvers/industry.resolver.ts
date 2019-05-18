import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from './../_services';
import { Subscription } from 'rxjs';

@Injectable()
export class IndustryResolve implements Resolve<any> {
 constructor(private  baseService: BaseService){}
 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.baseService.promiseAllIndustries();
  }
}