export class Secret {
    apiVersion: string = "v1";
    data: any;
    kind: string = "Secret";
    metadata: AppMetaData = {
        annotations: {
            generatedBy: "AusNimbus"
        },
        creationTimestamp: null,
        name: null,
        labels: {
            "app": "appaiapp"
        }
    }
    type: string = "kubernetes.io/basic-auth";
}

export interface AppMetaData {
    annotations: any;
    creationTimestamp: null;
    name: string,
    labels: any
}

export interface AuthData {
    password: string,
    username: string
}