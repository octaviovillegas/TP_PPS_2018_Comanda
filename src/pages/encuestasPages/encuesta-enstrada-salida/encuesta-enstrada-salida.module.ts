import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncuestaEnstradaSalidaPage } from './encuesta-enstrada-salida';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    EncuestaEnstradaSalidaPage,
  ],
  imports: [
    IonicPageModule.forChild(EncuestaEnstradaSalidaPage),
    Ionic2RatingModule
  ],
})
export class EncuestaEnstradaSalidaPageModule {}
