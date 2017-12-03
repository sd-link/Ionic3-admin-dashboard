import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Generated class for the ButtonActionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'button-action',
  templateUrl: 'button-action.html'
})
export class ButtonActionComponent {
  @Input() loadingText: any;
  @Input() state: boolean;
  @Output() submit = new EventEmitter<any>();

  constructor() {}

  submitData() {
    this.submit.emit();
  }

}
