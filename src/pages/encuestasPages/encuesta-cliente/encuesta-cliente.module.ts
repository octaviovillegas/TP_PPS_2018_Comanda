import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncuestaClientePage } from './encuesta-cliente';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    EncuestaClientePage,
  ],
  imports: [
    IonicPageModule.forChild(EncuestaClientePage),
    Ionic2RatingModule
  ],
})
export class EncuestaClientePageModule {}
