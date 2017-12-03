import { Component } from '@angular/core';

/**
 * Generated class for the PageTitleComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'page-title',
  templateUrl: 'page-title.html'
})
export class PageTitleComponent {
  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
