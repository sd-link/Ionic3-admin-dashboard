import { SessionService } from './session.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ionic-cache';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Endpoint } from './endpoints'

@Injectable()
export class HawkularService {
    AUTH: String = 'access_token';

    constructor(
        private http: Http,
        private cache: CacheService,
        private _endpoint: Endpoint,
        private storage: Storage,
        private _sessionService: SessionService
    ) { }

    private getUrl(key, context: any = ''): string {
        return this._endpoint.getUrl(key, 'hawkular', context);
    }

    authenticated() {
        return Observable.fromPromise(this.storage.get('access_token').then(token => token));
    }

    setAuth(auth) {
        this.storage.set('access_token', auth.access_token);
    }

    private getAuthToken() {
        return this._sessionService.getAuthToken();
    }

    queryMetrics(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('query');
        return this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({
                    'content-type': 'application/json',
                    'Authorization': token ,
                    'Hawkular-Tenant': projectId
                })
                const options = new RequestOptions({ headers });
                return this.http.post(url, bodyString, options)
            })
            .map(res => {
                this.cache.clearGroup('appCharts');
                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error retrieving application metrics')
            });
    }
}
