var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FormatterService } from '../../../services/formatter.service';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs/Rx';
import { ProjectService } from '../../../services/kubernetes/project.service';
import { AlertController, ModalController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import * as _ from 'lodash';
var ProjectAccess = (function () {
    function ProjectAccess(navParams, modalCtrl, _projectService, _userService, _formatter, _alertCtrl) {
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this._projectService = _projectService;
        this._userService = _userService;
        this._formatter = _formatter;
        this._alertCtrl = _alertCtrl;
        this.teams = [];
        this.dropdownOptions = [
            { value: "admin", name: "Administrator" },
            { value: "edit", name: "Member" },
            { value: "view", name: "View Only" }
        ];
        this.loadingOnChange = false;
        this.errorPage = false;
        this.show = false;
    }
    ProjectAccess.prototype.ngOnInit = function () {
        this.getTeams();
    };
    ProjectAccess.prototype.getTeams = function () {
        var _this = this;
        var namespace = this.navParams.data.projectId;
        this._projectService.getTeams(namespace)
            .flatMap(function (roles) { _this.prepareModel = roles; return roles.items; })
            .flatMap(function (roles) { return _this.mappingUsers(roles); })
            .reduce(function (current, next) { return current.concat(next); })
            .subscribe(function (res) {
            _this.teams = _.sortBy(res, ['email']);
            _this.role = new Array(res.length).fill(null);
            _this.prevRole = new Array(res.length).fill(null);
            _this.itemLoading = new Array(res.length).fill(null);
        }, function (err) {
            _this.errorPage = true;
            if (err.code === 403)
                _this.errorMessage = "You don't have enough permission to view this page";
            else
                _this.errorMessage = err.message;
        });
    };
    ProjectAccess.prototype.mappingUsers = function (roles) {
        var role = roles.metadata.name;
        var users = roles.subjects.filter(function (users) { return users.kind == 'User'; });
        return Observable.combineLatest(this.populateUserObject(users, role));
    };
    ProjectAccess.prototype.populateUserObject = function (users, role) {
        var _this = this;
        return users.map(function (user) {
            var authUser$ = _this.isAuthUser(user);
            var email$ = _this.convertHashToEmail(user.name);
            return Observable.combineLatest(authUser$, email$)
                .map(function (_a) {
                var disabled = _a[0], email = _a[1];
                var initial = _this._formatter.getInitial(email);
                return __assign({}, user, { email: email, disabled: disabled, role: role, initial: initial });
            });
        });
    };
    ProjectAccess.prototype.isAuthUser = function (user) {
        var _this = this;
        return this._userService.getUserProfile().map(function (authUser) {
            _this.authUserHash = authUser.id;
            return user.name == authUser.id;
        });
    };
    ProjectAccess.prototype.convertHashToEmail = function (name) {
        return this._userService.convertHashToEmail(name).map(function (res) { return res.email; });
    };
    ProjectAccess.prototype.onMemberSelected = function (i, selected, hash) {
        var _this = this;
        var role = selected.value;
        this.teams.forEach(function (team) {
            if (team.name === hash) {
                _this.prevRole[i] = team.role;
                team.role = role;
            }
        });
        this.role[i] = role;
        this.loadingOnChange = true;
        this.populateModelRoleChange(role, hash);
    };
    ProjectAccess.prototype.populateModelRoleChange = function (role, hash) {
        var _this = this;
        var namespace = this.navParams.data.projectId;
        this._projectService.getRole(namespace, role)
            .subscribe(function (res) { return _this.prepareForPutMethod(res, hash); }, function (err) {
            if (err.code === 404) {
                _this.prepareForPostMethod(namespace, hash, role);
            }
        });
    };
    ProjectAccess.prototype.prepareForRemove = function (hash) {
        var namespace = this.navParams.data.projectId;
        var modelForRemove = this.prepareModel.items.filter(function (res) { return res.userNames; }).filter(function (res) { return res.userNames.filter(function (res) { return res == hash; })[0]; })[0];
        return this._projectService.getRole(namespace, modelForRemove.metadata.name).map(function (model) {
            var subjects = modelForRemove.subjects.filter(function (subject) { return subject.name != hash; });
            var userNames = modelForRemove.userNames.filter(function (username) { return username != hash; });
            return __assign({}, model, { subjects: subjects, userNames: userNames });
        });
    };
    ProjectAccess.prototype.prepareForPostMethod = function (namespace, hash, role) {
        var _this = this;
        this.prepareForRemove(hash).subscribe(function (res) {
            _this.modelForRemove = res;
            _this.apiMethod = 'POST';
            _this.model = {
                kind: "RoleBinding",
                apiVersion: "v1",
                metadata: {
                    name: role,
                    namespace: namespace,
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
            };
            _this.loadingOnChange = false;
        });
    };
    ProjectAccess.prototype.prepareForPutMethod = function (res, hash) {
        var _this = this;
        this.prepareForRemove(hash).subscribe(function (newModel) {
            _this.modelForRemove = newModel;
            var userNames = res.userNames ? res.userNames.concat(hash) : [hash];
            var subjects = res.subjects.concat({
                kind: 'User',
                name: hash
            });
            _this.apiMethod = 'PUT';
            _this.model = __assign({}, res, { userNames: userNames, subjects: subjects });
            _this.loadingOnChange = false;
        });
    };
    ProjectAccess.prototype.putRole = function (namespace, role, model) {
        return this._projectService.putRole(namespace, role, model);
    };
    ProjectAccess.prototype.postRole = function (namespace, model) {
        return this._projectService.postRole(namespace, model);
    };
    ProjectAccess.prototype.onSave = function (i) {
        if (!this.loadingOnChange) {
            this.doSave(i);
        }
    };
    ProjectAccess.prototype.onCancel = function (i, hash) {
        var _this = this;
        this.teams.forEach(function (team) {
            if (team.name === hash) {
                team.role = _this.prevRole[i];
            }
        });
        this.prevRole[i] = null;
        this.role[i] = null;
    };
    ProjectAccess.prototype.doSave = function (i) {
        var _this = this;
        var namespace = this.navParams.data.projectId;
        this.itemLoading[i] = true;
        this.putRole(namespace, this.modelForRemove.metadata.name, this.modelForRemove)
            .flatMap(function (successRemove) { return _this.addNewUserToRole(namespace, i); })
            .subscribe(function () { return _this.successPutUser(i); }, function (err) { return _this.failedPutUser(i, err); });
    };
    ProjectAccess.prototype.addNewUserToRole = function (namespace, i) {
        if (this.apiMethod == 'POST') {
            return this._projectService.postRole(namespace, this.model);
        }
        else if (this.apiMethod == 'PUT') {
            return this.putRole(namespace, this.role[i], this.model);
        }
        else {
            return Observable.from([[]]);
        }
    };
    ProjectAccess.prototype.successPutUser = function (i) {
        this.role = new Array(this.role.length).fill(null); // how if deleted user? The length should be changed.
        this.prevRole = new Array(this.role.length).fill(null);
        this.itemLoading = new Array(this.role.length).fill(null);
    };
    ProjectAccess.prototype.failedPutUser = function (i, err) {
        this.itemLoading[i] = null;
        var loadingError = this._alertCtrl.create({
            title: 'Failed!',
            message: err.message,
            buttons: ['Dismiss']
        });
        loadingError.present();
    };
    ProjectAccess.prototype.removeUserConfirmation = function (i, m) {
        var _this = this;
        this.itemLoading[i] = true;
        if (!m.disabled) {
            this.prepareForRemove(m.name).subscribe(function (res) {
                _this.modelForRemove = res;
                var alert = _this._alertCtrl.create({
                    title: 'Confirm delete',
                    message: 'Do you want to delete ' + m.email + ' from the team ?',
                    buttons: [
                        {
                            text: 'No',
                            role: 'cancel',
                            handler: function () {
                                _this.itemLoading[i] = null;
                            }
                        },
                        {
                            text: 'Yes',
                            handler: function () { _this.removeConfirmed(m); }
                        }
                    ]
                });
                alert.present();
                _this.loadingOnChange = false;
            });
        }
        else {
            this.itemLoading[i] = false;
            var removeSelfAlert = this._alertCtrl.create({
                title: 'Can not delete!',
                message: "You can not delete yourself from project.",
                buttons: ['Dismiss']
            });
            removeSelfAlert.present();
        }
    };
    ProjectAccess.prototype.removeConfirmed = function (user) {
        var _this = this;
        var namespace = this.navParams.data.projectId;
        this.putRole(namespace, this.modelForRemove.metadata.name, this.modelForRemove)
            .subscribe(function (res) {
            _this.getTeams();
        });
    };
    ProjectAccess.prototype.showModal = function () {
        this.show = true;
    };
    ProjectAccess.prototype.addMember = function (data) {
        this.show = false;
        if (typeof data["add"] !== 'undefined') {
            if (data.add === true) {
                var namespace = this.navParams.data.projectId;
                var hash_1 = data.hash;
                var role = data.role;
                var userExists = this.teams.some(function (team) {
                    return team.name === hash_1;
                });
                if (userExists) {
                    var userExistsAlert = this._alertCtrl.create({
                        title: 'Add member!',
                        message: 'User ' + data.email + ' already a member of the project.',
                        buttons: ['Ok']
                    });
                    userExistsAlert.present();
                }
                else {
                    this.teams = [];
                    this.addNewMember(namespace, role, hash_1);
                }
            }
        }
        else if (typeof data["error"] !== 'undefined') {
            this._alertCtrl.create({
                title: 'Error',
                message: data.error,
                buttons: ['Ok']
            }).present();
        }
    };
    ProjectAccess.prototype.addNewMember = function (namespace, role, hash) {
        var _this = this;
        return this._projectService.getRole(namespace, role).subscribe(function (res) {
            var userNames = res.userNames ? res.userNames.concat(hash) : [hash];
            var subjects = res.subjects.concat({
                kind: 'User',
                name: hash
            });
            _this.apiMethod = 'PUT';
            _this.model = __assign({}, res, { userNames: userNames, subjects: subjects });
            _this.putRole(namespace, role, _this.model).subscribe(function (r) { return _this.getTeams(); }, function (err) { return _this.failedAddMember(err); });
        }, function (err) {
            if (err.code === 404) {
                _this.apiMethod = 'POST';
                var model = _this.prepareNewMemberModelRole(role, hash);
                _this.postRole(namespace, model)
                    .subscribe(function (r) { return _this.getTeams(); }, function (err) { return _this.failedAddMember(err); });
            }
        });
    };
    ProjectAccess.prototype.prepareNewMemberModelRole = function (role, hash) {
        var namespace = this.navParams.data.projectId;
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
        };
    };
    ProjectAccess.prototype.failedAddMember = function (err) {
        var loadingError = this._alertCtrl.create({
            title: 'Failed!',
            message: err.message,
            buttons: ['Dismiss']
        });
        loadingError.present();
    };
    return ProjectAccess;
}());
ProjectAccess = __decorate([
    Component({
        selector: 'project-access',
        templateUrl: 'access.html',
    }),
    __metadata("design:paramtypes", [NavParams,
        ModalController,
        ProjectService,
        UserService,
        FormatterService,
        AlertController])
], ProjectAccess);
export { ProjectAccess };
//# sourceMappingURL=access.js.map