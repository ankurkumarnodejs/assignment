import { Component, OnInit , Input} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChatService, SocketService, CustomerService} from '../../../service/index';
import * as globalVariable from "../../../global";
declare var $ : any;
declare var OT : any ;
declare var toastr : any;
toastr.options.timeOut = 3000;

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styles: []  
})
export class ChatComponent implements OnInit {  

    addmodel : FormGroup;
    mysocketId : any;
    oldchats : any = [];
    currentusers : any;
    cid : any; 
    vid : any;   
    chatObjMessage : any = {fromCustId: "", toCustId : "", fromSocketId : "", toSocketId : "", openBox : true, messages : []};
    localstorageChatList = [];
    onlineList: any = [];    
    chatLists : any = [];
    message : any;
    onlinelistforchat : any = [];
    call_resp : any;
    callingto : any;
    url : any = globalVariable.url+'uploads/';

    constructor( public lf: FormBuilder, public chatService : ChatService , public socketService: SocketService, public customerService : CustomerService , public router: Router, public route:ActivatedRoute) {}

    ngOnInit() { 
        this.addmodel = this.lf.group({
            description : ['',Validators.required]
        });

        this.cid = JSON.parse(localStorage.getItem('currentCustomer'))._id;

        //this.onlinenew();
        this.onlinenew();
        //this.newOnlineReceive();
        this.localStoredChat();
        this.selectForChat();
        this.tokboxNewReqReceive();
        //this.socketService.onlineList();
        this.callreceivedresponse();
        this.callcancel();
        this.sccall();
    }

    setvid(id){
        this.vid = id;
    }
    
    sendReport(){
        var obj = {FromId: this.cid, ForId: this.vid, type: "On Chat Box Report", description : this.addmodel.value.description};
        this.customerService.sendReport(obj).subscribe((data) => {
            if(!data.error){
               toastr.success("Your Abuse Report Has been submitted!");
                this.addmodel.reset();
                $(function () {
                    $('#report2').modal('toggle');
                }); 
            }else{
                 toastr.error("Something Went Wrong!");
            }
        });
    }

    sccall(){
        setTimeout(function(){
            document.querySelector('body').scrollTop = 1;  
        },700);
        setTimeout(() =>{
            var list =  document.querySelectorAll(`div.popup-messages`);
            if(list.length > 0){
                for(var i=0; i<list.length; i++){
                    list[i].scrollTop = list[i].scrollHeight;
                } 
            }           
        },200);
    }

    /*public onlinenew(){
        this.socketService.onlineList2().subscribe(response => { 
            this.onlinelistforchat = response.chatList;                       
            var index = response.chatList.findIndex(item => item._id == this.cid);            
            if(index != -1){
                this.mysocketId = response.chatList[index].socketId;               
            } 
            for(var i=0; i<response.chatList.length; i++){
                var index3 = this.chatLists.findIndex(item => item.toCustId == response.chatList[i]._id);  
                if(index3 != -1){
                    this.chatLists[index3].toSocketId = response.chatList[i].socketId;
                } 
            }
        }); 
       }*/

    public onlinenew(){              
        this.newOnlineReceive();       
    }

    localStoredChat(){
        if(localStorage.getItem('ChatList')){
            this.chatLists =  this.updateAllSocketids(); 
            var cl = this.chatLists.length;
            for(var i =0; i<cl; i++){
                var setobj= {fromCustId : this.cid, toCustId : this.chatLists[i].toCustId};
                this.setMsgInChat(setobj,i);
            }
            if(localStorage.getItem("ChatLists")){
                var vjson = JSON.parse(localStorage.getItem("ChatLists"));
                if(vjson.length > 0){
                    if(localStorage.getItem("ChatLists")){
                        var vjson = JSON.parse(localStorage.getItem("ChatLists"));
                        if(vjson.length > 0){
                            setTimeout(() =>{
                                var list =  document.querySelectorAll(`.popup-messages`);
                                for(var i=0; i<list.length; i++){
                                    console.log(list[i]);
                                    list[i].scrollTop = list[i].scrollHeight;
                                }                
                            },100);  
                        }
                    }
                }
            }
        }       
    }
    
    updateAllSocketids(){
        var datae = JSON.parse(localStorage.getItem('ChatList'));
        for(var i = 0; i<datae.length; i++){
            datae[i].fromSocketId = this.mysocketId;
        }
        localStorage.setItem('ChatList', JSON.stringify(datae));
        return JSON.parse(localStorage.getItem("ChatList"));
    }

