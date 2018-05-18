import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, BannerService } from '../../service/index';
import { FileUploader } from 'ng2-file-upload';
import {OrderPipe} from "../../order.pipe"
import * as globalVariable from "../../global";



@Component({
  selector: 'app-bannertime',
  templateUrl: './banner.component.html',
  styles: []
})
export class BannerTimeComponent implements OnInit {
  constructor() { }
  ngOnInit() {}
}



@Component({
  selector: 'app-bannertime',
  templateUrl: './banneradd.component.html',
  styles: []
})
export class BanneraddTimeComponent implements OnInit {
    userAddModel: FormGroup;
    settiming : any = [{time : ""}];

    constructor(
        public lf: FormBuilder, 
        public bannerService: BannerService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.userAddModel = this.lf.group({
            bannertiming: [],            
        });
        }

    public addmorefield(){
      this.settiming.push({time : ""});
    }        

    public userAdd() {  
   
      this.userAddModel.controls["bannertiming"].setValue(this.settiming);

        this.bannerService.addTiming(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Banner Add successful', true);
                this.router.navigate(['/admin/bannersetting/list']);
                });
           }  

    

  }


  
@Component({
  selector: 'app-bannertimeimage',
  templateUrl: './banneraddimage.component.html',
  styles: []
})
export class BanneraddTimeImageComponent implements OnInit {

    userAddModel: FormGroup;
    settiming : any = [{time : ""}];

    constructor(
        public lf: FormBuilder, 
        public bannerService: BannerService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.userAddModel = this.lf.group({
            bannertiming: [],            
        });
        }

    public addmorefield(){
      this.settiming.push({time : ""});
    }
        

    public userAdd() {

      this.userAddModel.controls["bannertiming"].setValue(this.settiming);
        this.bannerService.addTimingImage(this.userAddModel.value).subscribe(
            (data) => {
                this.alertService.success('Banner Add successful', true);
                this.router.navigate(['/admin/bannersetting/list']);
                });
           }

  }




@Component({
  selector: 'app-bannerlisttime',
  templateUrl: './bannerlist.component.html',
  styles: []
})
export class BannerlistTimeComponent implements OnInit {

	  order: string = 'title';   
    users : any = [];
    images : any = [];

  	constructor(public bannerService: BannerService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
      this.loadAllUsers();
      this.loadAllUsersImage();
    }

    public loadAllUsers() {
        this.bannerService.getAllTime().subscribe(users => { 
          console.log(users);
          if(users.message.length > 0){
            console.log(users.message);
          this.users = users.message[0];
          }else{
          this.users = [];
           } 
           });
        }    

    public loadAllUsersImage() {

        this.bannerService.getAllTimeImage().subscribe(users => {
          console.log("usersImage");
          console.log(users);
          if(users.message.length > 0){
          this.images = users.message[0];
          }else{
          this.images = [];
          } 
         });

          }

     public deleteBannerTimes(id, type, index){

          if(type == 'video'){

          this.users.bannertiming.splice(index, 1);  
          console.log("new1");
          console.log(this.users.bannertiming,index);

          var obj1 = {_id: id, type : 'video', bannertiming : this.users.bannertiming};
          console.log("obj1");
          console.log(obj1);
          this.bannerService.updateBannerTime(obj1).subscribe((data) => {
           console.log("done1")
          // this.loadAllUsers();
          });
          }

          if(type == 'image'){
          this.images.bannertiming.splice(index, 1);                 
          var obj2 = {_id: id, type : 'image', bannertiming : this.images.bannertiming};
          console.log("obj2");
          console.log(obj2);
          this.bannerService.updateBannerTime(obj2).subscribe((data) => {
           console.log("done2")
           //this.loadAllUsersImage();
          });
          }
    }     
    
    public deleteUser(id){
        this.bannerService.deleteOneTime(id).subscribe(users => { this.users = users.message; });
    }
   
   public deleteUserImage(id){
        this.bannerService.deleteOneTimeImage(id).subscribe(users => { this.images = users.message; });
   }
}


  
