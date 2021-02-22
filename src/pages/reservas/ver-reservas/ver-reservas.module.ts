import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerReservasPage } from './ver-reservas';

@NgModule({
  declarations: [
    VerReservasPage,
  ],
  imports: [
    IonicPageModule.forChild(VerReservasPage),
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VerReservasPageModule {}
