import { BaseService } from '../BaseService';
import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { Endpoint } from '../endpoints';


const CACHEKEY = 'projectList';

@Injectable()
export class BuildConfigService extends BaseService {

    constructor(
        public http: Http,
        public cache: CacheService,
        public _endpoint: Endpoint,
        public storage: Storage
    ) {
        super(http, storage, _endpoint, cache)
    }

    parseUrl(key, context?) {
        return this.getUrl(key, 'buildconfig', context)
    }

    listBuildConfigs(projectId) {
        const url = this.parseUrl('index', { projectId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    detailBuildConfigs(projectId, appId) {
        const url = this.parseUrl('get', { projectId, appId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    createBuildconfig(projectId, appId, config) {
        const body = this.populateBuildConfigBody(projectId, appId, config);
        const url = this.parseUrl('index', { projectId });
        return this.requestApiPost(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError)
    }

    instantiateBuild(projectId, appId, config) {
        const body = this.populateBuildConfigPatchBody(projectId, appId, config);
        const url = this.parseUrl('instantiate', { projectId, appId });
        return this.requestApiPost(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError)
    }

    populateBuildConfigPatchBody(projectId, appId, config) {
        return {}
    }

    populateBuildConfigBody(projectId, appId, config) {
        return {}
    }
}
