import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, PageService } from '../../service/index';
import {OrderPipe} from "../../order.pipe"



@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styles: []
})
export class PageComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
}



@Component({
  selector: 'app-pagelist',
  templateUrl: './pagelist.component.html',
  styles: []
})
export class PagelistComponent implements OnInit {
	  order: string = 'title';
    userFilter: any = { title: '' };
    reverse: boolean = false;
     users= [];
  	constructor(public pageService: PageService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
      this.loadAllUsers();
    }

    public loadAllUsers() {
        this.pageService.getAll().subscribe(users => { this.users = users.message; });
    }

    public deleteUser(id) {
      if(confirm("Are you sure to delete ?")) {
        this.pageService.deleteOne(id).subscribe(data => { 
                console.log(data)
                this.loadAllUsers();
                this.alertService.success('Page Deleted successful', true);
                this.router.navigate(['/admin/page/list']);
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
  selector: 'app-pageadd',
  templateUrl: './pageadd.component.html',
  styles: []
})
export class PageaddComponent implements OnInit {
    userAddModel: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public pageService: PageService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.userAddModel = this.lf.group({
            title: ['', Validators.required],
            url : ['', Validators.required],
            description: ['', Validators.required],
        });
        
    }

      public userAdd() {
        this.userAddModel.controls["url"].setValue(this.userAddModel.value.url.toLowerCase().replace(/ /g,"-")); 
        this.pageService.addUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Page Add successful', true);
                this.router.navigate(['/admin/page/list']);
            }
        );
    }
}





@Component({
  selector: 'app-pageupdate',
  templateUrl: './pageupdate.component.html',
  styles: []
})
export class PageupdateComponent implements OnInit {
    users:any;
    userAddModel: FormGroup;
    err:any;

      constructor(public lf: FormBuilder, public alertService: AlertService,public pageService: PageService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            title: ['', Validators.required],
            url : ['', Validators.required],
            description: ['', Validators.required],
        });

      }

    
      public getUsers(id) {
        this.pageService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
        });
    }

    public userUpdate() {
        console.log(this.userAddModel.value);
        this.pageService.updateUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Page Updated successful', true);
                this.router.navigate(['/admin/page/list']);
            }
        );
    }
}



