export interface Teams {
    initialName,
    email,
    role,
    name
}

export interface TeamModel {
    kind: string,
    apiVersion: string,
    metadata: TeamMetadata
    userNames: string[],
    groupNames: string,
    subjects: TeamSubject[]
    roleRef: TeamRolRef
}

export interface TeamSubject {
    kind: string
    name: string
}

export interface TeamMetadata {
        name: string,
        namespace: string,
        creationTimestamp: any
}

export interface TeamRolRef {
    name: string
}