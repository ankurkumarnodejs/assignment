import { Component, OnInit,  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CustomerService, FriendService, CountryService} from '../../../service/index';
declare var $ : any;




@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})

export class CustomerProfilesListComponent implements OnInit {

  /* Start filtering var */
  someRange= [ 2, 10 ];
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
                                  "Waiter","Wedding Planner","Teaching","Career Counselor","Substitute Teacher","Teacher","App Developer","Computer Programmer","Database Administrator","Programmer","Software Developer","Web Developer","Other"
                     ]},{"option": []}];



   filterBy : any = { gender : [], online : "xyz", minage: "", maxage: "", country: [], sexualorient: [], minheight: "", maxheight: "", haircolor: [], bodyshape: [], maritalstatus: [], smoke: [], drink: [], profession: [], any: false, searchtype: "local"};
  
  /* End filtering var */

  dataset1: any ={userheight:""};
  dataset2: any ={userheight: ""};
  customerInfo: any;
  profiles : any = []
  filterObj : any = {};
  countrys: any = [];


  constructor(public customerService : CustomerService, public friendService : FriendService, public router: Router,        
      public route: ActivatedRoute, public countryService : CountryService ) {
      var initcm : any = parseFloat('121.92');
    for(let i=0; i<=47; i++){
        var new_cm =  parseFloat(initcm).toFixed(0)
        this.questions[7].option.push(new_cm);
        initcm += parseFloat('2.54');
    }
     if(localStorage.getItem("currentCustomer")){
      this.customerInfo = JSON.parse(localStorage.getItem("currentCustomer"));
      
     }

  }


 
    ngOnInit() {    
    this.initprefrences(); 
    this.getuserCountry(); 
    }
  




  public initprefrences(){      
      this.route.queryParams.subscribe(params => { 

          console.log("params");
          console.log(params);

          if((params['gender'] != "") && (typeof params['gender'] !== "undefined")){
            if(typeof params['gender'] == 'object'){
            this.filterBy.gender = params['gender'];
            }

            if(typeof params['gender'] == 'string'){
            this.filterBy.gender.push(params['gender']);
            }
          }              
         
          if((params['country'] != "" ) && (typeof params['country'] !== "undefined")){

          if(typeof params['country'] == 'object'){
          this.filterBy.country = params['country'];
          }
          if(typeof params['country'] == 'string'){
          this.filterBy.country.push(params['country']);
          }

          }


              if((params['minage'] != "") && (typeof params['minage'] !== "undefined")){ 
              this.filterBy.minage = params['minage'];
              }

              if((params['maxage'] != "") && (typeof params['maxage'] !== "undefined")){
              this.filterBy.maxage = params['maxage'];
              }


              if((params['minheight'] != "") && (typeof params['minheight'] !== "undefined")){ 
              this.filterBy.minheight = params['minheight'];
              this.dataset1.userheight = params['minheight'];
             

              }

              if((params['maxheight'] != "") && (typeof params['maxheight'] !== "undefined")){
              this.filterBy.maxheight = params['maxheight'];
              this.dataset2.userheight = params['maxheight'];
              }


          if((params['sexualorient'] != "" ) && (typeof params['sexualorient'] !== "undefined")){              
            if(typeof params['sexualorient'] == 'object'){
            this.filterBy.sexualorient = params['sexualorient'];
            }
            if(typeof params['sexualorient'] == 'string'){
            this.filterBy.sexualorient.push(params['sexualorient']);
            }  
          }    

          if((params['haircolor'] != "" ) && (typeof params['haircolor'] !== "undefined")){

          if(typeof params['haircolor'] == 'object'){
          this.filterBy.haircolor = params['haircolor'];
          }
          if(typeof params['haircolor'] == 'string'){
          this.filterBy.haircolor.push(params['haircolor']);
          }

          }

          if((params['height'] != "" ) && (typeof params['height'] !== "undefined")){

          if(typeof params['height'] == 'object'){
          this.filterBy.height = params['height'];
          }
          if(typeof params['height'] == 'string'){
          this.filterBy.height.push(params['height']);
          }

          }

          if((params['bodyshape'] != "" ) && (typeof params['bodyshape'] !== "undefined")){

          if(typeof params['bodyshape'] == 'object'){
          this.filterBy.bodyshape = params['bodyshape'];
          }
          if(typeof params['bodyshape'] == 'string'){
          this.filterBy.bodyshape.push(params['bodyshape']);
          }

          }

          if((params['maritalstatus'] != "" ) && (typeof params['maritalstatus'] !== "undefined")){

          if(typeof params['maritalstatus'] == 'object'){
          this.filterBy.maritalstatus = params['maritalstatus'];
          }
          if(typeof params['maritalstatus'] == 'string'){
          this.filterBy.maritalstatus.push(params['maritalstatus']);
          }

          }


          if((params['smoke'] != "" ) && (typeof params['smoke'] !== "undefined")){

          if(typeof params['smoke'] == 'object'){
          this.filterBy.smoke = params['smoke'];
          }
          if(typeof params['smoke'] == 'string'){
          this.filterBy.smoke.push(params['smoke']);
          }

          }
          
         if((params['drink'] != "" ) && (typeof params['drink'] !== "undefined")){
          if(typeof params['drink'] == 'object'){
          this.filterBy.drink = params['drink'];
          }
          if(typeof params['drink'] == 'string'){
          this.filterBy.drink.push(params['drink']);
          }
          }

          if((params['profession'] != "" ) && (typeof params['profession'] !== "undefined")){
          if(typeof params['profession'] == 'object'){
          this.filterBy.profession = params['profession'];
          }
          if(typeof params['profession'] == 'string'){
          this.filterBy.profession.push(params['profession']);
          }
          }


          if((params['searchtype'] != "" ) && (typeof params['searchtype'] !== "undefined")){
          this.filterBy.searchtype = params['searchtype'];
          }
           console.log("params['any']");
           console.log(params['any']);
          if((params['any'] == 'true') && (typeof params['any'] !== "undefined")){         
          this.filterBy.any = true;
          }

      });
      this.profiles_list();
     } 


