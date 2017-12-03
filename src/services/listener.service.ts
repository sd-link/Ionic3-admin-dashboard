import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ListenerService {
    static reloadData$ = new Subject<any>();

    constructor( ) { }

    listenReload() { 
        return ListenerService.reloadData$; 
    }

    triggerReload(data) { 
        ListenerService.reloadData$.next(data); 
    }

}