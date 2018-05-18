import { Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, UsersService ,FriendService} from '../../service/index';
import {OrderPipe} from "../../order.pipe"
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})

export class UsersComponent implements OnInit {

    order: string = 'firstname';
    userFilter: any = { username: '' };
    reverse: boolean = false;
	users= [];

  	constructor(public usersService: UsersService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
        this.loadAllUsers();
  	}

    public loadAllUsers() {
        this.usersService.getAll().subscribe(users => { this.users = users.message; });
    }

    public deleteUser(id) {
      if(confirm("Are you sure to delete ?")) {
        this.usersService.deleteOne(id).subscribe(data => { 
                console.log(data)
                this.loadAllUsers();
                this.alertService.success('User Deleted successful', true);
                this.router.navigate(['/admin/users']);
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
  selector: 'app-users',
  templateUrl: './usersadd.component.html',
  styles: []
})
export class UsersaddComponent implements OnInit {

    userAddModel: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public usersService: UsersService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.userAddModel = this.lf.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required]
            
        });        
    }

    public userAdd() {        
        this.usersService.addUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('User Add successful', true);
                this.router.navigate(['/admin/users']);
            }
        );
    }
}




@Component({
  selector: 'app-users',
  templateUrl: './usersupdate.component.html',
  styles: []
})
export class UsersupdateComponent implements OnInit {

    users:any;
    userAddModel: FormGroup;
    err:any;

    constructor(public lf: FormBuilder, public alertService: AlertService,public usersService: UsersService,public router: Router,public activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });
        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
    
    public getUsers(id) {
        this.usersService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

    public userUpdate() {
        console.log(this.userAddModel.value);
        this.usersService.updateUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('User Updated successful', true);
                this.router.navigate(['/admin/users']);
            }
        );
    }

}