/* Start filtering functions */

        public getuserCountry(){
        this.customerService.getUserCountry().subscribe((country) =>{  
          this.countrys = country.message;
        });
        }

      public genderFilter(item){
        var index1 = this.filterBy.gender.indexOf(item);
        if(index1 == -1){
        this.filterBy.gender.push(item);
        }else{
        this.filterBy.gender.splice(index1, 1);
        }
      }

      public sexualorientFilter(item){
        var index2 = this.filterBy.sexualorient.indexOf(item);
        if(index2 == -1){
        this.filterBy.sexualorient.push(item);
        }else{
        this.filterBy.sexualorient.splice(index2, 1);
        }
        }

     public countryFilter(item){
        var index3 = this.filterBy.country.indexOf(item);
        if(index3 == -1){
        this.filterBy.country.push(item);
        }else{
        this.filterBy.country.splice(index3, 1);
        }
        }

    public haircolorFilter(item){
        var index4 = this.filterBy.haircolor.indexOf(item);
        if(index4 == -1){
        this.filterBy.haircolor.push(item);
        }else{
        this.filterBy.haircolor.splice(index4, 1);
        }
        }


    public bodyshapeFilter(item){
        var index5 = this.filterBy.bodyshape.indexOf(item);
        if(index5 == -1){
        this.filterBy.bodyshape.push(item);
        }else{
        this.filterBy.bodyshape.splice(index5, 1);
        }
        }    
    
    public marriedStatusFilter(item){
        var index6 = this.filterBy.maritalstatus.indexOf(item);
        if(index6 == -1){
        this.filterBy.maritalstatus.push(item);
        }else{
        this.filterBy.maritalstatus.splice(index6, 1);
        }
        }    


    public smokeFilter(item){
        var index7 = this.filterBy.smoke.indexOf(item);
        if(index7 == -1){
        this.filterBy.smoke.push(item);
        }else{
        this.filterBy.smoke.splice(index7, 1);
        }
        }    

    public drinkFilter(item){
        var index8 = this.filterBy.drink.indexOf(item);
        if(index8 == -1){
        this.filterBy.drink.push(item);
        }else{
        this.filterBy.drink.splice(index8, 1);
        }
        }  


    public professionFilter(item){
        var index10 = this.filterBy.profession.indexOf(item);
        if(index10 == -1){
        this.filterBy.profession.push(item);
        }else{
        this.filterBy.profession.splice(index10, 1);
        }
        }    
   


        public onStepChange1(){
          console.log("this.dataset1.userheight" );
          console.log(this.dataset1.userheight );
        if(this.dataset1.userheight != ""){
        this.filterBy.minheight = this.dataset1.userheight ;
        }else{
        this.filterBy.minheight = "" ;
        }
        }

        public onStepChange2(){
        if(this.dataset2.userheight != ""){
        this.filterBy.maxheight = this.dataset2.userheight;
        }else{
          this.filterBy.maxheight = "" ;
        }

        }

        public anyprofessionFilter(){          
          if(this.filterBy.any == false){
             this.filterBy.any = true;
             this.filterBy.profession = this.questions[6].option;
             }else{
             this.filterBy.any = false;
             this.filterBy.profession = [];
            }
        } 



  public searchResult(){
      setTimeout(()=>{  
      var data = {};
      this.router.navigate(['/customer/profiles-list'], {queryParams:  data});
      data = this.filterBy;
      this.router.navigate(['/customer/profiles-list'], {queryParams:  data}); 
      setTimeout(()=>{
      this.initprefrences();  
      }, 1000);
      }, 1000);
  }



