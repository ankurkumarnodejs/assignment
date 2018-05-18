import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomerService, FriendService, CountryService, SocketService} from '../../../service/index';
import * as globalVariable from "../../../global";
declare var $ : any;
declare var toastr : any;
toastr.options.timeOut = 3000;

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})

export class PublicProfileComponent implements OnInit {

  addmodel : FormGroup;
  customerInfo : any ;
  profile: any;
  vid: any;
  friendslen : any;
  url = globalVariable.url+'uploads/';  
  showFriendbuttons: any = true;
  blocked: any = [];
  friends : any = [];
  myonline: any = [];
  callingto : any;
  currentcall: any;


  constructor(
    public lf: FormBuilder,
    public customerService : CustomerService,
    public socketService : SocketService,
    public friendService: FriendService,
    public countryService: CountryService,
    public router: Router,
    public route: ActivatedRoute
    ) {
		if(localStorage.getItem('currentCustomer')){
			this.customerInfo = JSON.parse(localStorage.getItem('currentCustomer'));	
      this.route.params.subscribe((params: Params) => {
        this.vid = params['vid'];
        this.getAllAllow()
        this.attachVisitors();
      });
		}
  }

  ngOnInit() {
    this.addmodel = this.lf.group({
      description : ['',Validators.required]
    });
    this.myFriends();
    this.getCustomerDetail();
    this.friendbtnAllow();
    this.myBlocked();
    if(this.customerInfo._id != this.vid){
      this.notify();
    }
    this.onlinenew();
    //this.onlinenew2();
    //this.onlinenew3();
    //this.socketService.onlineList2emit();
    //this.socketService.onlineList3emit();
    //this.onlinenew4();
    //this.socketService.onlineList4emit();
    this.offlinenew2();
  }

  public onlinenew() {
    this.socketService.onlineList().subscribe(response => { 
      console.log("online on public profile page");  
      this.myonline = response.chatList.map(function(a) {return a._id;});
    }); 
  }
  
  public onlinenew2(){
    this.socketService.onlineListon2().subscribe(response => {   
      this.myonline = response.chatList.map(function(a) {return a._id;});
    });
  }

  public onlinenew3(){
    this.socketService.onlineList3().subscribe(response => {
    this.myonline = response.chatList.map(function(a) {return a._id;});
      console.log("main 3o");
    });
  }

  public onlinenew4(){
    this.socketService.onlineList4().subscribe(response => {   
    this.myonline = response.chatList.map(function(a) {return a._id;});        
      console.log("main 3o"); 
    }); 
  }

  public offlinenew2(){
    this.socketService.offline2().subscribe(response => {
      this.myonline = response.chatList.map(function(a) {return a._id;});
    });
  }

  public getAllAllow(){
    this.friendService.getAllFriendAllow(this.customerInfo._id).subscribe(data => {
      this.friends = data.message;       
    });
  }

  public checkforinvite(id){
    const index1 = this.friends.findIndex(item => item.FromId._id == id);
    const index2 = this.friends.findIndex(item => item.ToId._id == id);
    if(index1 != -1 || index2 != -1){
      return false;
    } else {
      return true;
    }
  }
   
  public notify(){
    var obj = {FromId : this.customerInfo._id, ToId: this.vid , title: 'view'};
    this.socketService.notify(obj);
  }

  public getCustomerDetail(){
    this.customerService.getOne(this.vid).subscribe(data => {
      this.profile = data.message;
    });
  }

  public attachVisitors(){
    var obj = {id : this.vid, vid : this.customerInfo._id};
    this.customerService.attachvisitor(obj).subscribe(data => {});
  }

  public myFriends(){
    this.friendService.myfriends({id:this.vid}).subscribe((data)=>{
      this.friendslen = data.message;
    });
  }

  public friendbtnAllow(){
    this.friendService.getAllFriendAllow(this.vid).subscribe((item) => {
      var data = item.message;
      if(data.length > 0){
        var index1 = data.findIndex(item => item.FromId._id == this.customerInfo._id);
        var index2 = data.findIndex(item => item.ToId._id == this.customerInfo._id);
        if(index1 != -1 || index2 != -1){
          this.showFriendbuttons = false;
        }else{
          this.showFriendbuttons = true;
        }
      }else{
        this.showFriendbuttons = true;
      }
    });
  }

  public sendRequest(id) {
    var friendobj={FromId: this.customerInfo._id, ToId:id, status:0};
    var notif = {FromId : this.customerInfo._id, ToId: id, title: 'request'}; 
    this.socketService.notify(notif);
    this.socketService.notify2(notif);
    this.friendService.addFriend(friendobj).subscribe((data) => {
      this.getAllAllow();
    });
  }   

  public anyBlockRequest(id) {
    var friendobj={ FromId:this.customerInfo._id, ToId:id, status:4}
    this.friendService.addFriend(friendobj).subscribe((data) => {
      this.getAllAllow();
    });
  }

  public acceptrequest(id, pid) {
    var friendobj={_id: id, status:1};
    //this.requestFromTo(this.customerInfo._id, pid, 'accept');  
    this.friendService.updateFriend(friendobj).subscribe((data) => {
      this.getAllAllow();
    });      
  }

  public deleteBlock(id){
    this.friendService.deleteOne(id).subscribe((data) => {
      this.getAllAllow();
    });
  }

  public unblockrequest(data, type) {
    if(type == 2){
      var friendobj ={_id:data._id, FromId: data.ToId._id, ToId: data.FromId._id, status:0};
      this.friendService.updateFriend(friendobj).subscribe((data) => {
        this.getAllAllow();
      });
    }else{
      this.getAllAllow();
      this.deleteBlock(data._id);
    }
  }

  public myBlocked(){   
    this.friendService.myblocked({id:this.customerInfo._id}).subscribe((data)=>{
      this.blocked = data.message.map((a)=>{return a._id;});
    });
  }

  public selectNewChat(){
    this.socketService.selectForChat(this.vid, this.customerInfo._id);
  }

  public sendReport(){
    var obj = {FromId: this.customerInfo._id, ForId: this.vid, type: "Public Profile", description : this.addmodel.value.description};
    this.customerService.sendReport(obj).subscribe((data) => {
      if(!data.error){
        alert("Your Abuse Report Has been submitted!");
        this.addmodel.reset();
        $(function () {
          $('#report1').modal('toggle');
        });  
      }else{
        alert("Something Wrong!"); 
      }
    });
  }

  public vediocall(id){
    if(this.customerInfo.remaincalls > 0){
      this.callingtouser(id);
      this.currentcall = {_id :  id, cid : this.customerInfo._id};
      this.socketService.video(this.currentcall);
    }else{
      toastr.clear();
      toastr.error("You are not Able to make call? Please Purchase Plan.");
    }
    //this.opencallingpopup();
  }
    
  public callingtouser(id){
    this.customerService.getOne(id).subscribe((data) => {
      this.callingto = data.message;
      $('#videocalloutgoing').modal('show');
    });
  }

  public videocallcancel(){
    this.socketService.callcancel(this.currentcall);  
    this.currentcall = {}; 
    //this.closecallingpopup(); 
    $('#videocalloutgoing').modal('hide');   
  }
}
