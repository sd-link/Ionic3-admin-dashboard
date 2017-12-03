import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';

import { Endpoint } from '../endpoints';

import { SessionService } from '../session.service'

@Injectable()
export class PodsService {

    constructor(
        private http: Http,
        private cache: CacheService,
        private _endpoint: Endpoint,
        private _sessionService: SessionService
    ) { }

    private getUrl(key, context: any = ''): string {
        return this._endpoint.getUrl(key, 'pods', context);
    }

    private getAuthToken() {
        return this._sessionService.getAuthToken();
    }

    getPods(projectId, params) {
        const url = this.getUrl('index', { projectId }) + params;
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error getting deploymentconfig details');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }
}
