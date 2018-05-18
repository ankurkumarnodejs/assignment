import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class ChatService {
   url: string = 'http://localhost:4005/chat/';
  	constructor(private http: Http) { }

    getAll() {
      return this.http.get(globalVariable.url+'chat/')
        .map(
          (response: Response) => response.json()
           );
        }
        
   /* addUser(data) {
        return this.http.post(this.url,data)
        .map(
            (response: Response) => response.json()
        );
    }

userRegistration(data) {
        return this.http.post(this.url+'register',data)
        .map(
            (response: Response) => response.json()
        );

    }


adminRegistration(data) {
        return this.http.post(this.url+'registerAdmin',data)
        .map(
            (response: Response) => response.json()
        );

    }


    updateUser(data) {
        return this.http.put(this.url+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(this.url)
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(this.url+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(this.url+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }*/
}
