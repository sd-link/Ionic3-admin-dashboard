import { CacheService } from 'ionic-cache/dist';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import { Endpoint } from '../endpoints';
import { BaseService } from "../BaseService";

export interface hpaSpec {
    minReplicas: string;
    maxReplicas: string;
}

@Injectable()
export class HorizontalPodAutoscalersService extends BaseService {

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

    getProjectHpa(projectId, params) {
        const url = this.parseUrl('query', { projectId, params });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, "hpa");
    }

    createHpa(projectId, appId, requestValue: hpaSpec) {
        const body = this.populateHpaBody(appId, requestValue);
        const url = this.parseUrl('index', { projectId });
        return this.requestApiPost(url, body, 'hpa')
            .map(this.extractData)
            .catch(this.handleError)
    }

    getHpa(projectId, appId) {
        const url = this.parseUrl('get', { projectId, appId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, "hpa");
    }

    patchHpa(projectId, appId, body) {
        const url = this.parseUrl('get', { projectId, appId });
        return this.requestApiPatch(url, body, "hpa")
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteHpa(projectId, appId) {
        const url = this.parseUrl('get', { projectId, appId });
        const request = this.requestApiDelete(url, null, 'hpa')
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, "hpa");
    }

    populateHpaBody(appId, requestValue) {
        return {
            "apiVersion": "autoscaling/v1",
            "kind": "HorizontalPodAutoscaler",
            "metadata": {
                "annotations": {
                    "openshift.io/generated-by": "AusNimbus"
                },
                "labels": {
                    "app": appId
                },
                "name": appId
            },
            "spec": {
                "scaleTargetRef": {
                    "kind": "DeploymentConfig",
                    "name": appId,
                    "apiVersion": "v1",
                    "subresource": "scale"
                },
                "minReplicas": requestValue.minReplicas,
                "maxReplicas": requestValue.maxReplicas,
                "cpuUtilization": {
                    "targetPercentage": 70
                }
            }
        }
    }
}
