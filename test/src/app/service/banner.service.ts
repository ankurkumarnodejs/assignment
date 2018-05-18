import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class BannerService {
	url: string = 'http://localhost:4005/banner/';
  	
  	constructor(private http: Http) { }

  	addUser(data) {
        return this.http.post(globalVariable.url+'banner/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateUser(data) {
        return this.http.put(globalVariable.url+'banner/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url+'banner/')
  			.map(
  				(response: Response) => response.json()
  			);
    }
    
  

    getOne(id) {
          return this.http.get(globalVariable.url+'banner/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url+'banner/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }
    
    getAllTime() {
      return this.http.get(globalVariable.url+'bannertime/')
        .map(
          (response: Response) => response.json()
        );
    }

    addTiming(data) {
        return this.http.post(globalVariable.url+'bannertime/',data)
        .map(
            (response: Response) => response.json()
        );
    }
   
    deleteOneTime(id) {
      return this.http.delete(globalVariable.url+'bannertime/'+id)
        .map(
          (response: Response) => response.json()
        );
    }

    getAllrand(len) {
      return this.http.get(globalVariable.url+'banner-rand/'+len)
        .map(
          (response: Response) => response.json()
        );
    }


      addTimingImage(data) {
        return this.http.post(globalVariable.url+'bannertimeimage/',data)
        .map(
            (response: Response) => response.json()
        );
      }

      deleteOneTimeImage(id) {
      return this.http.delete(globalVariable.url+'bannertimeimage/'+id)
        .map(
          (response: Response) => response.json()
        );
    }

    getAllTimeImage() {
      return this.http.get(globalVariable.url+'bannertimeimage/')
        .map(
          (response: Response) => response.json()
        );
    }
    
    getAllTypeBanner(data) {
        return this.http.post(globalVariable.url+'bannertype/',data)
        .map(
            (response: Response) => response.json()
        );
    }

updateBannerTime(data){  
    return this.http.put(globalVariable.url+'bannertimeupdate/'+data._id,data)
        .map((response: Response) => response.json());
    
}
}
