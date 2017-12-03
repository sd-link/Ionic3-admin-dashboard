import 'rxjs/Rx';
import {Subject,Subscription} from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  private events = new Subject();
  subscribe (next,error,complete): Subscription {
    return this.events.subscribe(next,error,complete);
  }
  next (event) {
    this.events.next(event);
  }
}