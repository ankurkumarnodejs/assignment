import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService} from '../../../service/index';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReCaptchaComponent } from 'angular2-recaptcha';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    page : any;
    pageDetail : any = {};
    contactAddModel : any;
    cp : any = '';
    success : any = false;

    constructor(
        private lf: FormBuilder, 
        private router: Router,       
        private route: ActivatedRoute,
        private customerService: CustomerService
    ) {}
    
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.page = params['page'];
            //this.getPage();
        });
        this.contactAddModel = this.lf.group({ 
            name : ['',Validators.required],
            email : ['',Validators.required], 
            phone : ['',Validators.required],
            message : ['',Validators.required],
            capcontrol : ['',Validators.required]
        }); 
    }

    sfalse(){
        this.success = false;
    }
    
    handleCorrectCaptcha(event){
        this.cp = true;
        this.contactAddModel.controls["capcontrol"].setValue(this.cp); 
    }

    onCaptchaExpired(){
        this.cp = ''; 
        this.contactAddModel.controls["capcontrol"].setValue(this.cp); 
        this.captcha.reset();   
    }

    contactSubmit(){
        this.customerService.sendContactQuery(this.contactAddModel.value).subscribe(data => {                
            this.success =  true; 
            this.contactAddModel.reset(); 
            this.cp = '';           
            this.captcha.reset();                                                        
        });
    }

}
