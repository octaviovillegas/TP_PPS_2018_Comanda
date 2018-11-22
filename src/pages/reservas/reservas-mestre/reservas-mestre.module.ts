import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservasMestrePage } from './reservas-mestre';

@NgModule({
  declarations: [
    ReservasMestrePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservasMestrePage),
  ],
})
export class ReservasMestrePageModule {}
