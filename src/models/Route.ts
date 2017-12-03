export class Route {
    apiVersion: any = "v1";
    kind: any = "Route";
    metadata: metaDataFormat;
    spec: any = {
        host: "",
        port: {
            targetPort: "8080-tcp"
        },
        to: null,
        wildcardPolicy: "None"
    }

    setSpecTo(appName): any {
        return {
            kind: "Service",
            name: appName,
            weight: 100
        }
    }

    setMetadata(appName): metaDataFormat {
        return {
            annotations: {
                "openshift.io/generated-by": "AusNimbus",
                "kubernetes.io/tls-acme": "true"
            },
            labels: {
                app: appName
            },
            name: appName
        }
    }
}

export interface metaDataFormat {
    annotations: any;
    labels: any;
    name: string;
}