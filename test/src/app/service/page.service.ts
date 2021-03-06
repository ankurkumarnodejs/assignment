import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class PageService {
//url: string = 'http://localhost:4005/page/';
  	
  	constructor(private http: Http) { }

  	addUser(data) {
        return this.http.post(globalVariable.url+'page/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateUser(data) {
        return this.http.put(globalVariable.url+'page/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url+'page/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url+'page/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url+'page/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

     getPage(str) {
       console.log(str);
       var obj = {"str" : str};
          return this.http.post(globalVariable.url+'pagename/',obj)
              .map(
                  (response: Response) => response.json()
              );
       }
    }

