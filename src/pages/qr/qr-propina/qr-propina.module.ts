import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrPropinaPage } from './qr-propina';

@NgModule({
  declarations: [
    QrPropinaPage,
  ],
  imports: [
    IonicPageModule.forChild(QrPropinaPage),
  ],
})
export class QrPropinaPageModule {}
