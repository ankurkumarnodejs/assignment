import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

      @Injectable()
      export class CustomerService {          
      //url: string = 'http://localhost:4005/customer/';

          constructor(private http: Http) { }

          addCustomer(data) {
            return this.http.post(globalVariable.url+'customer/',data)
            .map(
              (response: Response) => response.json()
              );
          }

          updateCustomer(data) {
            return this.http.put(globalVariable.url+'customer/'+data._id,data)
            .map(
              (response: Response) => response.json()
              );
          }

          getAll() {
            return this.http.get(globalVariable.url+'customer/')
            .map(
              (response: Response) => response.json()
              );
          }
          
          getAllActive(){
             return this.http.get(globalVariable.url+'customer/activeuser')
            .map(
              (response: Response) => response.json()
              );
             }

          getOne(id) {
            return this.http.get(globalVariable.url+'customer/'+id)
            .map(
              (response: Response) => response.json()
              );
          }

          deleteOne(id) {
            return this.http.delete(globalVariable.url+'customer/'+id)
            .map(
              (response: Response) => response.json()
              );
          }


          getAllPackage() {
            return this.http.get(globalVariable.url+'package/')
            .map(
              (response: Response) => response.json()
              );
          }
          getOnePackage(id) {
            return this.http.get(globalVariable.url+'package/'+id)
            .map(
              (response: Response) => response.json()
              );
          }

          attachvisitor(id){
            return this.http.post(globalVariable.url+'customer/visitor/',id)
            .map(
              (response: Response) => response.json()
              );
          }


          getmessage(data) {
            return this.http.post(globalVariable.url+'customer/chat',data)
            .map(
              (response: Response) => response.json()
              );
          }

          filter(data){
            return this.http.post(globalVariable.url+'customer/filters',data)
            .map(
              (response: Response) => response.json());
          } 

          unreadMessage(data){
            return this.http.post(globalVariable.url+'customer/unreadmessage',data)
            .map(
              (response: Response) => response.json()
              );
          }   

          footerpages(){
            return this.http.get(globalVariable.url+'customer/')
            .map(
              (response: Response) => response.json()
              );
          }

          getAllLiveNow(id) {
            return this.http.get(globalVariable.url+'customer/live-now-list/'+id)
            .map(
              (response: Response) => response.json()
              );
          }

          addactivate(data){
            console.log(data);
            return this.http.post(globalVariable.url+'customer/account-confirms',data)
            .map(
              (response: Response) => response.json()
              );
          } 
        

        forgetPassword(data){        
          return this.http.post(globalVariable.url+'customer/forget-password',data)
          .map(
            (response: Response) => response.json()
            );
        } 


        loadAllBlockedUser(data){
        return this.http.post(globalVariable.url+'customer/blockeduser',data)
               .map((response: Response) => response.json());
        }

       sendContactQuery(data){
       return this.http.post(globalVariable.url+'customer/contactus',data)
      .map((response: Response) => response.json());
        }


      sendReport(data){
       return this.http.post(globalVariable.url+'customer/send-report',data)
      .map((response: Response) => response.json());
     }



        loadReports(data){
        return this.http.post(globalVariable.url+'customer/abusereport',data)
               .map((response: Response) => response.json());
        }

         getAllreport() {         
            return this.http.get(globalVariable.url+'customer/adminreport')
            .map(
              (response: Response) => response.json());
          }

         getAllBlocked() {
            return this.http.get(globalVariable.url+'customer/adminblocked')
            .map(
              (response: Response) => response.json()
              );
          }    

       featuredImage(){
          return this.http.get(globalVariable.url+'customer/featured')
            .map((response: Response) => response.json());
           } 

         changeTokboxToken(id){
            return this.http.get(globalVariable.url+'customer/change-tokbox-token/'+id)
            .map(
              (response: Response) => response.json()
              );
          }  

        allSpeedCustomerAvail(data) {
            return this.http.post(globalVariable.url+'customer/all-speed-avail',data)
            .map(
              (response: Response) => response.json()
              );
             }
       
       initnotifications(id){
            return this.http.get(globalVariable.url+'customer/initnotifications/'+id)
            .map(
              (response: Response) => response.json()
              );
       }

       readnotifications(id){
            return this.http.get(globalVariable.url+'customer/readnotifications/'+id)
            .map(
              (response: Response) => response.json()
              );
       }      
      
      allnotifications(id){
            return this.http.get(globalVariable.url+'customer/allnotifications/'+id)
            .map(
              (response: Response) => response.json()
              );
       }
       getUserCountry(){
                  return this.http.get(globalVariable.url+'customer/userscountry')
                  .map(
                    (response: Response) => response.json()
                    );
             }
       
      checkCustomerExists(data) {
        return this.http.post(globalVariable.url+'customer/checkuseroremail',data)
          .map((response: Response) => response.json());
      }  


      }

     
