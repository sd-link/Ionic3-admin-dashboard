import { Component } from '@angular/core';

/**
 * Generated class for the LoadingSpinnerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'loading-spinner',
  templateUrl: 'loading-spinner.html'
})
export class LoadingSpinnerComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
