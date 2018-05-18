import { Component, OnInit } from '@angular/core';
import { UsersService,CustomerService,PackageService,BannerService,PageService } from '../../service/index';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  users : any = [];
  customers : any = [];
  packages :any = [];
  banners :any = [];
  pages : any = [];

  constructor(public usersService: UsersService ,public customerService : CustomerService, public packageService : PackageService, public bannerService : BannerService, public pageService : PageService) {}

  ngOnInit() {
    this.loadAllUsers();
    this.loadAllcustomers();
    this.loadAllpackages();
    this.loadAllbanners();
    this.loadAllpages();
  }

  public loadAllUsers() {
    this.usersService.getAll().subscribe(users => {
      this.users = users.message;       
    });
  }
  
   public loadAllcustomers() {
    this.customerService.getAll().subscribe(users => {
      this.customers = users.message;
    });
  }

   public loadAllpackages() {
    this.packageService.getAll().subscribe(users => {
      this.packages = users.message; 
    
    });
   }

  public loadAllbanners() {
    this.bannerService.getAll().subscribe(users => {
      this.banners = users.message; 
    
    });
  }

   public loadAllpages() {
    this.pageService.getAll().subscribe(users => {
      this.pages = users.message; 
    
    });
  }


}
