import { BaseService } from '../BaseService';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { HttpSerializer } from '../http-serializer.service'
import { Endpoint } from '../endpoints'

import { Project } from '../../models/Project'

const CACHEKEY = "projectList";

@Injectable()
export class ProjectService extends BaseService {

    AUTH: String = 'access_token';

    constructor(
        http: Http,
        cache: CacheService,
        storage: Storage,
        _endpoint: Endpoint,
        private _httpSerializer: HttpSerializer,

    ) {
        super(http, storage, _endpoint, cache)
    }

    parseUrl(key, context: any = '') {
        return this.getUrl(key, 'project', context)
    }

    listProjects(queryString = null) {
        const url = _.filter([this.parseUrl('index'), queryString]).join('');
        const request =  this.requestApiGet(url)
            .map(res => this.populateListProjects(this.extractData(res)))
            .catch(this.handleError)
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    populateListProjects(res) {
        const items = res.items.map(item => {
            return { ...item, metadata: { ...item.metadata, status: item.status } }
        })
        return this._httpSerializer.serializeCollection(Project, { ...res, items })
    }

    getProject(projectId) {
        const url = this.parseUrl('get', { projectId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError)
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    createProject(body) {
        const url = this.parseUrl('request');
        return this.requestApiPost(url, body, 'projectList')
            .map(this.extractData)
            .catch(this.handleError)
    }

    patchProject(projectId, config?) {
        const body = this.populatePatchBody(projectId, config)
        const url = this.parseUrl('get', { projectId });
        return this.requestApiPatch(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteProject(projectId) {
        const url = this.parseUrl('get', { projectId });
        return this.requestApiDelete(url, null, 'projectList')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUsage(namespace) {
        const url = this.parseUrl('usage', { namespace });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError)
        return this.cache.loadFromObservable(url, request, "userUsage");
    }

    getTeams(namespace) {
        const url = this.parseUrl('teams', { namespace });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError)
        return this.cache.loadFromObservable(url, request, "userTeams");
    }

    getRole(namespace, role) {
        const url = this.parseUrl('role', { namespace, role });
        return this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError)
    }

    putRole(namespace, role, body) {
        const url = this.parseUrl('role', { namespace, role });
        return this.requestApiPut(url, body, "userTeams")
            .map(this.extractData)
            .catch(this.handleError)
    }

    postRole(namespace, body) {
        const url = this.parseUrl('teams', { namespace });
        return this.requestApiPost(url, body, "userTeams")
            .map(this.extractData)
            .catch(this.handleError)
    }

    populatePatchBody(projectId, config?) {
        return {
            kind: "Project",
            apiVersion: "v1",
            metadata: {
                annotations: {
                    "openshift.io/display-name": config.displayName
                }
            }
        }
    }
}
