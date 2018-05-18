import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, CountryService } from '../../service/index';
import {OrderPipe} from "../../order.pipe"

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styles: []
})
export class CountryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }
}


@Component({
  selector: 'app-countrylist',
  templateUrl: './countrylist.component.html',
  styles: []
})
export class CountrylistComponent implements OnInit {
	  
    order: string = 'name';
    userFilter: any = { name: '' };
    reverse: boolean = false;
    users= [];

  	constructor(public countryService: CountryService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {     
      this.loadAllUsers();
    }

    public loadAllUsers() {
        this.countryService.getAll().subscribe(users => { 
          console.log(users);
          this.users = users.message;
           });
    }

    public deleteUser(id) {
      if(confirm("Are you sure to delete ?")) {
        this.countryService.deleteOne(id).subscribe(data => { 
                console.log(data)
                this.loadAllUsers();
                this.alertService.success('Country Deleted successful', true);
                this.router.navigate(['/admin/country/list']);
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
  selector: 'app-countryadd',
  templateUrl: './countryadd.component.html',
  styles: []
})
export class CountryaddComponent implements OnInit {
    userAddModel: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public countryService: CountryService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.userAddModel = this.lf.group({
            name: ['', Validators.required]
        });
        
    }

      public userAdd() {
      
        this.countryService.addUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Country Add successful', true);
                this.router.navigate(['/admin/country/list']);
            }
        );
    }
}


