import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AlertService, AuthService, UsersService,CustomerService, SocketService, PageService} from '../../service/index';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule , FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as globalVariable from "../../global";
declare var $ : any; 

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styles: []
})
export class CustomerHeaderComponent implements OnInit {

	currentCustomer: any = "";
  loginForm: FormGroup;
  userRegistrationForm: FormGroup;
  notificationsdata : any = {unreadlength : "", unread : []};
  url :any = globalVariable.url+'uploads/';
  profile :any;
  unreadMessages: any = [];
  unreadMessagesCount: any = 0;

  	constructor(
    private lf: FormBuilder, 
    private authService: AuthService,
    private usersService: UsersService,
    private customerService:CustomerService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private socketService : SocketService,
    private pageService : PageService
      ) { 

        if(localStorage.getItem('currentCustomer')){
          this.currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
          //console.log('sdggs',this.currentCustomer);
          this.setCustomerDetail();
        }

  	    }
  ngOnInit() {    
    this.loginForm = this.lf.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.Initnotifications();
    this.notifications();
    this.notifications2();
    this.myMessage();        
  }

  profilePic(pic){
    let imagePath : any;
    if (typeof pic == 'undefined' || pic == 'null') {
      imagePath = "assets/images/face3.png";
    }else{
      imagePath = this.url + pic;
    }

    return imagePath;
  }

  loginCustomer(){
    this.authService.getCustomer(this.loginForm.value).subscribe(
      (data) => {        
        console.log("login action");        
        console.log(data); 
         if(data.error){
            alert("wrong credentials");
            }else{
        localStorage.setItem('currentCustomer', JSON.stringify(data.data));
        this.socketService.customerOnline();                   
        this.alertService.success('Login successful', true);
        if(localStorage.getItem('currentCustomer')){
          this.currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
          this.setCustomerDetail();
        }
        this.router.navigate(['/customer/profile']);
        }
      });
  }
 
  private Initnotifications(){
  this.customerService.initnotifications(this.currentCustomer._id).subscribe(ndata => {
    /*console.log("ndata.message");
    console.log(ndata.message);*/
    this.notificationsdata.unreadlength = ndata.message.length;
    this.notificationsdata.unread = ndata.message;
  });
  }
  
  private notifications(){
  this.socketService.notifyResponse().subscribe(ndata => {
    /*console.log("ndata resp");
    console.log(ndata);*/
    this.notificationsdata.unreadlength = ndata.length;
    this.notificationsdata.unread = ndata;
    });
  }

  private notifications2(){
  this.socketService.notifyResponse2().subscribe(ndata => {
    console.log("ndata resp2");
    console.log(ndata);
    this.notificationsdata.unreadlength = ndata.length;
    this.notificationsdata.unread = ndata;
    });
  }

  private readNotifications(){
    if(this.notificationsdata.unreadlength > 0){
     this.customerService.readnotifications(this.currentCustomer._id).subscribe(message => {
     console.log(message.message);
     this.notificationsdata.unreadlength = 0;
   });
    }
  }

  private checktitle(noti){
    var newurl = "";
    if(noti.title == 'view'){
    newurl = '/customer/profile/'+noti.FromId._id;
    }
    if(noti.title == 'request'){
    newurl = '/customer/profile';
    }
    if(noti.title == 'accept'){
    newurl = '/customer/profile';
    }
    return newurl;
  }


  private setCustomerDetail(){
    this.customerService.getOne(this.currentCustomer._id).subscribe(customer => { 
     this.profile = customer.message;
    });
}



private myMessage(){
  this.unreadMessagesCount = 0;
  this.customerService.unreadMessage({id : this.currentCustomer._id}).subscribe(messages=> {
      
      let data1 = messages.message;
      let data = messages.message;
      var arr = [];

      for(var i=0; i<data.length ; i++){
      var obj =  {"id" : data[i].id, "messages": []};
      for(var j=0; j<data[i].messages.length; j++){

        
      if(data[i].messages[j].isread == false){
       this.unreadMessagesCount = this.unreadMessagesCount + 1;
       }

        obj.messages.push(data[i].messages[j]);
      }
      arr.push(obj);
      if(i == (data.length-1)){        
       this.unreadMessages = arr;
       }
      }
  });
}


private selectChat(id){
        this.socketService.selectForChat(id, this.currentCustomer._id);
        setTimeout(() => {
        this.myMessage();        
        }, 2000);
    }


}

