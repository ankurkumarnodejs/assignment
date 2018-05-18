import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";


@Injectable()
export class FriendService {
  
  url: string = 'http://localhost:4005/friend/';

  constructor(private http: Http) { }

  addFriend(data) {
    return this.http.post(globalVariable.url+'friend/',data)
    .map(
      (response: Response) => response.json()
      );
  }

  updateFriend(data) {
    return this.http.put(globalVariable.url+'friend/'+data._id,data)
    .map(
      (response: Response) => response.json()
      );
  }

  updateacceptblockFriend(data) {
    return this.http.post(globalVariable.url+'friend/'+'accept-block',data)
    .map(
      (response: Response) => response.json()
      );
  }

  acceptFriendList(data) {
    return this.http.post(globalVariable.url+'friend/'+'requiest-accept',data)
    .map(
      (response: Response) => response.json()
      );
  }

  blockFriendList(data) {
    return this.http.post(globalVariable.url+'friend/requiest-block',data)
    .map(
      (response: Response) => response.json()
      );
  }

  getAll() {
    return this.http.get(globalVariable.url+'friend/')
    .map(
      (response: Response) => response.json()
      );
  }

  getAllRequiestNotInSelf(id){

    return this.http.post(globalVariable.url+'friend/'+'getAllRequiestNotInSelf/',{uData:id})
    .map(
      (response: Response) => response.json()
      );
  }

  getSendRequest(id){
    return this.http.get(globalVariable.url+'friend/getSentRequest/'+id)
    .map(
      (response: Response) => response.json()
      );
  }

  getAllSendRequistMe(id){

    return this.http.post(globalVariable.url+'friend/'+'getAllSendRequistMe/',{uData:id})
    .map(
      (response: Response) => response.json()
      );
  }

  getAllRequiestAcceptSelf(id){

    return this.http.post(globalVariable.url+'friend/'+'getAllRequiestAcceptSelf/',{uData:id})
    .map(
      (response: Response) => response.json()
      );
  }      

  getAllAcceptRequistMe(id){

    return this.http.post(globalVariable.url+'friend/'+'getAllAcceptRequistMe/',{uData:id})
    .map(
      (response: Response) => response.json()
      );
  } 

  getOne(id) {
    return this.http.get(globalVariable.url+'friend/'+id)
    .map(
      (response: Response) => response.json()
      );
  }

  deleteOne(id) {
    return this.http.delete(globalVariable.url+'friend/'+id)
    .map(
      (response: Response) => response.json()
      );
  }

  getAllFriendAllow(id){      
    return this.http.get(globalVariable.url+'friend/'+'/customer-list-allow/'+id)
    .map(
      (response: Response) => response.json()
      );
  } 

  findForDelete(data) {
    return this.http.post(globalVariable.url+'friend/for-delete/',data)
    .map(
      (response: Response) => response.json()
      );
  } 



  myfriends(data) {
    return this.http.post(globalVariable.url+'friend/myfriends',data)
    .map(
      (response: Response) => response.json()
      );
  }
  
  mypendingrequest(data) {
    return this.http.post(globalVariable.url+'friend/mypendingrequest',data)
    .map(
      (response: Response) => response.json()
      );
  }


 myblocked(data) {
    return this.http.post(globalVariable.url+'friend/myblocked',data)
    .map(
      (response: Response) => response.json()
      );
  }

    updateFriendunlock(data){
    return this.http.post(globalVariable.url+'friend/myunblocked',data)
    .map(
      (response: Response) => response.json()
      );
    }

    checkBlockedMe(obj){
    return this.http.post(globalVariable.url+'friend/checkblockedMe', obj)
        .map((response: Response) => response.json());
    }


}
