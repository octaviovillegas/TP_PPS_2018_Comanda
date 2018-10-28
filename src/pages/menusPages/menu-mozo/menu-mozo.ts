import { AltaClientePage } from './../../altasPages/alta-cliente/alta-cliente';
import { EncuestaEnstradaSalidaPage } from './../../encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida';
import { EncuestaSupervisorPage } from '../../encuestasPages/encuesta-supervisor/encuesta-supervisor';
import { MesasPage } from './../../mesasPages/mesas/mesas';

import { Platform, Nav, NavParams, Events } from 'ionic-angular';
import { Component, Output, EventEmitter } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';


// @IonicPage()

@Component({
  selector: 'page-menu-mozo',
  templateUrl: 'menu-mozo.html',
})
export class MenuMozoPage {
  @Output() openPage = new EventEmitter();

  public pages: Array<{ title: string, component: any }>;
  public perfil;
  
  constructor(public events2: Events) {

    //this.perfil = this.navParams.get('perfil');
    this.events2.subscribe('usuario', (data)=>{
      this.perfil = data;
      console.log(data);
      this.cargarPages();
    })
    //this.perfil = 'Mozo';

    this.cargarPages();

  }

  cargarPages() {

    switch (this.perfil) {

      case 'Mozo':
        this.pages = [
          { title: 'Mesas', component: MesasPage },
          { title: 'Encuesta e/s', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta supervisor', component: EncuestaSupervisorPage },
          { title: 'Nuevo cliente', component: AltaClientePage }
        ];
        break;
//LOS SIGUIENTES MENUS HAY QUE IR ARREGLANDOLOS
      case 'Supervisor':
      case 'Dueño':
        this.pages = [
          { title: 'Reservas', component: MesasPage },
          { title: 'Nuevo Empleado', component: MesasPage },
          { title: 'Nuevo Supervisor', component: MesasPage },
          { title: 'Estadisticas', component: MesasPage },
          { title: 'Encuesta', component: EncuestaEnstradaSalidaPage }
        ];
        break;

      case 'Cocinero':
      case 'Bartender':
        this.pages = [
          { title: 'Pedidos', component: MesasPage },
          { title: 'Nuevo Producto', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta e/s', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta supervisor', component: EncuestaSupervisorPage }
        ];
        break;

      case 'Cliente':
        this.pages = [
          { title: 'Reservar', component: MesasPage },
          { title: 'Hacer pedido', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta satisfaccion', component: EncuestaSupervisorPage }
        ];
        break;
    }

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuMozoPage');
  }

  enviarPage(p: any) {
    this.openPage.emit(p);
  }
  logoutApp() {

  }

}
