import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
/*npm install @types/socket.io-client --save*/
//import * as io from 'socket.io-client';
import { Socket } from 'ng-socket-io';

@Injectable()
export class SocketService {

	constructor(private http: Http , private socket: Socket) {}
	
				customerOnline(){ 
					console.log(this.socket.ioSocket.id, "customerOnline service");       
					if(this.socket.ioSocket.id){ 
					if(localStorage.getItem('currentCustomer'))  {
					var currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
					var sid = this.socket.ioSocket.id;
					var obj = {fromId : currentCustomer._id, fromSocketId: sid};
					this.socket.emit('iamonline' , obj);
					} 
					} 
				}

				checkconnection(){
					return this.socket.ioSocket.connected;
				}


    /*RENAME onReloadCustomerOnline TO customerOnline2*/

				onReloadCustomerOnline(){
					setTimeout(() => { 
					if(localStorage.getItem('currentCustomer'))  {
					var currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
					var sid = this.socket.ioSocket.id;
					var obj = {fromId : currentCustomer._id, fromSocketId: sid};
					this.socket.emit('iamonline2' , obj);
					}
					}, 2000);
				} 

				customerOffline(){
					if(localStorage.getItem('currentCustomer'))  {
					var currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
					var sid = this.socket.ioSocket.id;
					var obj = {fromId : currentCustomer._id, fromSocketId: sid};     	
					this.socket.emit('iamoffline' , obj);
					localStorage.removeItem('currentCustomer');  
				    }					   	
				}


