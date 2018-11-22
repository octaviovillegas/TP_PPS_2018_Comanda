import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservasMestrePage } from './reservas-mestre';
import {PipesModule} from '../../../pipes/pipes.module';
@NgModule({
  declarations: [
    ReservasMestrePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservasMestrePage),
    PipesModule
  ],
})
export class ReservasMestrePageModule {}
