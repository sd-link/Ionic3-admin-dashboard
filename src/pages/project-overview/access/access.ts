import { FormatterService } from '../../../services/formatter.service';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs/Rx';
import { ProjectService } from '../../../services/kubernetes/project.service';
import { AlertController, ModalController, NavParams } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { TeamModel, Teams, TeamSubject } from '../../../models/Teams';
import { DropdownOptions } from '../../../models/DropdownOptions'
import * as _ from 'lodash';

@Component({
    selector: 'project-access',
    templateUrl: 'access.html',

})

export class ProjectAccess implements OnInit {
    teams: Teams[] = [];
    dropdownOptions: DropdownOptions[] = [
        { value: "admin", name: "Administrator" },
        { value: "edit", name: "Member" },
        { value: "view", name: "View Only" }
    ]
    loadingOnChange: boolean = false;
    apiMethod: 'POST' | 'PUT';
    role: any[];
    prevRole: any[];
    authUserHash: string;
    model: TeamModel
    prepareModel: any;
    modelForRemove: TeamModel;
    itemLoading: any[];
    errorPage: boolean = false;
    errorMessage: string;
    show: boolean = false;

    constructor(
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private _projectService: ProjectService,
        private _userService: UserService,
        private _formatter: FormatterService,
        private _alertCtrl: AlertController
    ) {
    }

    ngOnInit() {
        this.getTeams()
    }

    getTeams() {
        const namespace = this.navParams.data.projectId;
        this._projectService.getTeams(namespace)
            .flatMap(roles => { this.prepareModel = roles; return roles.items })
            .flatMap(roles => this.mappingUsers(roles))
            .reduce((current, next) => current.concat(next))
            .subscribe(
                (res: Teams[]) => {
                    this.teams = _.sortBy(res,['email']);
                    this.role = new Array(res.length).fill(null);
                    this.prevRole = new Array(res.length).fill(null);
                    this.itemLoading = new Array(res.length).fill(null);
                },
                (err) => {
                    this.errorPage = true;
                    if(err.code === 403)
                        this.errorMessage = "You don't have enough permission to view this page"
                    else
                        this.errorMessage = err.message;
                }
            )
    }

    mappingUsers(roles) {
        const role = roles.metadata.name
        const users = roles.subjects.filter(users => users.kind == 'User')
        return Observable.combineLatest(this.populateUserObject(users, role))
    }

    populateUserObject(users, role) {
        return users.map(user => {
            const authUser$ = this.isAuthUser(user);
            const email$ = this.convertHashToEmail(user.name)
            return Observable.combineLatest(authUser$, email$)
                .map(([disabled, email]) => {
                    const initial = this._formatter.getInitial(email);
                    return { ...user, email, disabled, role, initial }
                })
        })
    }

    isAuthUser(user) {
        return this._userService.getUserProfile().map(authUser => {
            this.authUserHash = authUser.id;
            return user.name == authUser.id;
        })
    }

    convertHashToEmail(name) {
        return this._userService.convertHashToEmail(name).map(res => res.email)
    }

    onMemberSelected(i, selected, hash) {
        const role = selected.value;
        if(this.prevRole[i] === null) {
            this.teams.forEach(team=>{
                if(team.name === hash){
                    this.prevRole[i] = team.role;
                    team.role=role;
                }
            })
        }
        this.role[i] = role;
        this.loadingOnChange = true;
        this.populateModelRoleChange(role, hash)
    }

    populateModelRoleChange(role, hash) {
        const namespace = this.navParams.data.projectId;
        this._projectService.getRole(namespace, role)
            .subscribe(
            res => this.prepareForPutMethod(res, hash),
            err => {
                if (err.code === 404) {
                    this.prepareForPostMethod(namespace, hash, role)
                }
            })
    }

    prepareForRemove(hash) {
        const namespace = this.navParams.data.projectId;
        const modelForRemove = this.prepareModel.items.filter(res => res.userNames).filter(res => res.userNames.filter(res => res == hash)[0])[0]
        return this._projectService.getRole(namespace, modelForRemove.metadata.name).map(model => {
            const subjects = modelForRemove.subjects.filter(subject => subject.name != hash);
            const userNames = modelForRemove.userNames.filter(username => username != hash);
            return { ...model, subjects, userNames }
        })
    }

    prepareForPostMethod(namespace, hash, role) {
        this.prepareForRemove(hash).subscribe((res: TeamModel) => {
            this.modelForRemove = res;
            this.apiMethod = 'POST'
            this.model = {
                kind: "RoleBinding",
                apiVersion: "v1",
                metadata: {
                    name: role,
                    namespace,
                    creationTimestamp: null
                },
                userNames: [hash],
                "groupNames": null,
                "subjects": [{
                    "kind": "User",
                    "name": hash
                }],
                "roleRef": {
                    "name": role
                }
            }
            this.loadingOnChange = false;
        });
    }

    prepareForPutMethod(res, hash) {
       this.prepareForRemove(hash).subscribe((newModel: TeamModel) => {
            this.modelForRemove = newModel;
            const userNames = res.userNames ? res.userNames.concat(hash) : [hash]
            const subjects: TeamSubject = res.subjects.concat({
                kind: 'User',
                name: hash
            })

            this.apiMethod = 'PUT';
            this.model = { ...res, userNames, subjects }

            this.prepareModel.items.forEach(item=>{
                if(item.roleRef.name === newModel.roleRef.name){
                    item.subjects = newModel.subjects;
                    item.userNames = newModel.userNames;
                }
                if(item.roleRef.name === this.model.roleRef.name){
                    item.subjects = this.model.subjects;
                    item.userNames = this.model.userNames;
                }
            });


            this.loadingOnChange = false;
       });


    }

