import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the SearchComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'aus-search',
  templateUrl: 'search.html'
})
export class SearchComponent {

  text: string;

  constructor(
    private navCtrl: NavController
  ) {
    this.text = 'Hello World';
  }

  onButtonClicked() {
    this.navCtrl.push('CreateProjectPage')
  }

}