    /*newOnlineReceive(){
        this.socketService.onlineList().subscribe(response => {
            this.onlinelistrecord(response);           
        });
        this.socketService.receiveMessages().subscribe(response => { 
            console.log("received message");
              
              

            this.formessrec(response);
        });
    }*/

    newOnlineReceive(){
        this.socketService.onlineList().subscribe(response => {
            console.log("online on chat page")
            this.onlinelistrecord(response);
        });
        this.socketService.receiveMessages().subscribe(response => {
            console.log("received message");
            setTimeout(() =>{
            var list =  document.querySelectorAll(`.popup-messages`);               
            for(var i=0; i<list.length; i++){
                console.log(list[i]);
                list[i].scrollTop = list[i].scrollHeight;
            }
        },1000);
            this.formessrec(response);
        });
    }

    onlinelistrecord(response){
        this.onlinelistforchat = response.chatList;
        var index = response.chatList.findIndex(item => item._id == this.cid);
        if(index != -1){
            this.mysocketId = response.chatList[index].socketId;
        }
        for(var i=0; i<response.chatList.length; i++){
            var index3 = this.chatLists.findIndex(item => item.toCustId == response.chatList[i]._id);
            if(index3 != -1){
                this.chatLists[index3].toSocketId = response.chatList[i].socketId;
            }
        }
        if(JSON.parse(localStorage.getItem('currentChats'))){
            this.oldchats = JSON.parse(localStorage.getItem('currentChats'));
            localStorage.setItem('currentChats', JSON.stringify(response));
        }else{
            this.oldchats = [];
            localStorage.setItem('currentChats', JSON.stringify(response));
        }
        this.onlineCust();
    }

    formessrec(response){
        const exist = this.chatLists.findIndex(item => item.toCustId == response.fromCustId); 

        if(exist != -1){                
            this.chatLists[exist].messages.push(response);
        }else{
            this.customerService.getOne(response.fromCustId).subscribe(itemr => {
                var newobj = {fromCustId : this.cid, toCustId : response.fromCustId};                    
                this.customerService.getmessage(newobj).subscribe(responsee => {
                    var obj = {fromCustId: this.cid, toCustId : response.fromCustId, email: itemr.message.email, username: itemr.message.username, firstname: itemr.message.firstname, lastname: itemr.message.lastname, fromSocketId :this.mysocketId, toSocketId : response.fromSocketId, openBox : 'open', messages : []};
                    var tobj = [];
                    if(localStorage.getItem('ChatList')){
                        tobj = JSON.parse(localStorage.getItem('ChatList'));
                        if(tobj.findIndex(item => item.toCustId == response.fromCustId) != -1){
                         tobj.push(obj); 
                        }                        
                    }else{
                         if(tobj.findIndex(item => item.toCustId == response.fromCustId) != -1){
                         tobj.push(obj); 
                        }
                    }                        
                    localStorage.setItem('ChatList', JSON.stringify(tobj));
                    obj.messages = responsee.message;
                    this.chatLists.push(obj);
                });
            });
        }

        if(localStorage.getItem("ChatLists")){
            var vjson = JSON.parse(localStorage.getItem("ChatLists"));
            if(vjson.length > 0){
            }
        }

        setTimeout(() =>{
            var list =  document.querySelectorAll(`.popup-messages`);               
            for(var i=0; i<list.length; i++){
                console.log(list[i]);
                list[i].scrollTop = list[i].scrollHeight;
            }
        },100);
    }

    selectForChat(){
        this.socketService.selectForChatResponse().subscribe(response => {
            if(localStorage.getItem('ChatList')){
                var checklocal1 : any =  JSON.parse(localStorage.getItem('ChatList'));
                const index = checklocal1.findIndex(item => item.toCustId == response.customerdetail._id);
                if(index != -1){
                    this.createNewChatBox(index, response);
                }else{
                    this.createNewChatBox(-1, response);
                }                
            }else{
                this.createNewChatBox(-1, response);
            }  
        });
    }

