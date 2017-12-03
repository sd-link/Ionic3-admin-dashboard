import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { Endpoint } from '../endpoints';

import { SessionService } from '../session.service'
import { BaseService } from '../BaseService';

@Injectable()
export class BuildService extends BaseService {

    constructor(
        public http: Http,
        public cache: CacheService,
        public _endpoint: Endpoint,
        public storage: Storage
    ) {
        super(http, storage, _endpoint, cache)
    }
    
    parseUrl(key, context?) {
        return this.getUrl(key, 'hpa', context)
    }
    
    listBuilds(projectId, queryString = null) {
        const url = this.parseUrl('index', { projectId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, "projectList");
    }
    
    getBuildLogs(projectId, appId) {
        const url = this.parseUrl('index', { projectId, appId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    queryBuildLogs(projectId, params) {
        const url = this.parseUrl('query', { projectId, params });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, "projectList");
    }
}
