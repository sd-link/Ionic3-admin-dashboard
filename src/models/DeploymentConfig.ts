export class DeploymentConfig {
    apiVersion: string = "v1";
    kind: string = "DeploymentConfig";
    metadata: metaDataFormat;
    spec: any;

    setMetadata(appName): metaDataFormat {
        return {
            annotations: {
                "openshift.io/generated-by": "AusNimbus"
            },
            labels: {
                "app": appName
            },
            name: appName
        }
    }

    setSpec(specs: specsFormat) {
        return {
            replicas: "1",
            selector: {
                "deploymentconfig": specs.name
            },
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
                        app: specs.appName,
                        deploymentconfig: specs.appName
                    }
                },
                spec: {
                    containers: [
                        {
                            image: `${specs.lang}:${specs.version}`,
                            imagePullPolicy: "Always",
                            name: specs.lang,
                            ports: [
                                {
                                    containerPort: 8080,
                                    protocol: "TCP"
                                }
                            ],
                            envFrom: [
                                {
                                    configMapRef: null,
                                    name: specs.appName
                                },
                                {
                                    secretRef: null,
                                    name: specs.appName
                                }
                            ],
                            resources: {
                                limits: {
                                    memory: "2000"
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
                        containerNames: [
                            specs.appName
                        ],
                        from: {
                            kind: "ImageStreamTag",
                            name: `${specs.lang}:${specs.version}`,
                            namespace: "ausnimbus-prototype"
                        }
                    },
                    type: "ImageChange"
                },
                {
                    type: "ConfigChange"
                }
            ]
        }
    }

}

export interface metaDataFormat {
    annotations: any;
    labels: any;
    name: string;
}

export interface specsFormat {
    name: string; 
    appName: string;
    lang: string;
    version: string;
}