    putRole(namespace, role, model) {
        return this._projectService.putRole(namespace, role, model)
    }

    postRole(namespace, model) {
        return this._projectService.postRole(namespace, model)
    }

    onSave(i) {
        if (!this.loadingOnChange) {
            this.doSave(i)
        }
    }
    onCancel(i,hash) {
        this.teams.forEach(team=>{
            if(team.name === hash){
                team.role = this.prevRole[i];
            }
        });
        this.prevRole[i]=null;
        this.role[i]=null;
    }

    doSave(i) {
        const namespace = this.navParams.data.projectId;
        this.itemLoading[i] = true;
        this.putRole(namespace, this.modelForRemove.metadata.name, this.modelForRemove)
            .flatMap(successRemove => this.addNewUserToRole(namespace, i))
            .subscribe(() => this.successPutUser(i), err => this.failedPutUser(i,err))
    }



    addNewUserToRole(namespace, i) {
        if (this.apiMethod == 'POST') {
            return this._projectService.postRole(namespace, this.model);
        } else if (this.apiMethod == 'PUT') {
            return this.putRole(namespace, this.role[i], this.model)
        } else {
            return Observable.from([[]])
        }
    }

    successPutUser(i) {
        this.role = new Array(this.role.length).fill(null); // how if deleted user? The length should be changed.
        this.prevRole = new Array(this.role.length).fill(null);
        this.itemLoading = new Array(this.role.length).fill(null);

    }

    failedPutUser(i,err) {
        this.itemLoading[i] = null;
        const loadingError = this._alertCtrl.create({
            title: 'Failed!',
            message: err.message,
            buttons: ['Dismiss']
        });
        loadingError.present()
    }

    removeUserConfirmation(i,m) {
        this.itemLoading[i] = true;
        if(!m.disabled){
            this.prepareForRemove(m.name).subscribe((res: TeamModel) => {
                this.modelForRemove = res;
                const alert = this._alertCtrl.create({
                    title: 'Confirm delete',
                    message: 'Do you want to delete ' + m.email + ' from the team ?',
                    buttons: [
                        {
                            text: 'No',
                            role: 'cancel',
                            handler: () => {
                                this.itemLoading[i] = null;
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => { this.removeConfirmed(m) }
                        }
                    ]
                });
                alert.present();
                this.loadingOnChange = false;
            })
        }else{
            this.itemLoading[i] = false;
            const removeSelfAlert = this._alertCtrl.create({
                title: 'Can not delete!',
                message: "You can not delete yourself from project.",
                buttons: ['Dismiss']
            });
            removeSelfAlert.present()
        }

    }

    removeConfirmed(user) {
        const namespace = this.navParams.data.projectId;
        this.putRole(namespace, this.modelForRemove.metadata.name, this.modelForRemove)
            .subscribe(res => {
                this.getTeams();
            })
    }

    showModal(){
        this.show = true;
    }

    addMember(data) {
        this.show=false;
        if (typeof data["add"] !== 'undefined') {
            if(data.add === true) {
                const namespace = this.navParams.data.projectId;
                const hash = data.hash;
                const role = data.role;
                var userExists = this.teams.some(function (team) {
                    return team.name === hash;
                });
                if (userExists) {
                    const userExistsAlert = this._alertCtrl.create({
                        title: 'Add member!',
                        message: 'User ' + data.email + ' already a member of the project.',
                        buttons: ['Ok']
                    });
                    userExistsAlert.present();
                }else{
                    this.teams=[];
                    this.addNewMember(namespace,role,hash);
                }
            }
        }else if(typeof data["error"] !== 'undefined'){
            this._alertCtrl.create({
                title: 'Error',
                message: data.error,
                buttons: ['Ok']
            }).present();
        }
    }

    addNewMember(namespace,role,hash){
        return this._projectService.getRole(namespace, role).subscribe(
            res => {
                const userNames = res.userNames ? res.userNames.concat(hash) : [hash]
                const subjects: TeamSubject = res.subjects.concat({
                    kind: 'User',
                    name: hash
                })

                this.apiMethod = 'PUT';
                this.model = { ...res, userNames, subjects }
                this.putRole(namespace, role, this.model).subscribe((r) => this.getTeams(), err => this.failedAddMember(err))
            },
            err => {
                if (err.code === 404) {
                    this.apiMethod='POST';
                    const model = this.prepareNewMemberModelRole(role,hash);
                    this.postRole(namespace, model)
                    .subscribe((r) => this.getTeams(), err => this.failedAddMember(err))
            }
        })
    }

    prepareNewMemberModelRole(role,hash){
        const namespace = this.navParams.data.projectId;
        return {
            kind: "RoleBinding",
            apiVersion: "v1",
            metadata: {
                name: role,
                namespace: namespace,
                creationTimestamp: null
            },
            subjects: [{
                kind: "User",
                name: hash
            }],
            roleRef: {
                name: role
            }
        }
    }

    failedAddMember(err) {
        const loadingError = this._alertCtrl.create({
            title: 'Failed!',
            message: err.message,
            buttons: ['Dismiss']
        });
        loadingError.present()
    }

}
