import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class AdminHeaderComponent implements OnInit {
	  currentUser: any = {};
  	constructor() { 
  		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  	}

  ngOnInit() {

  }

}
