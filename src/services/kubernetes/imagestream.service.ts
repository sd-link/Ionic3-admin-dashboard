import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { Endpoint } from '../endpoints';

import { SessionService } from '../session.service'

@Injectable()
export class ImageStreamService {

    constructor(
        private http: Http,
        private cache: CacheService,
        private _endpoint: Endpoint,
        private _sessionService: SessionService
    ) { }

    private getUrl(key, context: any = ''): string {
        return this._endpoint.getUrl(key, 'imagestream', context);
    }

    private getAuthToken() {
        return this._sessionService.getAuthToken();
    }

    listImageStreams(projectId, queryString = null) {
        const url = _.filter([this.getUrl('index', { projectId }), queryString]).join('');
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error retrieving list of imagestreams');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    createImageStream(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('index', { projectId });
        return this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'content-type': 'application/json', 'Authorization': token })
                const options = new RequestOptions({ headers });
                return this.http.post(url, bodyString, options)
            })
            .map(res => {
                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error creating imagestream')
            });
    }

}
