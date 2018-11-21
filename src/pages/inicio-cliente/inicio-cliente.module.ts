import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioClientePage } from './inicio-cliente';

@NgModule({
  declarations: [
    InicioClientePage,
  ],
  imports: [
    IonicPageModule.forChild(InicioClientePage),
  ],
})
export class InicioClientePageModule {}
