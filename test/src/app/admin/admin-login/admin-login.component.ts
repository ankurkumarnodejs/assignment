import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService, AuthService, UsersService } from '../../service/index';
declare var $: any ;


@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styles: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    forgetForm: FormGroup; 
    loginForm: FormGroup;
    returnUrl: string;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        public usersService: UsersService

        ) { }


    ngOnInit() {
        //this.authService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.loginForm = this.lf.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
        this.forgetForm = this.lf.group({
            email: ['', [Validators.required]]
        });
    }

    login(){

        this.authService.getUser(this.loginForm.value).subscribe(
            (data) => {
                this.router.navigate([this.returnUrl]);
            });
          }     
    
    public  forgetPass(){
    this.usersService.forgetPassword(this.forgetForm.value).subscribe((data) => {
      if (data.error){
      alert("wrong email address");  
      }else{     
      $(function () {
      $('#myModal').modal('toggle');
      });
      alert("check you email");  
      }
    });
    }

}



@Component({
    selector: 'app-admin-Registration',
    templateUrl: './admin-registration.component.html',
    styles: []
})

export class AdminRegistrationComponent implements OnInit {

    adminRegistrationForm: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public usersService: UsersService,
        public router: Router,
        public route: ActivatedRoute,
        ){}

    ngOnInit() {
        this.adminRegistrationForm = this.lf.group({
            firstname: ['', Validators.required],
            lastname: [''],
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', Validators.required],
        });
    }

    adminRegistration(){
        this.usersService.adminRegistration(this.adminRegistrationForm.value).subscribe(
            (data) => {
                this.router.navigate(['/admin/login']);
            });
    }

}




@Component({
 selector: 'app-resetpassword',
 templateUrl: './admin-reset-password.component.html',
})
export class AdminResetPasswordComponent implements OnInit {

 changePasswordModel : FormGroup;       
 Match : any = false;   
 cid : any;
 userdetail : any;

 constructor(public lf: FormBuilder, public router : Router, public activatedRoute : ActivatedRoute, public usersService: UsersService) { }

 ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.cid = params['id'];
        this.getuserdetail();
        }); 
         this.changePasswordModel = this.lf.group({            
            password: ['', Validators.required],
            confirmpassword : ['', Validators.required],
            matchpass : ['', Validators.required]            
            });
        }


  public getuserdetail(){
   this.usersService.getOne(this.cid).subscribe((data) => {
     this.userdetail = data.message;
     console.log(data);
   })
  }

  public matchpassword(){  
   
    if(this.changePasswordModel.value.password == this.changePasswordModel.value.confirmpassword){        
     this.changePasswordModel.controls["matchpass"].setValue(true);
     this.Match = false;
    }else{
     this.changePasswordModel.controls["matchpass"].setValue("");
     this.Match = true;
    }

    }  
   
  public updatepassword() {

      var obj = {username : this.userdetail.username, id : this.cid, password : this.changePasswordModel.value.password};
      this.usersService.updatePassword(obj).subscribe(update => {  
          alert("password change");
          this.router.navigate(['/']);
       });
      }

}


