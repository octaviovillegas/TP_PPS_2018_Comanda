import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncuestaSupervisorPage } from './encuesta-supervisor';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [
    EncuestaSupervisorPage,
  ],
  imports: [
    IonicPageModule.forChild(EncuestaSupervisorPage),
    Ionic2RatingModule
  ],
})
export class EncuestaSupervisorPageModule {}
