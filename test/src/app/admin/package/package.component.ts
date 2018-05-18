import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, PackageService } from '../../service/index';
import {OrderPipe} from "../../order.pipe"


@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styles: []
})
export class PackageComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}

@Component({
  selector: 'app-bannerlist',
  templateUrl: './packagelist.component.html',
  styles: []
})
export class PackagelistComponent implements OnInit {

  order: string = 'name';
  userFilter: any = { name: ''};
  reverse: boolean = false;
  users : any  = [];

  constructor(public packageService: PackageService,public router: Router,public alertService: AlertService) { }

  ngOnInit() {
    this.loadAllUsers();
  }

  public loadAllUsers() {
    this.packageService.getAll().subscribe(users => { 

      this.users = users.message;

       console.log(users.message);
       console.log("users.message");
     });
  }

  public deleteUser(id) {
    if(confirm("Are you sure to delete ?")) {
      this.packageService.deleteOne(id).subscribe(data => { 
        console.log(data)
        this.loadAllUsers();
        this.alertService.success('Package Deleted successful', true);
        this.router.navigate(['/admin/package/list']);
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
  selector: 'app-packageadd',
  templateUrl: './packageadd.component.html',
  styles: []
})
export class PackageaddComponent implements OnInit {
  userAddModel: FormGroup;
  err:any;

  constructor(
    public lf: FormBuilder, 
    public packageService: PackageService,
    public router: Router,
    public alertService: AlertService,
    public route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.userAddModel = this.lf.group({
      name: ['', Validators.required],
      noofcalls: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });

  }

  public userAdd() {
    this.packageService.addUser(this.userAddModel.value).subscribe(
      (data) => {
        this.alertService.success('Package Add successful', true);
        this.router.navigate(['/admin/package/list']);
      }
      );
  }
}


@Component({
  selector: 'app-packageupdate',
  templateUrl: './packageupdate.component.html',
  styles: []
})
export class PackageupdateComponent implements OnInit {
  
  users:any;
  userAddModel: FormGroup;
  err:any;

  constructor(public lf: FormBuilder, public alertService: AlertService,public packageService: PackageService,public router: Router,public activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      let id = params['id'];
      this.getUsers(id);
    });

    this.userAddModel = this.lf.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      noofcalls: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });
  }  

  public getUsers(id) {
    this.packageService.getOne(id).subscribe(users => { 
      this.users = users.message; 
      this.userAddModel.patchValue(this.users);
      // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
    });
  }

  public userUpdate() {
    console.log(this.userAddModel.value);
    this.packageService.updateUser(this.userAddModel.value).subscribe(
      (data) => {
        this.alertService.success('Package Updated successful', true);
        this.router.navigate(['/admin/package/list']);
      }
      );
  }
}
