import { BaseService } from '../BaseService';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Endpoint } from '../endpoints'

@Injectable()
export class ResourcesService extends BaseService {

    constructor(
        http: Http,
        cache: CacheService,
        storage: Storage,
        _endpoint: Endpoint

    ) {
        super(http, storage, _endpoint, cache)
    }

    parseUrl(key, context: any = '') {
        return this.getUrl(key, 'resourceQuotas', context)
    }

    getResources(projectId) {
        const url = this.parseUrl("index",{projectId});
        return this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
    }


    updateCompute(projectId,body) {
        const url = this.parseUrl('update', { projectId });
        return this.requestApiPatch(url, body, "")
            .map(this.extractData)
            .catch(this.handleError);
    }
    
  
}