/* End Filtering functions */

      public someEvent(){
        this.profiles_list();
      }

      public localCustomerList(){
        this.filterBy = { gender : [], online : "xyz", minage: "", maxage: "", country: [], sexualorient: [], minheight: "", maxheight: "", city: []
        , haircolor: [], bodyshape: [], maritalstatus: [], smoke: [], drink: [], profession: [], any : false, searchtype : "local"};
        this.filterBy.country.push(this.customerInfo.countryName);
        var data = {};
        this.router.navigate(['/customer/profiles-list'], {queryParams:  data});
        data = this.filterBy;
        setTimeout(()=>{
        this.router.navigate(['/customer/profiles-list'], {queryParams: data });  
        setTimeout(()=>{
        this.initprefrences();  
        }, 500);
        }, 1000);
       }
     
    
        public globalCustomerList(){
          this.filterBy = { gender : [], online : "xyz", minage: "", maxage: "", country: [], sexualorient: [], minheight: "", maxheight: "", haircolor: [], bodyshape: [], maritalstatus: [], smoke: [], drink: [], profession: [], any: false, searchtype : "global"};
          
          this.customerService.getUserCountry().subscribe(country =>{

          var countrys = country.message.filter((item, index, array) => {
                   return (item != this.customerInfo.countryName) && (item != "");
              });

          if(countrys.length == 0){            
            this.filterBy.country.push("no");
          }else{
            this.filterBy.country = countrys;
          }

                    
          var data = {};
          this.router.navigate(['/customer/profiles-list'], {queryParams:  data});
          data = this.filterBy;
          setTimeout(()=>{
          this.router.navigate(['/customer/profiles-list'], {queryParams: data });  
          setTimeout(()=>{
          this.initprefrences();  
          }, 500);
          }, 1000); 

         });

        }


      public matchCustomerList(){
          this.filterBy = { gender : [], online : "xyz", minage: "", maxage: "", country: [], sexualorient: [], minheight: "", maxheight: "", city: []
          ,haircolor: [], bodyshape: [], maritalstatus: [], smoke: [], drink: [], profession: [], any: false, searchtype : "match"};

          if(this.customerInfo.preferences){

          if((typeof this.customerInfo.preferences.minheight !== 'undefined') && (this.customerInfo.preferences.minheight != "")){  
          this.filterBy.minheight = this.customerInfo.preferences.minheight;
          }
          if((typeof this.customerInfo.preferences.maxheight !== 'undefined') && (this.customerInfo.preferences.maxheight != "")){  
          this.filterBy.maxheight = this.customerInfo.preferences.maxheight;
          }
          if((typeof this.customerInfo.preferences.haircolor !== 'undefined') && (this.customerInfo.preferences.haircolor != "")){  
          this.filterBy.haircolor.push(this.customerInfo.preferences.haircolor);
          }
          if((this.customerInfo.preferences.bodyshape !== 'undefined') && (this.customerInfo.preferences.bodyshape != "")){  
          this.filterBy.bodyshape.push(this.customerInfo.preferences.bodyshape);
          }
          if((this.customerInfo.preferences.maritalStatus !== 'undefined') && (this.customerInfo.preferences.maritalStatus != "")){  
          this.filterBy.maritalstatus.push(this.customerInfo.preferences.maritalStatus);
          }
          if((this.customerInfo.preferences.smoke !== 'undefined') && (this.customerInfo.preferences.smoke != "")){  
          this.filterBy.smoke.push(this.customerInfo.preferences.smoke);
          }
          if((this.customerInfo.preferences.drink !== 'undefined') && (this.customerInfo.preferences.drink != "")){  
          this.filterBy.drink.push(this.customerInfo.preferences.drink);
          }
          if((this.customerInfo.preferences.profession !== 'undefined') && (this.customerInfo.preferences.profession != "")){  
          this.filterBy.profession.push(this.customerInfo.preferences.profession);
          }
          if((typeof this.customerInfo.preferences.sexualorient !== 'undefined') && (this.customerInfo.preferences.sexualorient != "")){
            this.filterBy.sexualorient.push(this.customerInfo.preferences.sexualorient);
          }          
          if((typeof this.customerInfo.preferences.interestedin !== 'undefined') && (this.customerInfo.preferences.interestedin != "")){
            this.filterBy.gender.push(this.customerInfo.preferences.interestedin);
          }

          }

          var data = {};
          this.router.navigate(['/customer/profiles-list'], {queryParams:  data});
          data = this.filterBy;

          setTimeout(()=>{
            this.router.navigate(['/customer/profiles-list'], {queryParams: data });  
            setTimeout(()=>{
            this.initprefrences();  
            }, 500);
          }, 1000);   

      }
     

      public findOnline(){        
      if(this.filterBy.online == 'xyz'){
      this.filterBy.online = 'Y';
      }else{
      this.filterBy.online = 'xyz';
      }
      
      var data = {};
      this.router.navigate(['/customer/profiles-list'], {queryParams:  data});
      data = this.filterBy;
      setTimeout(()=>{
      this.router.navigate(['/customer/profiles-list'], {queryParams: data });  
      setTimeout(()=>{
      this.initprefrences();  
      }, 500);
      }, 1000); 
        
      }


      public profiles_list(){

       console.log("this.filterBy");
       console.log(this.filterBy);

       console.log(JSON.stringify(this.filterBy));
        this.customerService.filter(this.filterBy).subscribe((data) => { 
            var index = data.message.findIndex((items) => { return items._id == this.customerInfo._id });        
            if(index > -1){
            data.message.splice(index, 1);           
            this.profiles = data.message;       
            }else{
            this.profiles = data.message;       
            }        
        });

        if(this.filterBy.searchtype == 'local'){
        $(".category-pills > li").removeClass();
        $(".category-pills > li:nth-child(1)").addClass("active"); 
        } 

        if(this.filterBy.searchtype == 'global'){
        $(".category-pills > li").removeClass();
        $(".category-pills > li:nth-child(2)").addClass("active"); 
        } 

        if(this.filterBy.searchtype == 'match'){
        $(".category-pills > li").removeClass();
        $(".category-pills > li:nth-child(3)").addClass("active"); 
        }   

        }     


  
}
