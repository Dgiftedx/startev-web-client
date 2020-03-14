import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {SnotifyService} from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  config(){
    return {
      type: 'success',
      position: 'rightTop',
    }
  }

  constructor(
    private toastr: ToastrService,
    private snotify : SnotifyService
    ) { }


   successMsg(message : string, title : string) {
  	this.toastr.success(message, title);
  }

   errorMsg(message : string, title : string) {
  	this.toastr.error(message, title);
  }

   warningMsg(message : string, title : string) {
  	this.toastr.warning(message, title);
  }

  infoMsg(message : string, title : string) {
  	this.toastr.info(message, title);
  }

  snotSuccess(message : string){
    return this.snotify.success(message);
  }

  snotSimpleSuccess(message:string){
    return this.snotify.success(message, null, {
      type: 'success',
      position: 'rightTop',
    });
  }
  
}
