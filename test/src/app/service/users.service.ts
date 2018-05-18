import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";


@Injectable()
export class UsersService {
    url: string = 'http://localhost:4005/users/';
  	constructor(private http: Http) { }

    addUser(data) {
        return this.http.post(globalVariable.url+'users/',data)
        .map(
            (response: Response) => response.json()
        );
    }

userRegistration(data) {
        return this.http.post(globalVariable.url+'users/'+'register',data)
        .map(
            (response: Response) => response.json()
        );

    }


adminRegistration(data) {
        return this.http.post(globalVariable.url+'users/'+'registerAdmin',data)
        .map(
            (response: Response) => response.json()
        );

    }


    updateUser(data) {
        return this.http.put(globalVariable.url+'users/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url+'users/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url+'users/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url+'users/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }
    forgetPassword(data){
        return this.http.post(globalVariable.url+'users/forget-password',data)
        .map(
            (response: Response) => response.json()
        );
    }
   

    updatePassword(data) {
        return this.http.post(globalVariable.url+'users/changepassword',data)
        .map(
            (response: Response) => response.json()
        );
    }

   
}
