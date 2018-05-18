import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomerService, FriendService, CountryService, SocketService, BannerService} from '../../../service/index';
import * as globalVariable from "../../../global";
declare var $ : any;
declare var toastr : any;
toastr.options.timeOut = 3000;
/*declare var OT: any;*/

import * as OT from '@opentok/client';

/*declare var otCore: any;
declare var options: any;
declare var TB: any;
declare var OT_LayoutContainer: any;*/


@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit, OnDestroy {

    msg : any;
    cid : any;
    profile: any = {};
    url = globalVariable.url+'uploads/';    
    profiles = [];
    callsessionid : any;
    publishedUser:any ={};
    apiKey = '46076142';
    publisher:any;
    session:any;
    sessionOBJ:any;
    token:any;
    form:any;
    tokenid : any;
    banner : any = [];
    bannerImage : any = [];
    bannerImg : any ;
    bannervideo : any;
    timeslot : any = [];
    timeslotImage : any = [];
    itemplayed : any = 0;
    itemplayedImage : any = 0;
    donebanner : any = [];
    donebannerImage : any = [];
    connectedTo : any;
    screenwidth: any = 'mini';
    public banneropen: any = false;

    constructor(
        public customerService: CustomerService,
        public bannerService : BannerService ,
        public socketService : SocketService,
        public activatedRoute: ActivatedRoute,
        public router : Router
        ) {
        this.disconnectcall();
    }

    ngOnInit() {
        this.cid = JSON.parse(localStorage.getItem('currentCustomer'))._id;

        var obj = {_id: this.cid, isbusyvideo: true};/*, remaincalls : callsLeft*/
        this.updateCustomerForVideo(obj);

        this.activatedRoute.params.subscribe((params: Params) => {
            this.callsessionid = params['sessionid'];
            this.tokenid = params['tokenid'];            
            this.connectedTo = params['connectedTo'];            
        });

        this.loadAllTime();
        this.loadAllTimeImage();
        this.getCustomer();
        this.donebanner = [];
    }

    ngOnDestroy(){
        var obj = {_id: this.cid, isbusyvideo: false};
        this.updateCustomerForVideo(obj);
        this.setNewTokboxToken();
        this.disconnectcall();        
    }

    updateCustomerForVideo(obj){
        this.customerService.updateCustomer(obj).subscribe(data => {
            console.log("customer updated");
        });
    }

    public setNewTokboxToken(){
        this.customerService.changeTokboxToken(this.cid).subscribe((item) => {
           console.log(item);
        })
    }

    public loadAllTime() {
        this.bannerService.getAllTime().subscribe(users => {
            if(users.message[0].bannertiming.length > 0){
                this.timeslot = users.message[0].bannertiming;
                this.loadbanners('video');
            }else{
                this.timeslot = [];
            }
        });
    }

    public loadAllTimeImage() {
        this.bannerService.getAllTimeImage().subscribe(users => { 
            if(users.message[0].bannertiming.length > 0){
                this.timeslotImage = users.message[0].bannertiming;
                this.loadbanners('image');         
            }else{
                this.timeslotImage = [];
            }
        });
    }

    public loadbanners(type){
        var obj = {type : type};
        this.bannerService.getAllTypeBanner(obj).subscribe((banner) => {
            if(type == 'video' ){
                this.banner = banner.message;
            }else{
                this.bannerImage = banner.message;
            }
        });
    }

    public open(random){ 
        this.bannervideo = '';
        document.getElementById('myModalbanner').style.display='block';
        this.bannervideo =  this.banner[random];
        this.banneropen = true;
        this.vi();
    }

    public openImage(random){
        this.bannerImg = '';
        document.getElementById('mybannerimage').style.display='block';
        this.bannerImg =  this.bannerImage[random];
    }

    public opencall(){
        var random = this.randno();
        if(this.donebanner.length < this.timeslot.length){
            this.setitem(random);
        }
    }

    public opencallImage(){
        if(this.donebannerImage.length < this.timeslotImage.length){ 
            var random = this.randnoImage();
            this.setitemImage(random);
        }
    }

    public setitem(temp){
        var random = temp;
        var find1 = this.donebanner.indexOf(random);
        if((find1 != -1) && (this.donebanner.length != this.timeslot.length)){ 
            random = this.opencall();
        }else{
            this.donebanner.push(random); 
            this.repeatset(random);
        } 
    }

    public setitemImage(temp){
        var random = temp;
        var find1 = this.donebannerImage.indexOf(random);
        if((find1 != -1) && (this.donebannerImage.length != this.timeslotImage.length)){
            random = this.opencallImage();
        }else{
            this.donebannerImage.push(random);
            this.repeatsetImage(random);
        } 
    }  

    public repeatset(random){
        this.itemplayed = this.itemplayed+1;
        var timesetout1 = (this.timeslot[this.itemplayed-1].time * 1000);
        setTimeout(()=>{
            this.open(random);
        },timesetout1);
    } 

    public repeatsetImage(random){
        this.itemplayedImage = this.itemplayedImage+1;
        var timesetout = (this.timeslotImage[this.itemplayedImage-1].time * 1000);
        setTimeout(()=>{
            this.openImage(random);
        },timesetout);
    } 

    public randno(){
        var random = Math.floor(Math.random() * this.banner.length);
        return random;
    }

    public randnoImage(){
        var random = Math.floor(Math.random() * this.bannerImage.length);
        return random;
    }

    public sendMessageOnCall(data){
        let nme = JSON.parse(localStorage.getItem('currentCustomer')).username;
        this.sessionOBJ.signal({
            type: 'msg',
            data:  nme+'@@'+data
        }, function(error) {
            if (error) {
                console.log('Error sending signal:', error.name, error.message);
            } else {
                data = '';
            }
        });
        // this.msgList();
        (<HTMLInputElement>document.getElementById('btn-input')).value = "";
    }

    public close(){
        this.bannervideo = '';
        this.banneropen = false;
        document.getElementById('myModalbanner').style.display='none'; 
    }

    public closeImage(){
        document.getElementById('mybannerimage').style.display='none';          
    }

    public vi(){
        /*var vid = $("#myVideo");
        setTimeout(()=>{
            if (vid && vid != null) {
                vid.onended = () => {
                    this.close();
                    console.log(this.donebanner.length, this.timeslot.length);
                    if(this.donebanner.length < this.timeslot.length)
                    {
                        this.opencall();
                    }
                }
            }
        },500);*/
        setInterval(()=>{
            let video = document.getElementById('myVideo');
            if (video && video['ended']) {
                console.log('video ended');
                clearInterval(0);
                this.close();
                if(this.donebanner.length < this.timeslot.length){
                    this.opencall();
                }
            }
        },1000)
    }

    public closeviImage(){
        setTimeout(()=>{ 
            var vid = document.getElementById("mybannerimage");                                  
            this.bannerImg = ''; 
            this.closeImage();
            if(this.donebannerImage.length < this.timeslotImage.length){
                this.opencallImage();     
            }
        },500);
    }

    public getCustomer() {
        this.customerService.getOne(this.cid).subscribe(customers => { 
            this.profile = customers.message;

            this.token = customers.message.tokboxtoken;

            console.log("this.callsessionid");
            console.log(this.callsessionid);
            console.log("this.profile");
            console.log(this.profile);
            console.log("customers.message.tokboxsessionid");
            console.log(customers.message.tokboxsessionid);
            
            this.initializeSession(this.callsessionid, this.tokenid); 

            // if(this.callsessionid == customers.message.tokboxsessionid){
                
            //     /*if((typeof customers.message.mypackage !== 'undefined') && (customers.message.mypackage.remaincalls > 0)){*/
            //     }else{
            //         this.router.navigate(['customer/profiles-list']);
            //     }
            // }else{
            //     this.router.navigate(['customer/profiles-list']);
            //     /*this.customerService.getOne(this.connectedTo).subscribe((data) => {
            //         this.initializeSession(this.callsessionid, this.tokenid); 
            //     });*/
            // }
            
        });
    }
    
    public deductPackageCalls(){
        this.activatedRoute.queryParams.subscribe(params => {
            if(params["connected"] == 'yes'){
                this.customerService.getOne(this.cid).subscribe(customers => {
                    if(customers.message.remaincalls){
                        var calls = customers.message.remaincalls - 1;
                        /*customers.message.remaincalls = calls;*/
                        var newob = {_id : this.cid, remaincalls : calls}
                        this.customerService.updateCustomer(newob).subscribe((data) => {
                            console.log("data 22");
                        })
                    }
                }); 
            }  
        });     
    }

    public fullscreen(){
      if(this.screenwidth == 'mini'){
         this.screenwidth = 'max';
      }else{
          this.screenwidth = 'mini';
      }
    }

    public initializeSession(sessionId,token) {
        var session = OT.initSession(this.apiKey, sessionId);
        this.sessionOBJ = session;
        
        session.connect(token, (error) => {
            if (!error) {
                let publisher = OT.initPublisher('publisherContainer', 
                    {
                        width : 100,
                        height : 100,
                        "facingMode": 'user'
                    }, (error)=> {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(this.sessionOBJ);
                        console.log("Publisher initialized.");
                    }
                });
                session.publish(publisher, function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Publishing a stream.');                        
                    }
                });
            } else {
                console.log('There was an error connecting to the session: ', error.message);
            }
        });

        var connectionCount = 0;

        session.on('connectionCreated', (event) => {
            session.connection.data = JSON.parse(localStorage.getItem('currentCustomer')).firstname
            connectionCount++;
            if (event.connection.connectionId != session.connection.connectionId) {
                this.deductPackageCalls();
                this.opencall();
                this.opencallImage();
            }else{
                console.log('not any client connected. ');
            }
        });

        session.on('connectionDestroyed' , (event) => {
            connectionCount--;
            this.disconnectcall(); 
            console.log(connectionCount + ' connections.');
        });

        session.on('sessionDisconnected', function sessionDisconnectHandler(event) {
            // The event is defined by the SessionDisconnectEvent class
            console.log('Disconnected from the this.session.');
            document.getElementById('disconnectBtn').style.display = 'none';
            if (event.reason == 'networkDisconnected') {
                alert('Your network connection terminated.')
            }
        });

        session.on('streamCreated' , (event)=> {
            var subscriber = session.subscribe(event.stream,
            'subscriberContainer',{
                showControls: false,
                width : 100,
                height : 100
            },
            (error)=> {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Subscriber added.');
                }
            });
        });

        session.on('streamDestroyed', function (event) {

            if (event.reason === 'networkDisconnected') {
                event.preventDefault();
                var subscribers = session.getSubscribersForStream(event.stream);
                if (subscribers.length > 0) {
                    var subscriber = document.getElementById(subscribers[0].id);
                    // Display error message inside the Subscriber
                    subscriber.innerHTML = 'Lost connection. This could be due to your internet connection '
                    + 'or because the other party lost their connection.';
                    event.preventDefault();   // Prevent the Subscriber from being removed
                }
            }
        });
        
        session.on('signal' , function(event) {
            let cusObj = JSON.parse(localStorage.getItem('currentCustomer'));
            let nameAndMsg = event.data.split("@@");
            let name = '';
            if (nameAndMsg[0] == cusObj.username) {
                name = 'Me';
            }else{
                name = nameAndMsg[0];
            }
            let msgggg = nameAndMsg[1];
            var msgHis = document.getElementById('msgHistory');
            var msg = document.createElement('li');
            msg.className = event.from.connectionId === session.connection.connectionId ? 'message appeared right chat-textad tips-msg' : 'message appeared left chat-textad tips-msg';
            //console.log(event.data)
            if (msgggg != '') {
                msg.innerHTML = "<div class='text_wrapper' style='max-width: 287px;'><div class='text' style='text-align: left;'>"+ name+' : ' +msgggg + "</div></div>" ;
                msgHis.appendChild(msg);
            }
            var list =  document.querySelector(`div#emsgHistory_msgvideo`);
            list.scrollTop = list.scrollHeight;
        });
    }

    public handleError(error) {
        if (error) {
            alert(error.message);
        }
    }

    public disconnectcall(){
        if(this.sessionOBJ){
            this.sessionOBJ.disconnect(); 
            if(localStorage.getItem("searchedlist")){
                var url1 = JSON.parse(localStorage.getItem("searchedlist"));
                localStorage.removeItem("searchedlist");
                var ori = window.location.origin;
                var urlretrun = url1.replace(ori, "");
                setTimeout(()=> {
                    //this.router.navigate([urlretrun]);     
                    this.router.navigate(['customer/profiles-list', {country:  JSON.parse(localStorage.getItem("currentCustomer")).countryName}]);
                }, 500);
            }else{
                this.router.navigate(['customer/profiles-list']);
            }
        }
    }
}
