import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class SessionService {

    constructor(
        private storage: Storage
    ) { }

    authenticated(){
        return Observable.fromPromise(this.storage.get('access_token').then(token => token));
    }

    getAuthToken() {
        return Observable.fromPromise(this.storage.get('access_token').then(token => {
            return 'Bearer ' + token;
        }));
    }
}