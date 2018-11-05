import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaMesaPage } from './alta-mesa';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { UtilProvider } from '../../../providers/util/util';

@NgModule({
  declarations: [
    AltaMesaPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaMesaPage),
    NgxQRCodeModule
  ],
  providers: [UtilProvider],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AltaMesaPageModule { }
