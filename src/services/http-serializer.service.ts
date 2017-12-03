import { Injectable } from '@angular/core';

@Injectable()
export class HttpSerializer {
    public serialize(Model, Response) {
        const model = new Model();
        const propMap: any = model.getPropMap();
        return Object.keys(propMap).reduce((acc, key) => {
            acc[key] = Response.metadata[propMap[key]];
            return acc;
        }, model);
    }

    public serializeCollection(Model, Response) {
        return {
            metadata: Response.metadata,
            items: Response.items.map(item => {
                return this.serialize(Model, item)})
        };
    }
}