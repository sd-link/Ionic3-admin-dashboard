import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { Endpoint } from '../endpoints';

import { SessionService } from '../session.service'

@Injectable()
export class ImageStreamImagesService{

    constructor(
        private http: Http,
        private _endpoint: Endpoint,
        private _sessionService: SessionService
    ) { }

    private getUrl(key, context: any = ''): string {
        return this._endpoint.getUrl(key, 'imagestreamimages', context);
    }

    private getAuthToken() {
        return this._sessionService.getAuthToken();
    }

    getImageStreamImage(projectId, name = null) {
        const url = _.filter([this.getUrl('get', { projectId, name })]).join('');
        return this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error retrieving list of imagestreams');
            });
    }

}
