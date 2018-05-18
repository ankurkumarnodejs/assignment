import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule , FormsModule } from '@angular/forms';
import { CustomerService} from '../../service/index';
declare var toastr : any;
toastr.options.timeOut = 3000;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
 constructor(public lf: FormBuilder, public router : Router, public activatedRoute : ActivatedRoute, public customerService: CustomerService) { }

   
    changePasswordModel : FormGroup;       
    Match : any = false;   
    cid : any;

    ngOnInit() {

        this.activatedRoute.params.subscribe((params) => {
        	console.log("params");
        	console.log(params);
            this.cid = params['id']; 
        }); 

        this.changePasswordModel = this.lf.group({            
            password: ['', Validators.required],
            confirmpassword : ['', Validators.required],
            matchpass : ['', Validators.required]            
        });
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
        var obj = {_id : this.cid, password : this.changePasswordModel.value.password};
        this.customerService.updateCustomer(obj).subscribe(update => {  
            toastr.success("Password has Change Successfully?");
            this.router.navigate(['/']);
        });
    }

}
