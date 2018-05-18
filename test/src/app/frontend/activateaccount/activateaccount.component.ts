import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../service/index';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var toastr : any;
toastr.options.timeOut = 3000;

@Component({
	selector: 'app-activateaccount',
	templateUrl: './activateaccount.component.html',
	styleUrls: ['./activateaccount.component.css']
})
export class ActivateAccountComponent implements OnInit {
	cid : any;
	constructor(private router : Router, private activatedRoute : ActivatedRoute, private customerService: CustomerService) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.cid = params['activationid'];  
			this.mailactivate();              
		});    
	}

	private mailactivate(){

		var obj = {_id : this.cid, activate: true};
		this.customerService.updateCustomer(obj).subscribe((data) => {
			if (data.error) {
				toastr.remove();
				toastr.error("Something Wrong"); 
			}else{
				toastr.remove();
				toastr.success("Your Account has Activated! Please Login "); 				
				setTimeout(() => {
                 this.router.navigate(['/']);
				}, 2000);
				
			}
		});  

	}

}
