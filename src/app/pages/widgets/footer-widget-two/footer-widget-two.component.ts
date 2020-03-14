import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-widget-two',
  templateUrl: './footer-widget-two.component.html',
  styleUrls: ['./footer-widget-two.component.css']
})
export class FooterWidgetTwoComponent implements OnInit {

  public copyDate:any;

  constructor() { this.copyDate = new Date(); }

  ngOnInit() {
  }

}