    createNewChatBox(index, response){
        if(index == -1) {
            var obj3 : any = {fromCustId: this.cid, toCustId : response.customerdetail._id, email: response.customerdetail.email, firstname: response.customerdetail.firstname, lastname: response.customerdetail.lastname, username: response.customerdetail.username, fromSocketId : this.mysocketId, toSocketId : response.customerdetail.socketId, openBox : 'open', messages : [], typing : ""};
            var nr : any = [];            
            if(localStorage.getItem('ChatList')){
                nr = JSON.parse(localStorage.getItem('ChatList'));
            }
            nr.push(obj3);
            localStorage.setItem('ChatList', JSON.stringify(nr));
            var newobj2 = {fromCustId : this.cid, toCustId : response.customerdetail._id};
            this.customerService.getmessage(newobj2).subscribe(data => {   
                obj3.messages = data.message;                
                this.chatLists.push(obj3);
                setTimeout(() =>{
                    var list =  document.querySelectorAll(`div.popup-messages`);
                    if(list.length > 0){
                        for(var i=0; i<list.length; i++){
                            list[i].scrollTop = list[i].scrollHeight;
                        } 
                    }           
                },1000);
            });
        }
        if(index != -1){
            var getlocal = JSON.parse(localStorage.getItem('ChatList'));
            var indexl = getlocal.findIndex(item => item.toCustId == response.customerdetail._id);
            var indexli = this.chatLists.findIndex(item => item.toCustId == response.customerdetail._id);
            getlocal[indexl].fromCustId = this.cid;
            getlocal[indexl].toCustId = response.customerdetail._id;
            getlocal[indexl].email = response.customerdetail.email;
            getlocal[indexl].firstname = response.customerdetail.firstname;
            getlocal[indexl].lastname = response.customerdetail.lastname;
            getlocal[indexl].username = response.customerdetail.username;
            getlocal[indexl].fromSocketId = this.mysocketId;
            getlocal[indexl].toSocketId = response.customerdetail.socketId;
            localStorage.setItem('ChatList',JSON.stringify(getlocal));
            this.chatLists[indexli].fromCustId = this.cid;
            this.chatLists[indexli].toCustId = response.customerdetail._id;
            this.chatLists[indexli].email = response.customerdetail.email;
            this.chatLists[indexli].firstname = response.customerdetail.firstname;
            this.chatLists[indexli].lastname = response.customerdetail.lastname;
            this.chatLists[indexli].username = response.customerdetail.username;
            this.chatLists[indexli].fromSocketId = this.mysocketId;
            this.chatLists[indexli].toSocketId = response.customerdetail.socketId;
        }
        if(localStorage.getItem("ChatLists")){

            var vjson = JSON.parse(localStorage.getItem("ChatLists"));
            if(vjson.length > 0){
                setTimeout(() =>{
                    var list =  document.querySelectorAll(`.popup-messages`);
                    for(var i=0; i<list.length; i++){
                        list[i].scrollTop = list[i].scrollHeight;
                    }                
                },1000);  
            }
        } 
    }     

    setMsgInChat(objUser,i){
        return this.customerService.getmessage(objUser).subscribe(response => {
            this.chatLists[i].messages = response.message;
            console.log("Message Set");
            setTimeout(() =>{
                var list =  document.querySelectorAll(`.popup-messages`);
                for(var i=0; i<list.length; i++){
                    list[i].scrollTop = list[i].scrollHeight;
                }
            },1000); 
        }); 
    }

    onlineCust(){  
        this.onlineList = [];     
        this.currentusers = JSON.parse(localStorage.getItem('currentChats'));
        if(this.oldchats.length == 0){
            for(var i=0; i<this.currentusers.chatList.length; i++){
                if(this.currentusers.chatList[i]._id != this.cid){
                    var chatboxi = {fromCustId: this.cid, toCustId : this.currentusers.chatList[i]._id, email: this.currentusers.chatList[i].email, username: this.currentusers.chatList[i].username, firstname: this.currentusers.chatList[i].firstname, lastname: this.currentusers.chatList[i].lastname, fromSocketId :this.mysocketId, toSocketId : this.currentusers.chatList[i].socketId, openBox : 'close', messages : []};
                    this.onlineList.push(chatboxi);
                }
            }
        }else{         
            for(var i=0; i<this.currentusers.chatList.length; i++){
                var newindex = this.oldchats.chatList.findIndex(item => item.toCustId == this.currentusers.chatList[i].toCustId);          
                if(newindex != -1){
                    if(this.currentusers.chatList[i]._id != this.cid){
                        this.currentusers.chatList[i];
                        var inputa = {fromCustId: this.cid, toCustId : this.currentusers.chatList[i]._id, email: this.currentusers.chatList[i].email, username: this.currentusers.chatList[i].username, firstname: this.currentusers.chatList[i].firstname, lastname: this.currentusers.chatList[i].lastname, fromSocketId :this.mysocketId, toSocketId : this.currentusers.chatList[i].socketId, openBox : this.oldchats.chatList[newindex].openBox, messages : []};
                        this.onlineList.push(inputa);
                    } 
                }else{
                    if(this.currentusers.chatList[i]._id != this.cid){
                        var inputb = {fromCustId: this.cid, toCustId : this.currentusers.chatList[i]._id, firstname: this.currentusers.chatList[i].firstname, username: this.currentusers.chatList[i].username, lastname: this.currentusers.chatList[i].lastname, email: this.currentusers.chatList[i].email, fromSocketId :this.mysocketId, toSocketId : this.currentusers.chatList[i].socketId, openBox : 'close',  messages : []};
                        this.onlineList.push(inputb);
                    } 
                }
            }
        }
    }

