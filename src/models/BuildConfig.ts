export class BuildConfig {
    apiVersion: string = "v1";
    kind: string = "BuildConfig";
    metadata: any;
    spec: any;

    setMetadata(appName): MetaData {
        return {
            annotations: {
                "openshift.io/generated-by": "AusNimbus"
            },
            creationTimestamp: null,
            labels: {
                app: appName
            },
            name: appName
        }
    }

    setSpec(specs: specsFormat) {
        return {
            nodeSelector: null,
            output: {
                to: {
                    kind: "ImageStreamTag",
                    name: `${specs.lang}:${specs.version}`
                }
            },
            postCommit: {},
            resources: {
                limits: {
                    memory: specs.limit
                }
            },
            runPolicy: "Serial",
            source: {
                git: {
                    ref: specs.gitBranch,
                    uri: specs.gitSourceUrl
                },
                sourceSecret: {
                    name: specs.appName
                },
                type: specs.gitType
            },
            strategy: {
                sourceStrategy: {
                    from: {
                        "kind": "ImageStreamTag",
                        "name": `${specs.lang}:${specs.version}`,
                        "namespace": specs.vendor
                    },
                    env: specs.env
                },
                type: "Source"
            },
            triggers: null
        }
    }

    setTrigger(
        triggerType: string, secretNumber: string, imageChange: boolean,
        configChange: boolean
    ) {
        const triggers: any =
            [
                {
                    generic: {
                        secret: secretNumber
                    },
                    type: triggerType
                }
            ];
        if (imageChange)
            triggers.push({
                imageChange: {},
                type: "ImageChange"
            })
        if (configChange)
            triggers.push({
                type: "ConfigChange"
            })
        return triggers;
    }
}

export interface MetaData {
    annotations: any;
    creationTimestamp: string;
    labels: any;
    name: string;
}

export interface specsFormat {
    appName: string;
    lang: string;
    version: string;
    vendor: string;
    limit: string;
    gitType: string;
    gitBranch: string;
    gitSourceUrl: string;
    env: any;
}