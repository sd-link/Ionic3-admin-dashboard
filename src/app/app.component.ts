import { ProjectListPage } from './../pages/project-list/project-list';
import { MenuController } from 'ionic-angular/es2015';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CacheService } from "ionic-cache";
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/kubernetes/project.service';
import { FormatterService } from '../services/formatter.service';

import { LoginPage } from '../pages/login/login';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { UserChangePasswordPage } from '../pages/user-change-password/user-change-password';
import { UserSubscriptionPage } from '../pages/user-subscription/user-subscription';
import { UserInvoicesPage } from '../pages/user-invoices/user-invoices';
import { RegistrationActivationPage } from '../pages/registration-activation/registration-activation';

@Component({
  styleUrls: ['/assets/css/main.css'],
  templateUrl: 'app.html',
  providers: [MenuController, Deeplinks, ProjectService, SessionService, Nav, FormatterService]
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = null;

  openNavBar: boolean = false;
  openNavUser: boolean = false;
  pages: Array<{ ico: string, title: string, component: any }>;
  user: any = {};
  projects: any;
  authenticated: boolean;
  open = [];

  constructor(
    public cache: CacheService,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menu: MenuController,
    public toastCtrl: ToastController,
    private _deeplinks: Deeplinks,
    private _sessionService: SessionService,
    private _userService: UserService,
    private _projectService: ProjectService,
    private _formatterService: FormatterService
  ) {
    // cache.setDefaultTTL(60 * 60);
    var lastTimeBackPress = 0
    var timePeriodToExit = 2000

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);

      this.platform.registerBackButtonAction(() => {
        // ERROR: not working because you are not using <ion-split-pane><ion-menu></ion-menu></ion-split-pane>
        if (this.menu.isOpen()) {
          this.menu.close()
        }
        let view = this.nav.getActive()
        if (view.component != this.rootPage) {
          //Double check to exit app
          if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
            this.platform.exitApp(); //Exit from app
          } else {
            let toast = this.toastCtrl.create({
              message: 'Press back again to exit App?',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            lastTimeBackPress = new Date().getTime();
          }
        }
        else {
          this.nav.popToRoot();
        }
      }, 1);
    });

    // PENDING: I think it's not in our priority. Fix all crucial UI bugs first
    // Also it doesn't solve backbutton problem
    this._deeplinks.routeWithNavController(this.nav, {
      '/user/profile': EditProfilePage,
      '/user/invoices': UserInvoicesPage,
      '/user/subscription': UserSubscriptionPage
    })

    this.pages = [
      { ico: 'fa-cog', title: 'Edit profile', component: EditProfilePage },
      { ico: 'fa-file-alt', title: 'Invoices', component: UserInvoicesPage },
      { ico: 'fa-rss', title: 'Subscription', component: UserSubscriptionPage },
      { ico: 'fa-lock', title: 'Change password', component: UserChangePasswordPage }
    ]

    if (this.hasTokenQueryParam()) {
      setTimeout(() => {
        this.navigate(RegistrationActivationPage);
      });
    } else {
      this.rootPage = ProjectListPage;
      this._sessionService.authenticated().subscribe((e) => {
        if (!e)
          this.navigate(LoginPage);
      }, err => { });
    }
  }

  private hasTokenQueryParam(): boolean {
    return this.platform.getQueryParam('token');
  }

  ngOnInit() {
    if (!this.hasTokenQueryParam()) {
      Observable.merge(this.nav.viewDidEnter).flatMap(e => {
        return this._sessionService.authenticated();
      }).subscribe((e) => {
        if (e) {
          this.loadData()
        } else {
          this.authenticated = false;
        }

      }, err => { });
    }
  }

  loadData() {
    this.user = {};
    const user$ = this.loadUserProfile();
    const projects$ = this.loadProjectList();
    Observable.combineLatest(user$, projects$).subscribe(([user, projects]) => {
      this.user = user;
      this.projects = projects.items.filter(item => item.status.phase != 'Terminating');
      this.open = new Array(this.projects.length);
      this.authenticated = true;
    }, () => {
      this.authenticated = false;
      const activePage = this.nav.getActive().id;
      if (activePage != 'LoginPage')
        this.nav.push('LoginPage')
    });
  }

  loadUserProfile() {
    return this._userService.getUserProfile().map(res => {
      return {
        email: res.email,
        initial: this._formatterService.getInitial(res.name)
      }
    });
  }

  loadProjectList() {
    return this._projectService.listProjects()
  }

  onLogout() {
    this._userService.logout();
    this.navigate(LoginPage);
  }

  navigate(component) {
    this.openNavUser = false;
    this.nav.push(component);
  }

  navigateHome() {
    this.navigate(this.rootPage);
  }

  goToDetail(projectId) {
    this.nav.push('ProjectOverviewPage', { projectId, component: 'apps' })
  }

  isOpen(name) {
    const activeParam = this.nav.getActive().instance.navParams.data;
    return (name == activeParam)
  }
}
