import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr: ToastrService) { }


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
  
}
