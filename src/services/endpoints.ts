const MANAGE_API = 'https://manage.ausnimbus.com.au'
const KUBERNETES_API = 'https://api.ausnimbus.com.au'
const HAWKULAR_API = 'https://metrics.anapp.cloud/hawkular/metrics'
const API_VERSION = 'v1';

export class Endpoint {
    getUrl(key, namespace, context) {
        const ENDPOINT = {
            user: {
                login: `${MANAGE_API}/api/${API_VERSION}/dashboard/login`,
                profile: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/profile`,
                password: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/password`,
                pricing: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/pricing`,
                invoices: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/invoices`,
                usage: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/usage`,
                braintreeToken: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/subscription/braintree`,
                registerSubscription: `${MANAGE_API}/api/${API_VERSION}/dashboard/user/subscription`,
                hash: `${MANAGE_API}/api/${API_VERSION}/dashboard/users/hash/${context.hash}`,
                email: `${MANAGE_API}/api/${API_VERSION}/dashboard/users/email/${context.email}`,
                register: `${MANAGE_API}/api/${API_VERSION}/dashboard/register`,
                activate: `${MANAGE_API}/api/${API_VERSION}/dashboard/activate`,

            },
            buildconfig: {
                // /apis/build.openshift.io/v1/buildconfigs/
                index: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/buildconfigs`,
                get: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/buildconfigs/${context.appId}`,
                instantiate: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/buildconfigs/${context.appId}/instantiate`,
            },
            builds: {
                // /apis/build.openshift.io/v1/builds/
                index: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/builds/${context.appId}`,
                logs: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/builds/${context.appId}/log?follow=true`,
                query: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/builds${context.params}`,
            },
            configmap: {
                index: `${KUBERNETES_API}/api/${API_VERSION}/namespaces/${context.projectId}/configmaps`
            },
            pods: {
                index: `${KUBERNETES_API}/api/${API_VERSION}/namespaces/${context.projectId}/pods`
            },
            cronjobs: {
                index: `${KUBERNETES_API}/apis/batch/v2alpha1/namespaces/${context.projectId}/cronjobs`,
                get: `${KUBERNETES_API}/apis/batch/v2alpha1/namespaces/${context.projectId}/cronjobs/${context.cronId}`
            },
            hpa: {
                index: `${KUBERNETES_API}/apis/autoscaling/${API_VERSION}/namespaces/${context.projectId}/horizontalpodautoscalers`,
                query: `${KUBERNETES_API}/apis/autoscaling/${API_VERSION}/namespaces/${context.projectId}/horizontalpodautoscalers${context.params}`,
                get: `${KUBERNETES_API}/apis/autoscaling/${API_VERSION}/namespaces/${context.projectId}/horizontalpodautoscalers/${context.appId}`
            },
            deploymentconfig: {
                // /apis/apps.openshift.io/v1/deploymentconfigs
                index: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/deploymentconfigs`,
                query: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/deploymentconfigs?${context.params}`,
                get: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/deploymentconfigs/${context.appId}`,
                rollback: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/deploymentconfigrollbacks`,
                instantiate: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/deploymentconfigs/${context.appId}/instantiate`
            },
            project: {
                // /apis/project.openshift.io/v1/projects
                index: `${KUBERNETES_API}/oapi/${API_VERSION}/projects`,
                get: `${KUBERNETES_API}/oapi/${API_VERSION}/projects/${context.projectId}`,
                // /apis/project.openshift.io/v1/projectrequests
                request: `${KUBERNETES_API}/oapi/${API_VERSION}/projectrequests`,
                usage: `${MANAGE_API}/api/${API_VERSION}/dashboard/projects/${context.namespace}/usage`,
                teams: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.namespace}/rolebindings`,
                role: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.namespace}/rolebindings/${context.role}`
            },
            imagestream: {
                // /apis/image.openshift.io/v1/imagestreams
                index: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/imagestreams`
            },
            imagestreamimages: {
                get: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/imagestreamimages/${context.name}`
            },
            secret: {
                index: `${KUBERNETES_API}/api/${API_VERSION}/namespaces/${context.projectId}/secrets`
            },
            service: {
                index: `${KUBERNETES_API}/api/${API_VERSION}/namespaces/${context.projectId}/services`
            },
            replicationcontroller: {
                index: `${KUBERNETES_API}/api/${API_VERSION}/namespaces/${context.projectId}/replicationcontrollers`
            },
            route: {
                // /apis/route.openshift.io/v1/routes
                index: `${KUBERNETES_API}/oapi/${API_VERSION}/namespaces/${context.projectId}/routes`
            },
            hawkular: {
                query: `${HAWKULAR_API}/metrics/stats/query`
            },
            resourceQuotas: {
                index: `${KUBERNETES_API}/api/${API_VERSION}/namespaces/${context.projectId}/resourcequotas`,
                update: `${MANAGE_API}/api/${API_VERSION}/dashboard/projects/${context.projectId}/resources`
            }
        }
        return ENDPOINT[namespace] && ENDPOINT[namespace][key];
    }
}
