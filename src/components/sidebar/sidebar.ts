import { Observable } from 'rxjs/Rx';
import { ProjectService } from '../../services/kubernetes/project.service';
import { UserService } from '../../services/user.service';
import { FormatterService } from '../../services/formatter.service';

import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'aus-sidebar',
  templateUrl: 'sidebar.html',
  providers: [FormatterService, ProjectService]
})
export class SidebarComponent implements OnInit {
  openNavBar: boolean = false;
  openNavUser: boolean = false;
  user: any;
  projects: any = [];
  open = [];

  constructor(
    private _userService: UserService,
    private _projectService: ProjectService,
    private _formatterService: FormatterService,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    const user$ = this.loadUserProfile();
    const projects$ = this.loadProjectList();

    Observable.combineLatest(user$, projects$).subscribe(([user, projects]) => {
      this.user = user;
      this.projects = projects.items;
      this.open = new Array(this.projects.length);
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
    this.navCtrl.push('LoginPage', {}, { animate: false });
  }

  navigate(target) {
    this.navCtrl.push(target)
  }
}
