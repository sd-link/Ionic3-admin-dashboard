import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DropdownOptions } from './../../models/DropdownOptions'
@Component({
  selector: 'dropdown-select',
  templateUrl: 'dropdown-select.html'
})
export class DropdownSelectComponent implements OnChanges {

  @Input() options: DropdownOptions[] = []
  @Input() selected: any;
  @Input() disabled: boolean;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>()

  optionSelected: any;

  constructor() {}

  ngOnChanges() {
    this.optionSelected = this.options.find(res => res.value == this.selected)
  }  

  onClick() {
    this.onSelect.emit(this.optionSelected);
  }

}
