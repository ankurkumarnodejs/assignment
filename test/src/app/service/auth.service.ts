import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as globalVariable from "../global";


@Injectable()
export class AuthService {
    url: string = 'http://localhost:4005/users/';
    custUrl: string = 'http://localhost:4005/customer/';
    
  	constructor(private http: Http) { }

  	getUser(data){
  		return this.http.post(globalVariable.url+'users/login', data)
  			.map((response: Response) => {
  					let user = response.json();
            //this.getCustomer(data);
            localStorage.setItem('currentUser', JSON.stringify(user.data));
            });
	   }

getCustomer(data){
      return this.http.post(globalVariable.url+'customer/login', data)
        .map((response: Response) => { return response.json() });
     }

  	logout() {
      /*localStorage.removeItem('currentUser');
      localStorage.removeItem('currentChats');
      localStorage.removeItem('currentCustomer');*/

      localStorage.clear();
    }
    
  	getStatus(){
  		return this.http.get(globalVariable.url+'users/status');
	}
}
