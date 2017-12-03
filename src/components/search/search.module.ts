import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SearchComponent } from './search';

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchComponentModule {}
