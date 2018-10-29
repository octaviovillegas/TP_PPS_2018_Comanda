import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaBebidaPage } from './alta-bebida';

@NgModule({
  declarations: [
    AltaBebidaPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaBebidaPage),
  ],
})
export class AltaBebidaPageModule {}
