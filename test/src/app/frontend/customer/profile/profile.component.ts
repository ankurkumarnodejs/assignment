import { Component, OnInit,ElementRef ,AfterContentInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CustomerService, FriendService, SocketService } from '../../../service/index';
declare var $ : any;
declare var toastr : any;
toastr.options.timeOut = 3000;
import * as globalVariable from "../../../global";
declare var google : any;




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

  dataset : any= { "height" : "", "userheight" : {"feet": "", "inch": ""}, "haircolor" : "", "bodyshape": "", "maritalStatus" : "","haveChildren": "", "smoke": "" , "drink":"", "profession" : ""};

  datasetpref : any= {"minheight" : "", "maxheight" : "", "haircolor" : "", "bodyshape": "", "maritalStatus" : "" , "haveChildren": "", "smoke": "" , "drink":"", "profession" : ""};


  questions : any = [
    {"option": [{"name" : "feet"},{"name" : "inch"}]},
    {"option": ["Black","Light Brown","Brunette/Brown","Red","Blonde","White","Bald/Shaven","Other"]},
    {"option": ["Petite","Slender","Medium","Few Extra Pounds","Well Built","Overweight"]},
    {"option": ["Single","Married"]},
    {"option": ["Yes","No"]},
    {"option": ["High School","Some College","College Graduate","Some Post-College","Master’s","Professional Qualification","Student"]},
    {"option": ["Aircraft Dispatcher","Aircraft Mechanic","Airline Pilot","Flight Attendant","Arts","Actor","Architecture","Art Appraiser","Art Auctioneer","Artist","Museum Jobs","Music Conductor","Business","Accountant","Administrative","Assistant/Secretary","Advertising","Consultant","Financial Advisor","Fundraiser","Government Job","Human Resources","Insurance Agent","Investment Banker", "Lawyer","Management","Market Research Analyst","Nonprofit Job","Law Enforcement","Criminal Justice","Federal Law Enforcement","Police Officer","Media","Book Publishing","Freelance Editor","Freelance Writer","Public Relations","Web Developer","Writer/Editor","Medical","Doctor","Nurse","Paramedic","Psychologist","Social Worker","Veterinarian","Service Industry","Bank Teller","Call Center","Funeral Director","Hair Stylist","Personal Fitness Trainer","Retail","Sales","Ski Instructor","Waiter","Wedding Planner","Career Counselor","Substitute Teacher","Teacher","App Developer","Computer Programmer","Database Administrator","Programmer","Software Developer","Web Developer","Other"]},
    {"option": []}
    ];

  url = globalVariable.url+'uploads/';    
  profile:any;
  profileUpdateModel: FormGroup;
  otherinfoUpdateModel: FormGroup;
  preferecesUpdateModel: FormGroup;
  changePasswordModel: FormGroup;
  addVideolinkModel: FormGroup;
  objectForCustomerDetail : any = {"interest" : [], "photosprocess" : 0, "videoprocess" : 0};
  customerInfo : any; 
  public uploader:FileUploader = new FileUploader({url: globalVariable.url+'upload'});
  public uploader2:FileUploader = new FileUploader({url: globalVariable.url+'upload'});
  public uploader3:FileUploader = new FileUploader({url: globalVariable.url+'upload'});
  oldmatch: any= false;
  Match: any= false;
  packages : any = [];
  packageDetail : any = {};
  profiles : any = [];
  reqPending : any = [];
  friendTab : any = 'myfriends';
  unreadMessages: any = [];
  notificationsdata: any = [];
  profilePic: any = [];
  defa :any = false;
  nowactive : any;
  paramtype : any;
	/*
	searchCriteriaModel: FormGroup;
	addVideolinkModel: FormGroup;
	changePasswordModel: FormGroup;
	*/

  constructor(
    public element: ElementRef,
    public lf: FormBuilder,
    public  customerService: CustomerService,
    public friendService: FriendService,
    public socketService : SocketService,
    public activatedRoute: ActivatedRoute,
    public router : Router
    ) {
    var initcm : any = parseFloat('121.92');
    for(let i=0; i<=47; i++){
      var new_cm =  parseFloat(initcm).toFixed(0)
      this.questions[7].option.push(new_cm);
      initcm += parseFloat('2.54');
    }
    if(localStorage.getItem('currentCustomer')){      
      this.customerInfo = JSON.parse(localStorage.getItem('currentCustomer'));
    } 

    this.activatedRoute.queryParams.subscribe(params => {
      this.paramtype = params["type"];
      console.log("this.paramtype");
      console.log(this.paramtype);

      this.loadDefaults();
    });
  }


  ngOnInit() {        
    this.profileUpdateModel = this.lf.group({
      _id: ['', Validators.required],
      name : [''],
      username: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      dateofbirth: ['', Validators.required],
      sexualorient : [],
      interests : [],            
      countryName: ['',Validators.required],
      cityName : ['',Validators.required],
      lat : ['',Validators.required],
      lng : ['',Validators.required],
      gender: ['', Validators.required],
      profilePic: [],
      description : [],
      templocation : []
    });
       
    this.otherinfoUpdateModel = this.lf.group({
      _id: [],
      height: ['',Validators.required],          
      haircolor: ['', Validators.required],
      bodyshape: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      haveChildren: [],
      smoke : ['', Validators.required],
      drink : ['', Validators.required],            
      profession : ['', Validators.required]
    });

    this.preferecesUpdateModel = this.lf.group({
      maxheight: ['', Validators.required],
      minheight: ['', Validators.required],
      interestedin: [''],
      sexualorient: [''],
      haircolor: ['', Validators.required],
      bodyshape: ['', Validators.required],
      maritalStatus: [''],
      haveChildren: [''],
      smoke : [''],
      drink : [''],
      profession : [''],
    });

    this.changePasswordModel = this.lf.group({
      oldpassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword : ['', Validators.required],
      matchpass : ['', Validators.required],
      oldmatch : ['', Validators.required]
    });
    this.addVideolinkModel = this.lf.group({
      videolinks: ['',Validators.required]         
    });

    this.setCustomerDetail();
    this.getPackages();
    this.getnotifications();

    $(document).ready(()=>{
      $('#dateofbirth').datetimepicker({format:'YYYY-MM-DD'});    
    });
  }

  public loadDefaults(){
    if(this.paramtype == 'profile'){      
      /*$(".nav-pills > li").removeClass();
      $(".nav-pills > li:nth-child(7) >a").trigger('click'); 
      $(".nav-pills > li:nth-child(1) >a").addClass("active");*/
    }

    if(this.paramtype == 'membership'){
      /*$(".nav-pills > li").removeClass();
      $(".nav-pills > li:nth-child(8) >a").trigger('click');
      $(".nav-pills > li:nth-child(2) >a").addClass("active"); */
    }

    if(this.paramtype == 'friends'){
      //this.myFriends();  
      /*$(".nav-pills > li").removeClass();
      $(".nav-pills > li:nth-child(9) >a").trigger('click');
      $(".nav-pills > li:nth-child(3) >a").addClass("active"); */
      this.myFriends();
    } 

    if(this.paramtype == 'message'){
      /*$(".nav-pills > li").removeClass();
      $(".nav-pills > li:nth-child(10) >a").trigger('click');
      $(".nav-pills > li:nth-child(4) >a").addClass("active"); */
      this.myMessage();
    } 

    if(this.paramtype == 'visitor'){
      /*$(".nav-pills > li").removeClass();
      $(".nav-pills > li:nth-child(11) >a").trigger('click');
      $(".nav-pills > li:nth-child(5) >a").addClass("active"); */
      this.myViewed();
    }  

    if(this.paramtype == 'notification'){
      /*$(".nav-pills > li").removeClass();
      $(".nav-pills > li:nth-child(12) >a").trigger('click');
      $(".nav-pills > li:nth-child(6) >a").addClass("active"); */
      this.getnotifications();
    }
  }


  public preview(){
    this.router.navigate(['customer/public-profile/', this.customerInfo._id]); 
  }

  public onChangeProfile(){
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var responsePath = JSON.parse(response).filename;
      this.profile.profilePic = responsePath;
      console.log("nnnnn");
      this.customerUpdate({profilePic: responsePath});
    };
  }


  public makeprivate(type){
    var obj = {isprivate : type};
    this.customerUpdate(obj);
    this.setCustomerDetail();
  }

 

  public someEvent(){
    this.profiles = [];  
  }


  public unblockrequest(id) {
    var friendobj ={FromId: this.customerInfo._id, ToId: id, status:4};
    this.friendService.updateFriendunlock(friendobj).subscribe((data) => {
      this.myBlocked();
    });
  }


  public getnotifications(){
    this.customerService.allnotifications(this.customerInfo._id).subscribe(ndata => { 
      this.notificationsdata = ndata.message;
    });
  }



  public myMessage(){
    this.customerService.unreadMessage({id : this.customerInfo._id}).subscribe(messages=> {
      this.unreadMessages = messages.message;
      if (this.unreadMessages.length > 0) {
        for (var i = 0; i < this.unreadMessages.length; i++) {
          var unread = 0;
          for (var j = 0; j < this.unreadMessages[i]['messages'].length; j++) {
            /*console.log(this.unreadMessages[i]['messages'][j].toCustId,this.customerInfo._id )*/
            if ((this.unreadMessages[i]['messages'][j].isread == false) && (this.unreadMessages[i]['messages'][j].fromCustId._id != this.customerInfo._id)) {
              unread++;
            }
            this.unreadMessages[i]['unreadMessage'] = unread;
          }
        }
      }
    });
  }


