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
  selector: 'app-speed-dating',
  templateUrl: './speed-dating.component.html',
  styleUrls: ['./speed-dating.component.css']
})
export class SpeedDatingComponent implements OnInit {

    newCandidate: any = "";
    cid : any = "";
    processing : any = false;
    donestack : any = [];
    sessionOBJ : any;
    apiKey = '46076142';
    screenwidth = 'mini';
    url = globalVariable.url+'uploads/'; 

    /* banner image  variable */
    timeslotImage:any = [];
    banner: any = [];
    bannerImage : any = [];
    donebannerImage : any = [];
    itemplayedImage :  any = 0;
    bannerImg :  any;

   /* banner video variable */
   timeslot : any = [];
   donebanner : any = [];
   itemplayed : any = 0;
   bannervideo : any;
   banneropen: any = false;


    constructor(
        public customerService: CustomerService,
        public bannerService : BannerService,
        public socketService : SocketService,
        public router: Router,
        public route: ActivatedRoute
        ) {
        this.loadAllTime();
        this.loadAllTimeImage();
    }

    ngOnInit(){
        if(localStorage.getItem('currentCustomer')){
            this.cid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
            if(typeof this.cid != 'undefined'){
                this.donestack.push(this.cid);
            }
            var objinit = {speedstatus : true, isbusyspeed: false};
            this.updateCustomer(objinit);
        }
        this.initSpeeddateresponse();
    }