    sendMessage(event, msg, toId, stoId){
        if(event.keyCode === 13) {
            if(this.message === '' || this.message === null) {
                alert(`Message can't be empty.`);
            }else{
                if (this.message === '') {
                    alert(`Message can't be empty.`);
                }else{
                    const data = {
                        fromCustId : this.cid,
                        message : msg.trim(),
                        toCustId : toId,
                        toSocketId : stoId,
                        fromSocketId : this.mysocketId
                    }
                    var index = this.chatLists.findIndex(item => item.toCustId == toId);                     
                    this.chatLists[index].messages.push(data);
                    this.chatLists[index].typing = '';
                    if(localStorage.getItem("ChatLists")){
                        var vjson = JSON.parse(localStorage.getItem("ChatLists"));
                        if(vjson.length > 0){
                            if(localStorage.getItem("ChatLists")){
                                var vjson = JSON.parse(localStorage.getItem("ChatLists"));
                                if(vjson.length > 0){}
                            }  
                        }
                    }
                    this.socketService.sendMessage(data);
                    setTimeout(() =>{
                        var list =  document.querySelectorAll(`div.popup-messages`);
                        for(var i=0; i<list.length; i++){
                            list[i].scrollTop = list[i].scrollHeight;
                        }                
                    },100);
                }
            }
        }
    }

    removechatBox(removeid){
        var index = this.chatLists.findIndex(item => item.toCustId == removeid); 
        this.chatLists.splice(index,1);
        var get = JSON.parse(localStorage.getItem('ChatList'));
        var newindex = get.findIndex(item => item.toCustId == removeid);
        if(newindex != -1){
            get.splice(newindex,1);
            localStorage.setItem('ChatList', JSON.stringify(get));
        }
    }

    tokboxNewReqReceive(){
        this.socketService.vedioResponse().subscribe(response =>{
            this.call_resp = response;
            this.incomingcallinfo(this.call_resp.connectedTo);
            this.open();
        });
    }

    open(){
        // Get the modal
        //document.getElementById('myModalc').style.display = 'block';
        $('#videocallincoming').modal('show');
        //document.querySelector("#myModal").style.display = "block";
    }

    close(){
        // Get the modal
        $('#videocallincoming').modal('hide'); 
        //document.querySelector("#myModal").style.display = "block";
    }

    incomingcallinfo(id){ 
        this.customerService.getOne(id).subscribe((data) => {
            this.callingto = data.message;
        });
    }

    receivemodel(action){
        if(action == 'yes'){

            var obj1  = {status : true, share : this.call_resp};
            this.callreceived(obj1);
            this.call_resp = {};
            this.close();
        }else{    
            console.log("jk2",this.call_resp);        
            var obj2  = {status : false, share : this.call_resp };
            this.callreceived(obj2);
            this.call_resp = {};               
            this.close();
        }
    }

    callreceived(response){
        console.log("new person miaking call");
        if(response.status){
            var nid = response.share.connectedTo;
            response.share.connectedTo = this.cid;
            response.share.connectedFrom = nid;
            this.socketService.vediocallaccept(response);
            localStorage.setItem("searchedlist", JSON.stringify(window.location.href));
            this.router.navigate(['customer/video-call/', response.share.sessionid, response.share.tokenid, nid]);           
        }else{
            var redy = response.share.connectedTo;
            response.share.connectedFrom = redy;
            response.share.connectedTo = this.cid;
            console.log("callreceived3", response);
            this.socketService.vediocallaccept(response);
            //this.socketService.vediocallaccept(response); 
        }           
    }

    closecallingpopup(){$('#videocalloutgoing').modal('hide'); }   

    callreceivedresponse(){
        this.socketService.callrecivedresponse().subscribe(response => {
            if(response["status"] == true){
                // var obj = response
                console.log("send recived");
                console.log(response["share"]["sessionid"]);
                this.closecallingpopup();
                this.router.navigate(['customer/video-call/', response["share"]["sessionid"], response["share"]["tokenid"], response["share"]["connectedTo"]],  { queryParams: { connected : 'yes'}});
            }else{
                this.closecallingpopup();
            }
        });
    }

    callcancel(){
        this.socketService.cancalvediocallresponse().subscribe(response => {
            this.close();
        });
    }
}