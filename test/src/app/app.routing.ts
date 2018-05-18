import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard,CustomerAuthGuard} from './guards/index';


/*Admin*/

import { AdminCommonComponent } from './admin/common/common.component';
import { AdminLoginComponent,AdminRegistrationComponent, AdminResetPasswordComponent} from './admin/admin-login/admin-login.component';
import { ProfileComponent,AdminChangePasswordComponent } from './admin/profile/profile.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent, UsersupdateComponent, UsersaddComponent} from './admin/users/users.component';
import { CustomerComponent,CustomerlistComponent,CustomeraddComponent,CustomerupdateComponent, AdminShowBlockedUserComponent,AdminViewAbuseReportComponent } from './admin/customer/customer.component';
import { PackageComponent,PackagelistComponent,PackageaddComponent,PackageupdateComponent } from './admin/package/package.component';
import { BannerComponent,BannerlistComponent,BanneraddComponent,BannerupdateComponent} from './admin/banner/banner.component';
import { BannerTimeComponent,BannerlistTimeComponent,BanneraddTimeComponent,BanneraddTimeImageComponent} from './admin/bannersetting/banner.component';
import { PageComponent,PagelistComponent,PageaddComponent,PageupdateComponent } from './admin/page/page.component';
import { CountryComponent,CountrylistComponent,CountryaddComponent} from './admin/country/country.component';



/* Customer Component*/
import { LoginComponent} from './frontend/login/login.component';
import { FrontendCommonComponent } from './frontend/common/common.component';
import { ActivateAccountComponent } from './frontend/activateaccount/activateaccount.component';
import { CustomerCommonComponent } from './frontend/customer/customer.component';
import { CustomerProfileComponent } from './frontend/customer/profile/profile.component';
import { CustomerProfilesListComponent } from './frontend/customer/profiles-list/profile-list.component';
import { PublicProfileComponent } from './frontend/customer/public-profile/public-profile.component';
import { VideoCallComponent } from './frontend/customer/video-call/video-call.component';
import { SpeedDatingComponent } from './frontend/customer/speed-dating/speed-dating.component';
import { ContactUsComponent } from './frontend/customer/contact-us/contact-us.component';
import { FrontendPageComponent } from './frontend/customer/page/page.component';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component';


import { AppComponent } from './app.component';





const appRoutes: Routes =   [{ path: '', component: LoginComponent }, 

                            { path: 'admin', component: AdminCommonComponent, children : [ 
							{ path: '', component: AdminLoginComponent},
							{ path: 'register', component: AdminRegistrationComponent},
							{ path: 'resetpassword/:id', component: AdminResetPasswordComponent},
							{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
    						{ path: 'changepassword/:id', component: AdminChangePasswordComponent, canActivate: [] },
							{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},


							{ path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
							{ path: 'users/:id', component: UsersupdateComponent, canActivate: [AuthGuard]  },
							{ path: 'user/add', component: UsersaddComponent, canActivate: [AuthGuard]  },

							{ path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], children :[                             
							{ path: 'list', component: CustomerlistComponent, canActivate: [AuthGuard]  },
							{ path: 'add', component: CustomeraddComponent, canActivate: [AuthGuard]  },
							{ path: 'edit/:id', component: CustomerupdateComponent, canActivate: [AuthGuard]  },
							{ path: 'blockeduser/:id', component: AdminShowBlockedUserComponent, canActivate: [] },
							{ path: 'viewabusereport/:id', component: AdminViewAbuseReportComponent, canActivate: [] },
							]},

							{ path: 'package', component: PackageComponent, canActivate: [AuthGuard],children :[
							{ path: 'list', component: PackagelistComponent, canActivate: [AuthGuard]  },
							{ path: 'add', component: PackageaddComponent, canActivate: [AuthGuard]  },
							{ path: 'edit/:id', component: PackageupdateComponent, canActivate: [AuthGuard]  },
							]},	

							{ path: 'banner', component: BannerComponent, canActivate: [AuthGuard],children :[
							{ path: 'list', component: BannerlistComponent, canActivate: [AuthGuard]  },
							{ path: 'add', component: BanneraddComponent, canActivate: [AuthGuard]  },        
							{ path: 'edit/:id', component: BannerupdateComponent, canActivate: [AuthGuard]  },
							]},

							{ path: 'bannersetting', component: BannerTimeComponent, canActivate: [AuthGuard],children :[
							{ path: 'list', component: BannerlistTimeComponent, canActivate: [AuthGuard]  },
							{ path: 'add', component: BanneraddTimeComponent, canActivate: [AuthGuard]  },        
							{ path: 'addimage', component: BanneraddTimeImageComponent, canActivate: [AuthGuard]}
							]},

							{ path: 'page', component: PageComponent, canActivate: [AuthGuard],children :[
							{ path: 'list', component: PagelistComponent, canActivate: [AuthGuard]  },
							{ path: 'add', component: PageaddComponent, canActivate: [AuthGuard]  },
							{ path: 'edit/:id', component: PageupdateComponent, canActivate: [AuthGuard]  },
							]},

							{ path: 'country', component: CountryComponent, canActivate: [AuthGuard],children :[
							{ path: 'list', component: CountrylistComponent, canActivate: [AuthGuard]  },
							{ path: 'add', component: CountryaddComponent, canActivate: [AuthGuard]  }
							]},]},

							{ path: 'frontend', component: FrontendCommonComponent, children : [
 							{ path: '', component: LoginComponent},
 							{ path: 'activate-account/:activationid', component: ActivateAccountComponent},
							]}, 

                            { path: 'customer', component: CustomerCommonComponent, children : [
                            { path: '', component: LoginComponent},
                            { path: 'profile', component: CustomerProfileComponent, canActivate: [CustomerAuthGuard]},
                            { path: 'public-profile/:vid', component: PublicProfileComponent, canActivate: [CustomerAuthGuard]},
						    { path: 'profiles-list', component: CustomerProfilesListComponent, canActivate: [CustomerAuthGuard]},
                            { path: 'video-call/:sessionid/:tokenid/:connectedTo', component: VideoCallComponent, canActivate: [CustomerAuthGuard] },
		                    { path: 'speeddating', component: SpeedDatingComponent,canActivate: [CustomerAuthGuard] },
		                    { path: 'contactus', component: ContactUsComponent },
		                    { path: 'page/:page', component: FrontendPageComponent },
		                    { path: 'reset-password/:id', component: ResetPasswordComponent}
							]},

							{ path: '**', redirectTo: '' }];


export const routing = RouterModule.forRoot(appRoutes);