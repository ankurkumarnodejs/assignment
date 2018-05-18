import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, CustomerService, SocketService } from '../../service/index';
import {OrderPipe} from "../../order.pipe"
declare var toastr : any;


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: []
})

export class CustomerComponent implements OnInit {
  constructor(public socketService : SocketService) { }
  ngOnInit() {}
}



@Component({
  selector: 'app-customerlist',
  templateUrl: './customerlist.component.html',
  styles: []
})
export class CustomerlistComponent implements OnInit {

	  order: string = 'title';
    customerFilter: any = { email: '' };
    reverse: boolean = false;
    customerslist:any= [];
    reported : any = [];
    blocked : any = [];

  	constructor(public customerService: CustomerService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
      this.loadAllreport();
      this.loadAllBlocked();      
      this.loadAllCustomers();
     }

    public loadAllCustomers() {      
        this.customerService.getAll().subscribe(customers => {
          
          console.log("customers");
          console.log(customers);

         this.customerslist = customers.message;
         });
    }

    public loadAllreport(){
       this.customerService.getAllreport().subscribe(data => {         
         this.reported = data.message;        
       });
      }
   
   public loadAllBlocked(){
      this.customerService.getAllBlocked().subscribe(data => {
         this.blocked = data.message;       
       });

   }

   public checkreport(id){

   var index = this.reported.findIndex(item => {
     return item.FromId == id    
     });
   if(index != -1){
     return true;
   }else{
     return false;
   }

   }

 public checkblock(id){
   var index = this.blocked.findIndex(item => {
     return item.FromId == id    
   });

   if(index != -1){
     return true;
   }else{
     return false;
   }   
   }


  public deleteCustomer(id) {
      if(confirm("Are you sure to delete ?")) {
        this.customerService.deleteOne(id).subscribe(data => {          
                this.loadAllCustomers();
                this.alertService.success('Customer Deleted successful', true);
                this.router.navigate(['/admin/customer/list']);
         });
      }
    }

  public sortBy(data) {
        this.order = data;
        if (this.reverse == false) {
            this.reverse = true;
        }else{
            this.reverse = false;
        }
    }
}

  @Component({
    selector: 'app-customeradd',
    templateUrl: './customeradd.component.html',
    styles: []
  })
  export class CustomeraddComponent implements OnInit {

    customerAddModel: FormGroup;
    err:any;

    constructor(
      public lf: FormBuilder, 
      public customerService: CustomerService,
      public router: Router,
      public alertService: AlertService,
      public route: ActivatedRoute,
      ) {}

    ngOnInit() {
      this.customerAddModel = this.lf.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', Validators.required],
        phone: [],
        age: [],
        gender: ['', Validators.required],
        featured : [],
        activate : []
      });
    }

    public customerAdd() {
      this.customerAddModel.controls["activate"].setValue(true);
      this.customerService.addCustomer(this.customerAddModel.value).subscribe(
        (data) => {
          console
          if(data.error){
          toastr.remove();
          toastr.error(data.message);
          }else{
          toastr.remove();
          toastr.success('Add successfully');
          this.router.navigate(['/admin/customer/list']);
          }          
        });
     }

  }




@Component({
  selector: 'app-customerupdate',
  templateUrl: './customerupdate.component.html',
  styles: []
})
export class CustomerupdateComponent implements OnInit {
    customers:any;
    customerUpdateModel: FormGroup;
    err:any;

      constructor(public lf: FormBuilder, public alertService: AlertService,public customerService: CustomerService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getCustomer(id);
        });

        this.customerUpdateModel = this.lf.group({
            _id: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', Validators.required],
            phone: [],
            age: [],
            gender: ['', Validators.required],
            featured : []
        });
      }

    
      public getCustomer(id) {
        this.customerService.getOne(id).subscribe(customers => { 
            this.customers = customers.message; 
            this.customerUpdateModel.patchValue(this.customers);
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
            });
       }


    public customerUpdate() {  
        this.customerService.updateCustomer(this.customerUpdateModel.value).subscribe(
            (data) => {           
                this.alertService.success('Customer Updated successful', true);
                this.router.navigate(['/admin/customer/list']);
            });
    }
}



@Component({
  selector: 'app-blockedusers',
  templateUrl: './blockedusers.component.html',
  styles: []
})
export class AdminShowBlockedUserComponent implements OnInit {

    userid : any;
    userblock : any = [];
    customerFilter: any = { firstname: '' };

    constructor(public customerService: CustomerService,public router: Router,public alertService: AlertService, public activatedRoute : ActivatedRoute) { }

    ngOnInit() {        
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userid = params['id'];   
            this.loadBlockedUser();         
        });
       }

    public loadBlockedUser() {

        var obj = {FromId : this.userid, status : 4};
        this.customerService.loadAllBlockedUser(obj).subscribe(data => {          
          for(var i=0; i<data.message.length; i++){           
           this.userblock.push(data.message[i]);         
          } 
        });
        
    }
}



@Component({
  selector: 'app-blockedusers',
  templateUrl: './abusereport.component.html',
  styles: []
})
export class AdminViewAbuseReportComponent implements OnInit {

    userid : any;
    details : any = [];
    customerFilter: any = { firstname: '' };
    
    constructor(public customerService: CustomerService,public router: Router,public alertService: AlertService, public activatedRoute : ActivatedRoute) { }

    ngOnInit() {        
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userid = params['id'];   
            this.loadReportUser();         
        });
       }

    public loadReportUser() {
        var obj = {FromId : this.userid};
        this.customerService.loadReports(obj).subscribe(data => {          
          this.details = data.message;         
        });
        
    }
}




