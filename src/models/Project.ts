export class Project {
    name: string;
    displayName: string;
    description: string;
    status: any;
    default: ProjectRequest = {
        kind: "ProjectRequest",
        apiVersion: "v1",
        metadata: {
            name: null,
            creationTimestamp: null
        },
        displayName: null,
        description: null
    }

    getPropMap(): any {
        return {
            name: 'name',
            annotations: 'annotations',
            status: 'status'
        };
    }
}

export interface ProjectRequest {
    kind: string;
    apiVersion: string;
    metadata: ProjectMetaData
    displayName: string;
    description: string;
}

export interface ProjectMetaData {
    name: string
    creationTimestamp: null
}