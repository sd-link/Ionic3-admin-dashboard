import { NgModule } from '@angular/core';
import { LoadingSpinnerComponentModule } from '../../components/loading-spinner/loading-spinner.module';
import { IonicPageModule } from 'ionic-angular';
import { UserSubscriptionPage } from './user-subscription';
import { PaymentMethodModalPageModule } from "../payment-method-modal/payment-method-modal.module";

@NgModule({
  declarations: [
    UserSubscriptionPage
  ],
  imports: [
    PaymentMethodModalPageModule,
    IonicPageModule.forChild(UserSubscriptionPage),
    LoadingSpinnerComponentModule
  ],
  exports: [
    UserSubscriptionPage
  ]
})
export class UserSubscriptionPageModule {}
