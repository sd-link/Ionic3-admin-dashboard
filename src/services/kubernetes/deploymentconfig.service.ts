import { BaseService } from '../BaseService';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import { Endpoint } from '../endpoints';

export interface bodyConfig{
    command: any;
    replicas: number;
}
const CACHEKEY = 'projectList';

@Injectable()
export class DeploymentConfigService extends BaseService {

    constructor(
        public http: Http,
        public cache: CacheService,
        public _endpoint: Endpoint,
        public storage: Storage
    ) {
        super(http, storage, _endpoint, cache)
    }

    parseUrl(key, context?) {
        return this.getUrl(key, 'deploymentconfig', context)
    }

    patchDeploymentConfig(projectId, appId, config?) {
        const body = this.populatePatchBody(appId, config)
        const url = this.parseUrl('get', { projectId, appId });
        return this.requestApiPatch(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createDeploymentConfig(projectId, appId, config?: bodyConfig) {
        const body = this.populateCreateBody(projectId, appId, config);
        const url = this.parseUrl('index', { projectId });
        return this.requestApiPost(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError)
    }

    deleteDeploymentConfig(projectId, appId) {
        const url = this.parseUrl('get', { projectId, appId });
        return this.requestApiDelete(url, null, CACHEKEY)
            .map(res => {
                this.cache.clearGroup(CACHEKEY);
                return this.extractData(res)
            })
            .catch(this.handleError);
    }

    getDeploymentConfig(projectId, appId) {
        const url = this.parseUrl('get', { projectId, appId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    listDeploymentConfigs(projectId, queryString = null) {
        const url = _.filter([this.parseUrl('index', { projectId }), queryString]).join('');
        const request = this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'Authorization': token });
                const options = new RequestOptions({ headers });
                return this.http.get(url, options);
            })
            .map(res => res.json())
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error retrieving list of deploymentconfigs');
            });
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    instantiateDeploymentConfig(body, projectId, appId) {
        const bodyString = JSON.stringify(body);
        const url = this.parseUrl('instantiate', { projectId, appId });
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
                return Observable.throw(error.json() || 'Error creating deploymentconfig')
            });
    }

    getDeploymentConfigWithParams(projectId, appId, params) {
        const url = this.parseUrl('query', { projectId, appId, params });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    putDeploymentConfig(body, projectId, appId) {
        const bodyString = JSON.stringify(body);
        const url = this.parseUrl('get', { projectId, appId });
        return this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({ 'content-type': 'application/json', 'Authorization': token })
                const options = new RequestOptions({ headers });
                return this.http.put(url, bodyString, options)
            })
            .map(res => {
                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error creating deploymentconfig')
            });
    }

    createDeploymentConfigRollback(body, projectId) {
        const bodyString = JSON.stringify(body);
        const url = this.parseUrl('rollback', { projectId });
        return this.getAuthToken()
            .flatMap(token => {
                const headers = new Headers({
                    'content-type': 'application/json',
                    'Authorization': token
                })
                const options = new RequestOptions({ headers });
                return this.http.post(url, bodyString, options)
            })
            .map(res => {
                this.cache.clearGroup(CACHEKEY);
                return res.json();
            })
            .catch((error: any) => {
                return Observable.throw(error.json() || 'Error')
            });
    }

    populatePatchBody(name, config) {
        return {
            spec: {
                replicas: config.replicas,
                template: {
                    spec: {
                        containers: config.command ? [
                            {
                                name: name,
                                command: config.command
                            }
                        ] : [
                            {
                                name: name,
                                resources: {
                                    limits: config.limits
                                }
                            }
                        ]
                    }
                }
            }
        }
    }

    populateCreateBody(namespace, name, config: bodyConfig) {
        // if config.command = true, return body as worker request
        return {
            apiVersion: "v1",
            kind: "DeploymentConfig",
            metadata: {
                annotations: { "openshift.io/generated-by": "AusNimbus" },
                labels: { worker: name },
                name: config.command ? `${name}-worker` : name
            },
            spec: {
                replicas: config.replicas,
                selector: { deploymentconfig: config.command ? `${name}-worker` : name },
                strategy: {
                    activeDeadlineSeconds: 21600,
                    resources: {},
                    rollingParams: {
                        intervalSeconds: 1,
                        maxSurge: "25%",
                        maxUnavailable: "25%",
                        timeoutSeconds: 600,
                        updatePeriodSeconds: 1
                    },
                    type: "Rolling"
                },
                template: {
                    metadata: {
                        creationTimestamp: null,
                        labels: {
                            worker: name,
                            deploymentconfig: config.command ? `${name}-worker` : name
                        }
                    },
                    spec: {
                        containers: [
                            {
                                image: `${name}:latest`,
                                imagePullPolicy: "Always",
                                name: config.command ? `${name}-worker` : name,
                                command: config.command,
                                ports: [
                                    {
                                        containerPort: 8080,
                                        protocol: "TCP"
                                    }
                                ],
                                envFrom: [
                                    {
                                        configMapRef: {
                                          name: name
                                        }
                                    },
                                    {
                                        secretRef: {
                                          name: name
                                        }
                                    }
                                ],
                                resources: {
                                    limits: {
                                        memory: "512Mi"
                                    }
                                },
                                terminationMessagePath: "/dev/termination-log"
                            }
                        ],
                        dnsPolicy: "ClusterFirst",
                        restartPolicy: "Always",
                        securityContext: {},
                        terminationGracePeriodSeconds: 30
                    }
                },
                test: false,
                triggers: [
                    {
                        imageChangeParams: {
                            automatic: true,
                            containerNames: [config.command ? `${name}-worker` : name],
                            from: {
                                kind: "ImageStreamTag",
                                name: `${name}:latest`,
                                namespace: namespace
                            }
                        },
                        type: "ImageChange"
                    },
                    { type: "ConfigChange" }
                ]
            }
        }
    }
}
