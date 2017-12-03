import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';

import { Endpoint } from './endpoints';

import { SessionService } from './session.service'

@Injectable()
export class NamespaceService {

    constructor(
        private http: Http,
        private cache: CacheService,
        private _endpoint: Endpoint,
        private _sessionService: SessionService
    ) { }

    private getUrl(key, context: any = '', namespace = 'namespace'): string {
        return this._endpoint.getUrl(key, namespace, context);
    }

    private getAuthToken() {
        return this._sessionService.getAuthToken();
    }

    getNamespaceService(projectId) {
        const url = this.getUrl('namespaceServices', { projectId });
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    getNamespaceResourceQuotas(projectId) {
        const url = this.getUrl('index', { projectId }, 'resourceQuotas');
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    getNamespaceImage(projectId, vendorId) {
        const url = this.getUrl('namespaceImageStream', { projectId, vendorId });
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    getNamespaceSecrets(projectId) {
        const url = this.getUrl('namespaceSecrets', { projectId });
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    createSecret(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('namespaceSecrets', { projectId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    createConfigMaps(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('namespaceConfigMaps', { projectId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    createImageStream(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('namespaceImageStreams', { projectId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    createBuildConfigs(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('namespaceBuildConfigs', { projectId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    createRoutes(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('namespaceRoutes', { projectId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    createDeploymentConfig(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('deploymentconfigs', { projectId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    getDeploymentConfig(projectId, appId) {
        const url = this.getUrl('namespaceDeploymentConfigsDetail', { projectId, appId });
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    runInstantiate(body, projectId, appId) {
        const bodyString = JSON.stringify(body);
        const url = this.getUrl('namespaceInstantiate', { projectId, appId });
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
                return Observable.throw(error.json() || 'Server error')
            });
    }

    getBuildLog(projectId, vendorId, appId) {
        const url = this.getUrl('namespaceLogs', { projectId, appId });
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

    getReplication(projectId, params) {
        const url = this.getUrl('replicationControllers', { projectId, params });
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Server error');
            });
        return this.cache.loadFromObservable(url, request, "projectList");
    }

}
