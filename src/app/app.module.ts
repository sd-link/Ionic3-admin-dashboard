import { PipeModule } from '../pipes/pipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CacheModule } from "ionic-cache";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { COMPONENTS, PROVIDERS, MODULES } from './app.imports';
import { createSecretDlgComponent } from '../pages/app-create/app-create-code-dlg';

@NgModule({
  declarations: [
    ...COMPONENTS,
    createSecretDlgComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    PipeModule.forRoot(),
    CacheModule.forRoot(),
    IonicModule.forRoot(COMPONENTS[0]),
    IonicStorageModule.forRoot(),
    ...MODULES
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ...COMPONENTS,
    createSecretDlgComponent
  ],
  providers: [
    PROVIDERS,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