				onlineList():any {	
				//this.removelisner();
					let observable = new Observable(observer => {
					this.socket.on('chat-list-response', (data) => { 
					console.log("chat-list-response service");       
					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
				}	

					
				onlineList5():any {	
					this.removelisner19();
					return this.socket
					.fromEvent("chat-list-response5")
					.map( data => data );
				}


				onlineListon2():any {	
				//this.removelisner5();     
					let observable = new Observable(observer => {
					this.socket.on('chat-list-response-online2', (data) => { 

					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
				}


				offline2():any {
					// this.removelisner6();
					let observable = new Observable(observer => {
					this.socket.on('offline2', (data) => { 
					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
			      	}

				


				onlineList2emit(){
					var currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'))._id;
					var obj1 = { cid : currentCustomer };
					this.socket.emit('getAllonline' , obj1);
				}


				onlineList2():any {	
					this.removelisner2();
					let observable = new Observable(observer => {
					this.socket.on('chat-list-response2', (data) => {    

					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
				}

				onlineList3emit(){
					var currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'))._id;
					var obj1 = {cid : currentCustomer};
					this.socket.emit('getAllonline3' , obj1);
				}

				onlineList4emit(){
					var currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'))._id;
					var obj1 = {cid : currentCustomer};
					this.socket.emit('getAllonline4' , obj1);
				}

				onlineList3():any {	
					this.removelisner7();
					let observable = new Observable(observer => {
					this.socket.on('chat-list-response3', (data) => {    

					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
				}

				onlineList4():any {	
					this.removelisner15();
					let observable = new Observable(observer => {
					this.socket.on('chat-list-response4', (data) => {    

					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
				}


				disconnect(){
					if(this.socket.ioSocket.connected == true){
					this.socket.disconnect();  
					}  
				}

				selectForChat(userId:string, myid : String):any {
					this.socket.emit('select-for-chat' , { cid : userId, resid: myid});
				}

				selectForChatResponse():any{ 
					this.removelisner3();	
					let observable = new Observable(observer => {
					this.socket.on('select-for-chat-response', (data) => {
					observer.next(data);    
					});
					return () => {
					this.socket.disconnect();
					};  
					});     
					return observable;
				}

				sendMessage(message:any):void{
					this.socket.emit('add-message', message);
				}

				receiveMessages():any{
					//this.removelisner4();
					let observable = new Observable(observer => {
						this.socket.on('add-message-response', (data) => {
							observer.next(data);    
						});

						return () => {
							this.socket.disconnect();
						};  
					});     
					return observable;
				}

				video(data){
					this.socket.emit('add-vedio', data);
				}

				vedioResponse(){
					this.removelisner9();
					let observable = new Observable(observer => {
						this.socket.on('vedio-response', (data) => {
							observer.next(data);    
						});

						return () => {
							this.socket.disconnect();
						};  

					})     
					return observable;
				}

				vediocallaccept(data)
				{
					this.socket.emit('add-vedio-accept', data);
				}

				callrecivedresponse(){
					this.removelisner8();
					let observable = new Observable(observer => {
						this.socket.on('callrecivedresponse', (data) => {
							observer.next(data);    
						});
						return () => {
							this.socket.disconnect();
						};
					})     
					return observable;
				}

				callcancel(data){			
					this.socket.emit('cancel-vedio-call', data);
				}	

				cancalvediocallresponse():any{ 
					this.removelisner10();	
					let observable = new Observable(observer => {
						this.socket.on('cancel-vedio-call-response', (data) => {

							observer.next(data);    
						});
						return () => {
							this.socket.disconnect();
						};  
					});     
					return observable;
				}

				liveBrodcast(data){
					this.socket.emit("live-broadcast",  data);
				}

				notify(data){ 
					this.socket.emit("viewby",  data);
				}
              
                notify2(data){ 
					this.socket.emit("viewby2",  data);
				}

				notifyResponse():any{ 
					this.removelisner14();
					let observable = new Observable(observer => {
						this.socket.on('viewby-response', (data) => {
							observer.next(data);    
						});
						return () => {
							this.socket.disconnect();
						};  
					});     
					return observable;
				}


				notifyResponse2():any{ 
					this.removelisner16();
					let observable = new Observable(observer => {
						this.socket.on('viewby-response2', (data) => {
							observer.next(data);    
						});
						return () => {
							this.socket.disconnect();
						};  
					});     
					return observable;
				}


				liveBrodcastResponse():any{ 
					this.removelisner11();
					let observable = new Observable(observer => {
						this.socket.on('live-broadcast-response', (data) => {

							observer.next(data);    
						});
						return () => {
							this.socket.disconnect();
						};  
					});     
					return observable;
				}


				speeddatingvideo(data){
					this.socket.emit('speed-dating-video', data);
				}


				speeddatingResponse(){
					this.removelisner13();
					let observable = new Observable(observer => {
						this.socket.on('speed-dating-video-response', (data) => {
							observer.next(data);    
						});
						return () => {
							this.socket.disconnect();
						};  
					})     
					return observable;
				}

  


			removelisner(){
			this.socket.removeAllListeners("chat-list-response");
			}

			removelisner2(){
			this.socket.removeAllListeners("chat-list-response2");
			}

			removelisner3(){
			this.socket.removeAllListeners("select-for-chat-response");
			}
			/*removelisner4(){
			this.socket.removeListener("add-message-response");
			}*/
			removelisner5(){
			this.socket.removeAllListeners("chat-list-response-online2");
			}
			removelisner6(){
			this.socket.removeAllListeners("offline2");
			}
			removelisner7(){
			this.socket.removeAllListeners("chat-list-response3");
			}

			removelisner8(){
			this.socket.removeAllListeners("callrecivedresponse");
			}
			removelisner9(){
			this.socket.removeAllListeners("vedio-response");
			}   
			removelisner10(){
			this.socket.removeAllListeners("cancel-vedio-call-response");
			}
			removelisner11(){
			this.socket.removeAllListeners("live-broadcast-response");
			}

			removelisner12(){
			this.socket.removeAllListeners("disconnect-to-other-response");
			}

			removelisner13(){
			this.socket.removeAllListeners("speed-dating-video-response");
			}

			removelisner14(){
			this.socket.removeAllListeners("viewby-response");
			}
			removelisner16(){
			this.socket.removeAllListeners("viewby-response2");
			}
			removelisner15(){
			this.socket.removeAllListeners("chat-list-response4");
			}
			removelisner19(){
			this.socket.removeAllListeners("chat-list-response5");
			}

}
