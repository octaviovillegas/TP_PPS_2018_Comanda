import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FotoClientePage } from './foto-cliente';

@NgModule({
  declarations: [
    FotoClientePage,
  ],
  imports: [
    IonicPageModule.forChild(FotoClientePage),
  ],
})
export class FotoClientePageModule {}
