import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrEsperaPage } from './qr-espera';

@NgModule({
  declarations: [
    QrEsperaPage,
  ],
  imports: [
    IonicPageModule.forChild(QrEsperaPage),
  ],
})
export class QrEsperaPageModule {}