    ngOnDestroy(){
        this.changetokbox();
        var objdestroy = {speedstatus : false, isbusyspeed : false};

        this.updateCustomer(objdestroy); 
       
        if(typeof this.sessionOBJ != "undefined"){
            this.sessionOBJ.disconnect();
            console.log("leave component & sessionOBJ inside");
        }        
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

    public fullscreen(){
        if(this.screenwidth == 'mini'){
            this.screenwidth = 'max';
        }else{
            this.screenwidth = 'mini';
        }
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

    public opencallImage(){
        console.log("bopencallqqqqq");  
        if(this.donebannerImage.length < this.timeslotImage.length){ 
            var random = this.randnoImage();
            this.setitemImage(random);
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

    public repeatsetImage(random){
        this.itemplayedImage = this.itemplayedImage+1;
        var timesetout = (this.timeslotImage[this.itemplayedImage-1].time * 1000);
        setTimeout(()=>{
            this.openImage(random);
            console.log(100);
        },timesetout);
    } 

    public randnoImage(){
        var random = Math.floor(Math.random() * this.bannerImage.length);
        console.log("randno"+ random);
        return random;
    }

    public openImage(random){ 
        this.bannerImg = '';                
        document.getElementById('mybannerimage').style.display='block';
        this.bannerImg =  this.bannerImage[random];
    }

    public closeImage(){
        document.getElementById('mybannerimage').style.display='none';
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

    public repeatset(random){
        this.itemplayed = this.itemplayed+1;
        var timesetout1 = (this.timeslot[this.itemplayed-1].time * 1000);
        setTimeout(()=>{

            console.log('timesetout1');
            console.log(timesetout1);
            this.open(random);
        },timesetout1);
    }

    public open(random){
        this.bannervideo = '';
        document.getElementById('myModalbanner').style.display='block';
        this.banneropen = true;
        this.bannervideo =  this.banner[random];
        this.vi();
    }

    public vi(){
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

    public close(){
        this.bannervideo = '';
        document.getElementById('myModalbanner').style.display='none';
        this.banneropen = false;
    }

    public  opencall(){
        var random = this.randno();
        if(this.donebanner.length < this.timeslot.length){
            this.setitem(random);
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

    public randno(){
        var random = Math.floor(Math.random() * this.banner.length);
        return random;
    }

    public initSpeeddateresponse(){
        this.socketService.speeddatingResponse().subscribe((data) => {
            if(typeof this.sessionOBJ != "undefined"){
                console.log("after");
                this.sessionOBJ.disconnect();
            }

            if(this.donestack.indexOf(data["fromid"]) == -1){
                this.donestack.push(data["fromid"]); 
            }    
            this.initializeSession(data["sessionid"], data["tokenid"]);
        });
    }

    public updateCustomer(newdata){

        var data = {_id : this.cid};

        if(typeof newdata.speedstatus !== 'undefined')
        {
            data["speedstatus"] = newdata.speedstatus;
        }

        if(typeof newdata.isbusyspeed !== 'undefined')
        {
            data["isbusyspeed"] = newdata.isbusyspeed;
        }

        this.customerService.updateCustomer(data).subscribe((item) => {
            if(newdata.speedstatus == true){
                this.speedCustomerAvail();
            }
        });
    }

    public next(){
        var obj = {isbusyspeed : false};
        this.updateCustomer(obj);
        if(typeof this.sessionOBJ != "undefined")
        {
            this.sessionOBJ.disconnect();
        }
        this.speedCustomerAvail();
    }

    public disconnectall(){
        var objdisconnect = {speedstatus : false, isbusyspeed : false};
        this.updateCustomer(objdisconnect);
        this.sessionOBJ.disconnect();  
        this.router.navigate(['customer/profiles-list']);
    }

    public speedCustomerAvail(){
        this.openModal();
        var obj = {ids : this.donestack};

        this.customerService.allSpeedCustomerAvail(obj).subscribe((data) => {
            console.log("data");
            console.log(data);
            this.newCandidate = data.data;

            if((data.data != "") && (this.newCandidate._id != 'undefined')){
                this.newCandidate.fromid = this.cid;
                this.socketService.speeddatingvideo(this.newCandidate);
                this.initializeSession(this.newCandidate.tokboxsessionid , this.newCandidate.tokboxtoken);
                if(this.donestack.indexOf(this.newCandidate._id) == -1){
                    this.donestack.push(this.newCandidate._id);    
                }
            }else{

                setTimeout(() => {
                    this.customerService.getOne(this.cid).subscribe((data)=>{
                        if(data.message.isbusyspeed == false){
                            toastr.remove();
                            toastr.success("No One on Speed Dating!"); 
                            this.router.navigate(['customer/profiles-list']);
                        }
                    });                 
                }, 30000);           
            }
        });
    }

    public changetokbox(){
        this.customerService.changeTokboxToken(this.cid).subscribe((item) => {       
            console.log("done token chnage");
        });
    }

    public initializeSession(sessionId,token) {
        var session = OT.initSession(this.apiKey, sessionId);
        /*console.log(sessionId,token);
        console.log("session");
        console.log(session);*/

        this.sessionOBJ = session;

        session.connect(token, (error) => {
            if (!error) {
                var a:any = 100;
                var b:any = 100;
                /*var publisherProperties = {width:'341px',insertMode: "append"};*/
                let publisher = OT.initPublisher('publisherContainer', {
                    "width" : a,
                    "height" : b,
                    "facingMode": 'user'
                }, (error)=> {
                    if (error) {
                        console.log(error);
                    } else {
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
            var objdisconnect = {isbusyspeed : true};
            this.updateCustomer(objdisconnect);

            session.connection.data = JSON.parse(localStorage.getItem('currentCustomer')).firstname
            connectionCount++;
            if (event.connection.connectionId != session.connection.connectionId) {
                this.opencall();    
                this.opencallImage();
                console.log('Another client connected. ' + connectionCount + ' total.');
            }else{
                console.log('not any client connected. ');
            }
        });

        session.on('connectionDestroyed', (event) => {
            connectionCount--;
            this.sessionOBJ.disconnect();     
            this.changetokbox();            
            this.openModal();        
            var objdisconnect = {isbusyspeed : false};        
            this.updateCustomer(objdisconnect);
            this.speedCustomerAvail(); 
            this.bannervideo = ''; 
            this.close();
        });

        session.on('streamCreated', (event) => {
            this.closeModal();
            var subscriber = session.subscribe(event.stream,
                'subscriberContainer',
                {
                    showControls: false,
                    width : 100,
                    height : 100
                },
                function (error) {
                    if (error) {
                        console.log("error on streamCreated");
                        console.log(error);
                    } else {
                        event['data'] = JSON.parse(localStorage.getItem('currentCustomer')).firstname
                        console.log('Subscriber added.');
                    }
                });
        });

        session.on('streamDestroyed', function (event) {

            console.log("event on streamDestroyed");
            console.log(event);

            if (event.reason === 'networkDisconnected') {
                event.preventDefault();
                var subscribers = session.getSubscribersForStream(event.stream);
                if (subscribers.length > 0) {
                    var subscriber = document.getElementById(subscribers[0].id);
                    subscriber.innerHTML = 'Lost connection. This could be due to your internet connection ' + 'or because the other party lost their connection.';
                    event.preventDefault();
                }
            }
        });

        session.on('sessionDisconnected', function sessionDisconnectHandler(event) {
            document.getElementById('disconnectBtn').style.display = 'none';
            if (event.reason == 'networkDisconnected') {
                alert('Your network connection terminated.')
            }
        });

        session.on('signal', function(event) {

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

    public sendMessageOnCall(data){
        let nme = JSON.parse(localStorage.getItem('currentCustomer')).username;
        console.log('name',nme)
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
        (<HTMLInputElement>document.getElementById('btn-input')).value = "";
    }


    public openModal() {
        document.getElementById('process').style.display = "block";
        var rids1 = document.getElementsByClassName("relativeclass11");
        for (var i = 0; i < rids1.length; i++){
            (<HTMLInputElement>rids1[i]).className += " " + 'minimizes';
        }
        document.getElementById('msgHistory').innerHTML = "";        
    }

    public closeModal() {
        document.getElementById('process').style.display = "none";
        var rids1 = document.getElementsByClassName("relativeclass11");
        for (var i = 0; i < rids1.length; i++){
            (<HTMLInputElement>rids1[i]).classList.remove("minimizes");
        }
    }
}
