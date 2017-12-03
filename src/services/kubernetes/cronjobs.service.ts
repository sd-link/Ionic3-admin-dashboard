import { CacheService } from 'ionic-cache/dist';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import { Endpoint } from '../endpoints';
import { BaseService } from "../BaseService";

import { ENV } from '../../env';
const CACHEKEY = 'cronJob'

@Injectable()
export class CronJobsService extends BaseService {

    constructor(
        public http: Http,
        public cache: CacheService,
        public _endpoint: Endpoint,
        public storage: Storage
    ) {
        super(http, storage, _endpoint, cache)
    }

    parseUrl(key, context?) {
        return this.getUrl(key, 'cronjobs', context)
    }

    patchCronJobs(projectId, cronId, config?) {
        const body = this.populatePatchBody(cronId, config)
        const url = this.parseUrl('get', { projectId, cronId });
        return this.requestApiPatch(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getProjectCronJobs(projectId) {
        const url = this.parseUrl('index', { projectId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    getCronJobs(projectId, cronId) {
        const url = this.parseUrl('get', { projectId, cronId });
        const request = this.requestApiGet(url)
            .map(this.extractData)
            .catch(this.handleError);
        return this.cache.loadFromObservable(url, request, CACHEKEY);
    }

    createCronJobs(projectId, cronId, config) {
        const body = this.populateCronJobBody(projectId, cronId, config);
        const url = this.parseUrl('index', { projectId });
        return this.requestApiPost(url, body, CACHEKEY)
            .map(this.extractData)
            .catch(this.handleError)
    }

    deleteCronJobs(projectId, cronId) {
        const url = this.parseUrl('get', { projectId, cronId });
        return this.requestApiDelete(url, null, CACHEKEY)
            .map(res => {
                this.cache.clearGroup(CACHEKEY);
                return this.extractData(res)
            })
            .catch(this.handleError);
    }

    populatePatchBody(cronId, config) {
        return {
            spec: {
                schedule: config.schedule,
                jobTemplate: {
                    spec: {
                        template: {
                            spec: {
                                containers: [
                                    {
                                        name: cronId,
                                        command: config.command
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }

    populateCronJobBody(projectId, cronId, config) {
        return {
            kind: "CronJob",
            metadata: {
                name: cronId,
                labels: {
                    cronjob: cronId
                }
            },
            spec: {
                concurrencyPolicy: "Allow",
                jobTemplate: {
                    metadata: {
                        creationTimestamp: null
                    },
                    spec: {
                        template: {
                            metadata: {
                                creationTimestamp: null,
                                labels: {
                                    cronjob: cronId
                                }
                            },
                            spec: {
                                containers: [
                                    {
                                        name: cronId,
                                        image: `${ENV.url}/${projectId}/${cronId}:latest`,
                                        imagePullPolicy: "Always",
                                        command: config.command,
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
                                restartPolicy: "Never",
                                securityContext: {},
                                terminationGracePeriodSeconds: 30
                            }
                        }
                    }
                },
                schedule: config.schedule,
                suspend: false
            }
        }
    }
}
