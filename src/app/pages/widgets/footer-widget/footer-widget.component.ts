import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-widget',
  templateUrl: './footer-widget.component.html',
  styleUrls: ['./footer-widget.component.css']
})
export class FooterWidgetComponent implements OnInit {


  public copyDate:any;
  constructor() { 

  	this.copyDate = new Date();

  }

  ngOnInit() {
  }

}
