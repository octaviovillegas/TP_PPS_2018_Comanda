import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaComandaPage } from './alta-comanda';

@NgModule({
  declarations: [
    AltaComandaPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaComandaPage),
  ],
})
export class AltaComandaPageModule {}