public selectChat(id){
        this.socketService.selectForChat(id, this.customerInfo._id);
        setTimeout(() => {
            this.myMessage();        
        }, 1000);
    }


  public myFriends(){
    this.profiles = [];
    this.friendService.myfriends({id:this.customerInfo._id}).subscribe((data)=>{
      this.profiles = data.message;
    });
  }


  public myPendingRequests(){
    this.filterPendingRequest('sent')
  }

  filterPendingRequest(type){
    this.profiles = [];
    if (type == 'sent') {
      this.friendService.getSendRequest(this.customerInfo._id).subscribe((data)=>{
        if (!data.error) {
          data.message.forEach((fr)=>{
            this.profiles.push(fr.ToId)
          })
        }
      });
    }else{
      this.friendService.mypendingrequest({id:this.customerInfo._id}).subscribe((data)=>{
        this.profiles = [];
        this.profiles = data.message;
      });
    }
  }

  
  public myBlocked(){   
    this.profiles = [];
    this.friendService.myblocked({id:this.customerInfo._id}).subscribe((data)=>{
      console.log(" Bocked data");
      console.log(data);
      this.profiles = data.message;
    },(err)=>{
      console.log("Blocked err");
      console.log(err);
    });
  }

  
  public myViewed(){
  /*this.friendTab = 'views';  */
  this.setCustomerDetail();
  this.profiles = this.profile.visitors;
  }


  public getPackages(){      
    this.customerService.getAllPackage().subscribe(customers => { 
      this.packages = customers.message;            
    });      
  }

  public choosePackage(packages){
        packages.remaincalls = packages.noofcalls;        
        var cpackage = {mypackage : packages};
        this.customerUpdate(cpackage);        
        this.setCustomerDetail();
    }

    public getOnePackageDetail(id){
        this.customerService.getOnePackage(id).subscribe(customers => {             
            this.packageDetail =  customers.message;           
        });
    }

    public oldpassword(){
        if(this.profile.password == this.changePasswordModel.value.oldpassword){         
            this.changePasswordModel.controls["oldmatch"].setValue(true);
            this.oldmatch = false;
        }else{
            this.changePasswordModel.controls["oldmatch"].setValue("");
            this.oldmatch = true;
        }        
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
        var obj = {password : this.changePasswordModel.value.password};
        this.customerUpdate(obj);
    }


   public checkImage(src){
    if((src != 'undefined') && (src != '') && (typeof src !== 'undefined')){
    return globalVariable.url+'uploads/' + src;
    }else{
    return '../../assets/images/face.png';
    }
    }



      public otherinfoUpdate(){
        this.customerUpdate(this.otherinfoUpdateModel.value);
      }
      
      public preferecesUpdate(){
        console.log("preferecesUpdate");
        console.log(this.preferecesUpdateModel.value);
      this.customerUpdate({preferences : this.preferecesUpdateModel.value});
      }


      public onStepChange(type){
      if((type == 'height') && (this.dataset.userheight.feet != "") && (this.dataset.userheight.inch != "")){
      this.dataset.height = this.dataset.userheight.feet+'.'+this.dataset.userheight.inch;
      } 
      }


      public onStepChangepref(type){
      if((type == 'height') && (this.datasetpref.userheight.feet != "") && (this.datasetpref.userheight.inch != "")){
      this.datasetpref.height = this.datasetpref.userheight.feet+'.'+this.datasetpref.userheight.inch;
      } 
      } 

     public profileVideo(){
        this.uploader.uploadAll();
        this.uploader.onProgressItem = (file: any, progress: any) =>{
            //this.progress2 = progress;
        } 
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = JSON.parse(response);
        };  
    }


    public onChangePhotos(event){ 
        this.objectForCustomerDetail.photosprocess = 0;
    }
    
    public onChangeVideo(event){ 
        this.objectForCustomerDetail.photosprocess = 0;     
    }

    public myPhotos(){
        this.uploader2.uploadAll();
        this.uploader2.onProgressAll = (progress:any) =>{
            this.objectForCustomerDetail.photosprocess = progress;
        }
        var photos = [];
        this.uploader2.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = JSON.parse(response);
            photos.push(responsePath.filename);            
        };
        this.uploader2.onCompleteAll = () =>{
          this.customerUpdate({myPhotos : this.profile.myPhotos.concat(photos)});
          this.uploader2.clearQueue();
        } 
    }


 
    public removephotovideo(id){
      this.customerUpdate({"profileVideo" : ""});
    }

    public removephotomulti(id, index){   
        this.profile.myPhotos.splice(index, 1);
        var obj = {myPhotos: this.profile.myPhotos};
        this.customerUpdate(obj);
    }

    public myVideo(){
        this.uploader3.uploadAll();
        this.uploader3.onProgressAll = (progress:any) =>{
            this.objectForCustomerDetail.videoprocess = progress;
        }
        this.uploader3.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = JSON.parse(response);
            console.log("responsePathk");
            console.log(responsePath);
            this.profile.profileVideo = responsePath.filename;             
            this.customerUpdate({'profileVideo':this.profile.profileVideo});
            this.uploader3.clearQueue();
        };  
       }



   public profileUpdate(){
    this.customerUpdate(this.profileUpdateModel.value);
   }


   
    public addVideolink(){
        
        var obj = {videolinks : [], _id : this.customerInfo._id};
        obj.videolinks = this.profile.videolinks;       
        obj.videolinks.push(this.addVideolinkModel.value.videolinks.replace('watch?v=', 'embed/')); 
        this.customerUpdate(obj);
        this.setCustomerDetail();
        this.addVideolinkModel.reset();

    }


    public removeYoutubeLink(id, index){   
        this.profile.videolinks.splice(index, 1);
        var obj = {_id : id, videolinks: this.profile.videolinks};
        this.customerUpdate(obj);
    }
   

  public setCustomerDetail(){
    this.customerService.getOne(this.customerInfo._id).subscribe(customers => {       
      this.profile = customers.message;
      setTimeout(()=>{
        this.initMap();
      },1000);
      this.objectForCustomerDetail.interest = customers.message.interests;

       this.profileUpdateModel.patchValue(customers.message); 
       this.otherinfoUpdateModel.patchValue(customers.message);
       
      if(customers.message["height"]){
        var height1 = customers.message["height"];
        this.otherinfoUpdateModel.controls["height"].setValue(customers.message["height"]);
        // this.otherinfoUpdateModel.controls["userheightinch"].setValue(height1.split(".")[1]);
      } 
       
      if(customers.message.preferences){
        this.preferecesUpdateModel.patchValue(customers.message.preferences);
        this.preferecesUpdateModel.controls["interestedin"].setValue(customers.message.interestedin);
        if(customers.message.preferences.sexualorient){
          this.preferecesUpdateModel.controls["sexualorient"].setValue(customers.message.preferences.sexualorient)
        }
      }
      this.profileUpdateModel.controls['templocation'].setValue(customers.message.cityName, customers.message.countryName);
    });

    setTimeout(()=>{
      $('#dateofbirth').datetimepicker({format:'YYYY-MM-DD'});          
    }, 2500);
  }



   public customerUpdate(data){

      var flag1 = false;
      var data = data;  
      data._id = this.customerInfo._id; 

      console.log("data profile");
      console.log(data.profilePic);

	   this.customerService.updateCustomer(data).subscribe((item) => {
      this.customerService.getOne(this.customerInfo._id).subscribe((data)=>{
      toastr.remove();
      toastr.success("Successfully Updated");
      console.log("item ci");
      console.log(data.message);

      this.updateHeaderImage(data.message);

      localStorage.setItem('currentCustomer', JSON.stringify(data.message));
      this.setCustomerDetail();
      this.uploader.clearQueue();
      console.log(this.uploader.queue);
      });
	   });

	  }

   public updateHeaderImage(data){
          var profileClass = document.querySelectorAll(".profileImgForChange");
          var classLength = profileClass.length
          for(var i =0; i< classLength; i++){
           (<HTMLImageElement>profileClass[i]).src = globalVariable.imageUrl + data.profilePic;
          }          
        }

   public initMap(){
            var input = (<HTMLInputElement>document.getElementById('pac-input'));
            var options = {types: ['(cities)']};
            var autocomplete = new google.maps.places.Autocomplete(input,options);

            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.address_components) {
                    let city,country,lat,lng;
                    console.log(place.address_components);

                    if (place.address_components.length > 0) {
                        for(let i=0; i<place.address_components.length; i++){
                           var index = place.address_components[i].types.indexOf("locality");
                           if(index != -1){
                             city = place.address_components[i].long_name;
                           }
                           var index2 = place.address_components[i].types.indexOf("country");
                           if(index2 != -1){
                             country = place.address_components[i].long_name;
                           }
                           }                       
                         }

                    

                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();
                     console.log(city, country);
                    this.profileUpdateModel.controls["countryName"].setValue(country);
                    this.profileUpdateModel.controls["cityName"].setValue(city);
                    this.profileUpdateModel.controls["lat"].setValue(lat);
                    this.profileUpdateModel.controls["lng"].setValue(lng);
                  }
            });

           }



	 public interestupdates(type){
        var index = this.objectForCustomerDetail.interest.indexOf(type);       
        if(index == -1){
            this.objectForCustomerDetail.interest.push(type);
        }else{
            this.objectForCustomerDetail.interest.splice(index, 1);
        }
        this.profileUpdateModel.controls['interests'].setValue(this.objectForCustomerDetail.interest);
      }



   public getTimeData(even){
        var timeJ = even.getAttribute('id');
        let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
        var barray = eleObj.value.split('-');
        this.profileUpdateModel.controls['dateofbirth'].setValue(eleObj.value); 
        var agev =  this.calculate_age(barray[0], barray[1], barray[2]);
        this.profileUpdateModel.controls['age'].setValue(agev);   
       }


   public calculate_age(birth_year, birth_month, birth_day){
        var today_date = new Date();
        var today_year = today_date.getFullYear();
        var today_month = today_date.getMonth();
        var today_day = today_date.getDate();
        var age = today_year - birth_year;
        if ( today_month < (birth_month - 1))
        {
            age--;
        }
        if (((birth_month - 1) == today_month) && (today_day < birth_day))
        {
            age--;
        }
        return age;
    }

}

