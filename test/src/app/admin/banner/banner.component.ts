import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, BannerService } from '../../service/index';
import { FileUploader } from 'ng2-file-upload';
import {OrderPipe} from "../../order.pipe"
import * as globalVariable from "../../global";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styles: []
})
export class BannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}

@Component({
  selector: 'app-bannerlist',
  templateUrl: './bannerlist.component.html',
  styles: []
})
export class BannerlistComponent implements OnInit {
	  order: string = 'title';
    userFilter: any = { title: '' };
    reverse: boolean = false;
    users= [];
    url :any = globalVariable.imageUrl;
    
  	constructor(public bannerService: BannerService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
      this.loadAllUsers();
    }

    public loadAllUsers() {
        this.bannerService.getAll().subscribe(users => {

         
          this.users = users.message;
           console.log("this.users"); 
          console.log(this.users); 
        });
    }

    public deleteUser(id) {
       if(confirm("Are you sure to delete ?")) {
        this.bannerService.deleteOne(id).subscribe(data => { 
                console.log(data)
                this.loadAllUsers();
                this.alertService.success('Banner Deleted successful', true);
                this.router.navigate(['/admin/banner/list']);
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
  selector: 'app-banneradd',
  templateUrl: './banneradd.component.html',
  styles: []
})
export class BanneraddComponent implements OnInit {
    userAddModel: FormGroup;
    err:any;
    imageUrl: string = globalVariable.url+'uploads';
    public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload' });
    filterx : any = "";
    progress: any = 0;
    constructor(
        public lf: FormBuilder, 
        public bannerService: BannerService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.userAddModel = this.lf.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            description: ['', Validators.required],
            path : []
        });
        }


  public onChangeImg(event){ 
    this.progress = 0;     
  }

  

    public userAdd() {        
    this.uploader.uploadAll();

  this.uploader.onProgressItem = (file: any, progress: any) =>{
         this.progress = progress;
         } 
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var responsePath = JSON.parse(response);      
      this.userAddModel.controls['path'].setValue(responsePath.filename);
        this.bannerService.addUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Banner Add successful', true);
                this.router.navigate(['/admin/banner/list']);
                });
           }
        }
      }


@Component({
  selector: 'app-bannerupdate',
  templateUrl: './bannerupdate.component.html',
  styles: []
})
export class BannerupdateComponent implements OnInit {

    users:any;
    userAddModel: FormGroup;
    err:any;     
    imageUrl: string = globalVariable.url+'uploads';
    public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload' });
    filterx : any;
    currentimg : any;
    updateimg : any = true;
    progress :any = 0;
 
      constructor(public lf: FormBuilder, public alertService: AlertService,public bannerService: BannerService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            title: ['', Validators.required],
            type: ['', Validators.required],
            description: ['', Validators.required],
            path : []
        });

      }   
   

   public onChangeImg(event){ 
    this.progress = 0;     
    }


     upimg(action){
     if(action == 'show'){
       this.updateimg = false;
     }else{
       this.updateimg = true;
     }
     }

      public getUsers(id) {
        this.bannerService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            console.log(this.users);
            this.currentimg = this.users.path;
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
        });
       }

    public userUpdate() {
    if(this.updateimg == false){
   console.log("uplpoad"); 

    this.uploader.uploadAll();
 this.uploader.onProgressItem = (file: any, progress: any) =>{
         this.progress = progress;
         } 
    
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var responsePath = JSON.parse(response); 
      console.log(responsePath);     

      this.userAddModel.controls['path'].setValue(responsePath.filename);
      console.log(this.userAddModel.value);
        this.bannerService.updateUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Banner Add successful', true);
                this.router.navigate(['/admin/banner/list']);
                });
           }
        }
        else{
          console.log("notuplpoad");
            this.bannerService.updateUser(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Banner Add successful', true);
                this.router.navigate(['/admin/banner/list']);
                });
        }
     }
}
