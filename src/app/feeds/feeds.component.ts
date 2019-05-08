import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

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
