import { Component, OnInit , OnDestroy} from '@angular/core';
import {SocketService} from '../../service/index';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerCommonComponent implements OnInit, OnDestroy {
  customerInfo :any;
  
  constructor(private socketService : SocketService, private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    console.log("CustomerCommonComponent inline");  
   
   /*
   if(window.location.pathname.split("/")[2] == 'reset-password'){
     this.showheader = false;
    }
   */

  	if(localStorage.getItem('currentCustomer')){   
    this.customerInfo = JSON.parse(localStorage.getItem('currentCustomer'))._id;
    this.socketService.onReloadCustomerOnline();
    }
  }
   ngOnDestroy() {
     this.socketService.customerOffline();
   }

}
