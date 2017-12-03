import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'modal',
    providers: [ModalService],
    template: `
    <div class="aus-modal" [class.show]="show" (click)="clickOutside($event)">
      <div class="aus-modal-inner">
        <div class="aus-modal-dialog" [class.up]="add" (click)="clickInside($event)">
          <div class="close" (click)="clickOutside($event)">
            <i class="fal fa-times fa-lg"></i>
          </div>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    `
})
export class ModalComponent implements OnInit, OnDestroy{
    @Input() show: boolean;
    @Output() action = new EventEmitter();
    private subscription;
    constructor(
      private _modal: ModalService
    ){}

    ngOnInit() {
      this.subscription = this._modal.subscribe(
        next => {
          return this.dismiss(next);
        },
        error => {
          return this.dismiss({show:false,error:"Some error occur"});
        },
        complete => {
          return this.dismiss({show:false});
        }
      );
    }

    dismiss(data){
      setTimeout(() => {
        this.action.emit(data);
      }, 1);
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    clickInside(e) {
      e.stopPropagation();
      this.show = true;
    }

    clickOutside(e) {
      setTimeout(() => {
        this.action.emit(this.show = !this.show);
      }, 1)
    }
}
