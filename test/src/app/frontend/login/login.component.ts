import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule , FormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { AlertService, AuthService, UsersService,CustomerService, SocketService, PageService} from '../../service/index';
declare var $ : any;
declare var toastr : any;
declare var google : any;
toastr.options.timeOut = 3000;
import * as globalVariable from "../../global";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userRegistrationForm: FormGroup;
  forgetForm: FormGroup;
  addAddress: FormGroup;
  public uploader:FileUploader = new FileUploader({url:globalVariable.url+'upload'});

  process : any = 20;
  regdone : any = 1;  
  returnUrl: string;
  err:any;
  pageslist : any = [];
  profiles : any = [];
  url : any = globalVariable.imageUrl;
  slideIndex : any = 1;
  
  dataset : any= {"height" : "", "userheight" : {"cm": 121}, "haircolor" : "", "bodyshape": "", "maritalStatus" : "" ,
                 "haveChildren": "", "smoke": "" , "drink":"", "profession" : ""};

  datasetpref : any= {"minheight" : "", "maxheight" : "", "haircolor" : "", "bodyshape": "", "maritalStatus" : "" ,
  "haveChildren": "", "smoke": "" , "drink":"", "profession" : ""};


  dataanswer : any;
  profilePic : any = "./assets/images/face.png";
  questions : any =  [{"option": [{"name" : "feet"},{"name" : "inch"}]},                    
                     {"option": ["Black","Light Brown","Brunette/Brown","Red","Blonde","White","Bald/Shaven","Other"]},
                     {"option": ["Petite","Slender","Medium","Few Extra Pounds","Well Built","Overweight"]},
                     {"option": ["Single","Married"]},
                     {"option": ["Yes","No"]},
                     {"option": ["High School","Some College","College Graduate","Some Post-College","Master’s","Professional Qualification","Student"]},
                     {"option": ["Aircraft Dispatcher","Aircraft Mechanic","Airline Pilot","Flight Attendant","Arts","Actor","Architecture","Art Appraiser","Art Auctioneer","Artist","Museum Jobs","Music Conductor",
                                  "Business","Accountant","Administrative","Assistant/Secretary","Advertising","Consultant","Financial Advisor","Fundraiser","Government Job","Human Resources","Insurance Agent","Investment Banker",
                                  "Lawyer","Management","Market Research Analyst","Nonprofit Job","Law Enforcement","Criminal Justice","Federal Law Enforcement","Police Officer","Media",
                                  "Book Publishing","Freelance Editor","Freelance Writer","Public Relations","Web Developer","Writer/Editor","Medical","Doctor","Nurse","Paramedic","Psychologist",
                                  "Social Worker","Veterinarian","Service Industry","Bank Teller","Call Center","Funeral Director","Hair Stylist","Personal Fitness Trainer","Retail","Sales","Ski Instructor",
                                  "Waiter","Wedding Planner","Career Counselor","Substitute Teacher","Teacher","App Developer","Computer Programmer","Database Administrator","Programmer","Software Developer","Web Developer","Other"
                     ]},{"option": []}];

 finalobj : any;
 flgForsteps : any = false;
 increasepercent : any = false;
 rev : any = true;
 userheight: any = 0;
 userheightpref: any = 0;

  constructor(
    public lf: FormBuilder, 
    public authService: AuthService,
    public usersService: UsersService,
    public customerService:CustomerService,
    public router: Router,
    public alertService: AlertService,
    public route: ActivatedRoute,
    public socketService : SocketService,
    public pageService : PageService
    ) {
    var initcm : any = parseFloat('121.92');
    for(let i=0; i<=47; i++){
        var new_cm =  parseFloat(initcm).toFixed(0)
        this.questions[7].option.push(new_cm);
        initcm += parseFloat('2.54');
    }
  }


  ngOnInit() {   
    this.pages();
    if(localStorage.getItem('currentCustomer')){
      this.initlivenow();     
      this.socketService.customerOffline();
    }

    this.authService.logout(); 

    localStorage.clear();

    /*localStorage.removeItem('currentCustomer');
    localStorage.removeItem('currentChats');      
    localStorage.removeItem('ChatList');     */

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customer/profile';

    this.loginForm = this.lf.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.userRegistrationForm = this.lf.group({  
      gender : ['', Validators.required],
      interestedin : ['', Validators.required],  
      username : ['',Validators.required], 
      dateofbirth : ['', Validators.required],
      email : ['', Validators.required],
      password : ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]]
    });


    this.forgetForm = this.lf.group({
            email: ['', [Validators.required]]
        });


    this.addAddress = this.lf.group({
            profilePic : [''],
            countryName: ['', [Validators.required]],
            cityName: ['', [Validators.required]],
            lat: ['', [Validators.required]],
            lng: ['', [Validators.required]]
            });


        this.setFeatured();    

       /* setTimeout(() => {
         this.showSlides(this.slideIndex);          
         }, 1000);*/

        $(document).ready(function(){
           $('#dateofbirth').datetimepicker({format:'YYYY-MM-DD'}); 
           $("input").on('focus', function(ev) { ev.preventDefault(); }); // untested!         
        });

        this.heightpopulate();
        this.userheight = 181.92;

        this.heightpopulatepref();
        this.userheightpref = 181.92;
  }


  fitopen(){

var modal = document.getElementById('myModal1');
 modal.style.display = "block";
}

  fitclose(){

var modal = document.getElementById('myModal1');
 modal.style.display = "none";
}

  public heightpopulate(){     
     this.userheight = 60 + parseFloat(this.dataset.userheight.cm);
  }


  public heightpopulatepref(){
     this.userheightpref = 60 + parseFloat(this.datasetpref.maxheight);
  }
   
  public onStepChange(type){  
    
   if(this.dataset.userheight.cm != ""){this.heightpopulate();}  

   if((type == 'height') && (this.dataset.userheight.cm != "")){
    this.dataset.height = this.dataset.userheight.cm
    this.increasepercent = true;
   } 
   

   if((type == 'haircolor') && (this.dataset.haircolor != "")){
   this.increasepercent = true;
   }

   if((type == 'bodyshape') && (this.dataset.bodyshape != "")){
   this.increasepercent = true;
   }

   if((type == 'maritalStatus') && (this.dataset.maritalStatus != "")){
   this.increasepercent = true;
   }
 
   if((type == 'smoke') && (this.dataset.smoke != "")){
   this.increasepercent = true;
   }

   if((type == 'drink') && (this.dataset.drink != "")){
   this.increasepercent = true;
   }

   if((type == 'profession') && (this.dataset.profession != "")){

   this.increasepercent = true;
   }

  }
  

  public onStepChangepref(type){
 
 if(this.datasetpref.minheight != "" && this.datasetpref.maxheight != ""){this.heightpopulatepref();}

   if((type == 'height') && (this.datasetpref.minheight != "" && this.datasetpref.maxheight  != "")){    
    this.increasepercent = true;
   } 

   if((type == 'haircolor') && (this.datasetpref.haircolor != "")){
   this.increasepercent = true;
   }

   if((type == 'bodyshape') && (this.datasetpref.bodyshape != "")){
   this.increasepercent = true;
   }

  }

  public onChangeImg1(){

            this.uploader.uploadAll();
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response).filename;
                this.profilePic = this.url + responsePath;
                this.addAddress.controls['profilePic'].setValue(responsePath);        
            };

            }



  public initMap(){

            var input = document.getElementById('pac-input');
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
                    if (place.address_components.length >= 4) {
                        city = place.address_components[place.address_components.length-3].long_name;
                    }else{
                        city = place.address_components[place.address_components.length-2].long_name;
                    }
                    country = place.address_components[place.address_components.length-1].long_name;
                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();

                    this.addAddress.controls["countryName"].setValue(country);
                    this.addAddress.controls["cityName"].setValue(city);
                    this.addAddress.controls["lat"].setValue(lat);
                    this.addAddress.controls["lng"].setValue(lng);

                    console.log(this.addAddress.value);
                    console.log("ddd address");

                  }
                });

           }



    public getTimeData(even){
        var timeJ = even.getAttribute('id');
        let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
        var barray = eleObj.value.split('-');
        this.userRegistrationForm.controls['dateofbirth'].setValue(eleObj.value); 
        var agev =  this.calculate_age(barray[0], barray[1], barray[2]);
        this.userRegistrationForm.controls['age'].setValue(agev);   
    }


    public calculate_age(birth_year,birth_month,birth_day){

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


  public setFeatured(){
      this.customerService.featuredImage().subscribe((data) => {       
        var dataarray = [];
        dataarray = data.message;
        if(data.message.length < 6){
          var data1 = (6 - data.message.length);
          var finallen = (data1 + data.message.length)
          for(var i=0; i<data1; i++){
          dataarray.push({profilePic : "",firstname: "", lastname: "",age: "", country :"" });
          } 
          this.profiles = dataarray; 
          }else{
           this.profiles = data.message;      
          }      
      });
     }


  public initlivenow(){
    if(localStorage.getItem('currentCustomer') != 'undefined' || (typeof localStorage.getItem('currentCustomer') != 'undefined')){
      var datat  = {_id : JSON.parse(localStorage.getItem('currentCustomer'))._id, islive: false, isbusy : false, speedstatus : false, isbusyvideo : false, isbusyspeed : false};
      this.customerService.updateCustomer(datat).subscribe(update => {              
              
          });
    }
  }

  public forgetPass(){
    console.log(this.forgetForm.value.email);
    this.customerService.forgetPassword(this.forgetForm.value).subscribe((data) => {
      if (data.error){
      
       toastr.remove();
         toastr.error("wrong email address"); 
      }else{     
           $(function () {
           $('#myModal').modal('toggle');
           });       
           toastr.remove();
           toastr.success("check you email"); 
      }
    });
   }


  public login(){
    this.authService.getUser(this.loginForm.value).subscribe(
      (data) => {
        this.socketService.customerOnline(); console.log("customerOnline comppo");

        this.alertService.success('Login successful', true);
        this.router.navigate([this.returnUrl]);
      }
    );
  }


  public pages(){
    this.pageService.getAll().subscribe(item => {
      this.pageslist = item.message;     
    })
  }


              public loginCustomer(){
                console.log("new res");
                this.authService.getCustomer(this.loginForm.value).subscribe(
                  (data) => {
                    if(data.error){
                      toastr.remove();
                      toastr.error('Wrong credentials');
                    }else{
                      localStorage.setItem('currentCustomer', JSON.stringify(data.data));
                      this.socketService.customerOnline();   
                      toastr.remove();
                      toastr.success('Login successful'); 
                      if(typeof data.data.preferences == 'undefined'){
                        this.router.navigate([this.returnUrl]);
                      }else{
                        console.log("login console", data.data);
                       //this.router.navigate(['/customer/profile']); 
                      //this.router.navigate(['/customer/profiles-list'], { queryParams: { gender: data.data.preferences.gender, country : data.data.preferences.country, age:  data.data.preferences.age, sexualorient : data.data.preferences.sexualorient}});
                      if(typeof data.data.countryName !== 'undefined' && data.data.countryName != '' ){
                      this.router.navigate(['/customer/profiles-list'], { queryParams: {country : data.data.countryName,}});
                      }else{
                      this.router.navigate(['/customer/profile']);
                      }
                      
                      }}
                    });
              }



              public userRegistration(){
                this.finalobj =  this.userRegistrationForm.value;                
                this.customerService.checkCustomerExists(this.finalobj).subscribe((resp)=> {                 
                 if(resp.error){
                  toastr.remove();
                  toastr.error(resp.message);
                 }else{
                    this.nextsteps(2); 
                 }                 
                });
              }


              public updateAddress(){ 

               Object.assign(this.finalobj, this.addAddress.value);              
               this.nextsteps(3);  

               this.process = 20;
               this.slideIndex = 1;   
               this.dataset = {"height" : "", "userheight" : {"feet": "", "inch": ""}, "haircolor" : "", "bodyshape": "", "maritalStatus" : "" ,
               "haveChildren": "", "smoke": "" , "drink":"", "profession" : ""};
               this.datasetpref = {"minheight" : "", "maxheight" : "", "haircolor" : "", "bodyshape": "", "maritalStatus" : "" ,
               "haveChildren": "", "smoke": "" , "drink":"", "profession" : ""}; 

              }

              public nextsteps(n){
                this.regdone  = n;

                if(n == 2){
                  setTimeout(()=>{
                    this.initMap();
                   // $('#registeredstep').modal('show');
                   this.fitopen();

                  },500);
                }

                if(n == 3){                  
                  setTimeout(()=>{
                    this.showSlides(this.slideIndex); 
                  },500);
                  }
              }


 
public plusSlides(n) {

  if(this.increasepercent == true){
    this.process += 8;
    this.increasepercent = false;
  }
  if(this.slideIndex == 10){
  this.userRegisterFinal();
  }
  this.showSlides(this.slideIndex += n); 

  }


public currentSlide(n) {
  this.showSlides(this.slideIndex = n);
  }

public showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");  
 if (n > slides.length) {this.slideIndex = this.slideIndex}  
  if (n < 1) {this.slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      (<HTMLInputElement>slides[i]).style.display = "none";  
  }  
  (<HTMLInputElement>slides[this.slideIndex-1]).style.display = "block";  
  }

 public finish(){

   this.regdone = 1;
   setTimeout(() => {
   $('#dateofbirth').datetimepicker({format:'YYYY-MM-DD'}); 
   this.initMap();
   this.fitclose();  
   },500);
   
 }


public userRegisterFinal(){
Object.assign(this.finalobj, this.dataset); 
delete this.finalobj.userheight;
//delete this.datasetpref.userheight;

this.finalobj["preferences"] = this.datasetpref; 
this.finalobj["profileCompletePercent"] = this.process; 
console.log("this.finalobj reg");

console.log(this.finalobj);

 this.customerService.addCustomer(this.finalobj).subscribe(
      (data) => {           
        if(data.error){         
         toastr.remove();
         toastr.error(data.message);
        }else{
      if(data.message){
       localStorage.setItem('registered', JSON.stringify(data.message));
        }
        this.customerService.addactivate(data.message).subscribe((dataq) => {   
        this.userRegistrationForm.reset(); 
         toastr.remove();
         toastr.success("Registration Successfully check Your email for  account activation");
        });   
        }      
      });
}


}