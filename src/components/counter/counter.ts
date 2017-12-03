import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Generated class for the CounterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'counter',
  template: `
    <div class="check-manual-count">
      <div class="aus-count">
        <input type="text" name="counterValue" class="form-text w100" [(ngModel)]="counterValue">
        <button class="btn plus" (click)="increaseValue()"><i class="fa fa-plus"></i></button>
        <button class="btn minus" (click)="decreaseValue()"><i class="fa fa-minus"></i></button>
      </div>
    </div>
  `
})
export class CounterComponent {
  @Output() valueChange = new EventEmitter<any>();
  @Input() counterValue: number = 0;
  @Input() maxValue: number = 25;
  @Input() minValue: number = 0;

  constructor() {}

  increaseValue() {
    if (this.counterValue < this.maxValue)
      this.counterValue ++;
    this.valueChange.emit(this.counterValue);
  }

  decreaseValue() {
    if (this.counterValue != this.minValue)
      this.counterValue --;
    this.valueChange.emit(this.counterValue);
  }

}
