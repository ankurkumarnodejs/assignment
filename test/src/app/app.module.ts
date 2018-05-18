import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { routing }        from './app.routing';
import { AuthGuard,CustomerAuthGuard } from './guards/index';

/* External Modules */
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { TinymceModule } from 'angular2-tinymce';
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule , FileDropDirective } from 'ng2-file-upload';
import { ReCaptchaModule } from 'angular2-recaptcha';

/* Admin Components */
import { AdminCommonComponent } from './admin/common/common.component';
import { AdminLoginComponent, AdminRegistrationComponent, AdminResetPasswordComponent} from './admin/admin-login/admin-login.component';
import { ProfileComponent,AdminChangePasswordComponent } from './admin/profile/profile.component';
import { AdminHeaderComponent} from './admin/header/header.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent, UsersupdateComponent, UsersaddComponent} from './admin/users/users.component';
import { CustomerComponent,CustomerlistComponent,CustomeraddComponent,CustomerupdateComponent, AdminShowBlockedUserComponent,AdminViewAbuseReportComponent } from './admin/customer/customer.component';
import { PackageComponent,PackagelistComponent,PackageaddComponent,PackageupdateComponent } from './admin/package/package.component'
import { BannerComponent,BannerlistComponent,BanneraddComponent,BannerupdateComponent} from './admin/banner/banner.component';
import { BannerTimeComponent,BannerlistTimeComponent,BanneraddTimeComponent,BanneraddTimeImageComponent} from './admin/bannersetting/banner.component';
import { PageComponent,PagelistComponent,PageaddComponent,PageupdateComponent } from './admin/page/page.component';
import { CountryComponent,CountrylistComponent,CountryaddComponent} from './admin/country/country.component';


/* Services & Pipes*/
import * as globalVariable from "./global";
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
import {AlertService, CountryService, AuthService, UsersService,CustomerService,PageService, BannerService, PackageService, PromotionService,FriendService,ChatService, SocketService } from './service/index';
import {OrderPipe} from "./order.pipe";
import {SafePipe} from "./iframe.pipe";
import {FilterPipe} from "./filter.pipe";
import { EllipsisPipe } from './ellipsis.pipe';

/*Main App Components */
import { AppComponent } from './app.component';


/* Customer Component */
import { FrontendCommonComponent } from './frontend/common/common.component';
import { LoginComponent } from './frontend/login/login.component';
import { ActivateAccountComponent } from './frontend/activateaccount/activateaccount.component';
import { CustomerHeaderComponent } from './frontend/header/header.component';
import { CustomerFooterComponent } from './frontend/footer/footer.component';
import { CustomerCommonComponent } from './frontend/customer/customer.component';
import { CustomerProfileComponent } from './frontend/customer/profile/profile.component';
import { CustomerProfilesListComponent } from './frontend/customer/profiles-list/profile-list.component';
import { CommonListingComponent } from './frontend/customer/common-listing/common-listing.component';
import { ChatComponent } from './frontend/customer/chat/chat.component';
import { PublicProfileComponent } from './frontend/customer/public-profile/public-profile.component';
import { VideoCallComponent } from './frontend/customer/video-call/video-call.component';
import { SpeedDatingComponent } from './frontend/customer/speed-dating/speed-dating.component';
import { ContactUsComponent } from './frontend/customer/contact-us/contact-us.component';
import { FrontendPageComponent } from './frontend/customer/page/page.component';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component';




@NgModule({
  declarations: [
    AppComponent,
    AdminCommonComponent,
    AdminLoginComponent, 
    AdminRegistrationComponent,
    AdminResetPasswordComponent,
    ProfileComponent,
    AdminChangePasswordComponent,
    AdminHeaderComponent,
    DashboardComponent,
    UsersComponent,
    UsersupdateComponent,
    UsersaddComponent,
    CustomerComponent,
    CustomerlistComponent,
    CustomeraddComponent,
    CustomerupdateComponent, 
    AdminShowBlockedUserComponent,
    AdminViewAbuseReportComponent,
    PackageComponent,
    PackagelistComponent,
    PackageaddComponent,
    PackageupdateComponent,
    BannerComponent,
    BannerlistComponent,
    BanneraddComponent,
    BannerupdateComponent,
    BannerTimeComponent,
    BannerlistTimeComponent, 
    BanneraddTimeComponent,
    BanneraddTimeImageComponent,
    PageComponent,
    PagelistComponent,
    PageaddComponent,
    PageupdateComponent,
    CountryComponent,
    CountrylistComponent,
    CountryaddComponent,
    FrontendCommonComponent,
    LoginComponent, 
    OrderPipe,
    SafePipe,
    FilterPipe,
    ActivateAccountComponent,
    CustomerHeaderComponent,  
    CustomerFooterComponent,
    CustomerCommonComponent,
    CustomerProfileComponent,
    CustomerProfilesListComponent,
    CommonListingComponent,
    ChatComponent,
    PublicProfileComponent,
    VideoCallComponent,
    SpeedDatingComponent,
    ContactUsComponent,
    FrontendPageComponent,
    ResetPasswordComponent,
    EllipsisPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    routing,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    TinymceModule.withConfig({'auto_focus':false,}),
    ReCaptchaModule
  ],
  exports: [FileUploadModule],
  providers: [AuthGuard,CustomerAuthGuard, CustomerService ,AlertService, AuthService, UsersService, PageService, BannerService, PackageService, PromotionService,FriendService, ChatService, SocketService,CountryService],
  bootstrap: [AppComponent]
})

export class AppModule { }
