import { AltaClientePage } from './../../altasPages/alta-cliente/alta-cliente';
import { EncuestaEnstradaSalidaPage } from './../../encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida';
import { EncuestaSupervisorPage } from '../../encuestasPages/encuesta-supervisor/encuesta-supervisor';
import { MesasPage } from './../../mesasPages/mesas/mesas';

import { Events, NavController, IonicPage, NavParams } from 'ionic-angular';
import { Component, Output,EventEmitter } from '@angular/core';
import { AltaPedidoPage } from '../../pedidosPages/alta-pedido/alta-pedido';
import { PedidosPage } from '../../pedidosPages/pedidos/pedidos';


@IonicPage()
@Component({
  selector: 'page-menu-mozo',
  templateUrl: 'menu-mozo.html',
})
export class MenuMozoPage {

 @Output() openPage = new EventEmitter();

  public pages: Array<{ title: string, component: any }>;
  public perfil;

    //this.perfil = this.navParams.get('perfil');
    // this.events2.subscribe('usuario', (data)=>{
    //   this.perfil = data;
    //   console.log(data);
    //   this.cargarPages();
    // })
    //this.perfil = 'Mozo';

  constructor(public events2: Events, public navCtrl: NavController, public navParams: NavParams) {
    //this.perfil = this.navParams.get('perfil');
    //this.perfil = localStorage.getItem("perfil");
    //this.cargarPages();


    
    // this.events2.subscribe('usuario', (data) => {
    //   this.perfil = data.perfil;
    //   console.log("entro!");
    //   this.cargarPages();
    // })
  }

  // cargarPages() {
  //   switch (this.perfil) {

  //     case 'Mozo':
  //       this.pages = [
  //         { title: 'Mesas', component: MesasPage },
  //         { title: 'Encuesta e/s', component: EncuestaEnstradaSalidaPage },
  //         { title: 'Encuesta supervisor', component: EncuestaSupervisorPage },
  //         { title: 'Nuevo cliente', component: AltaClientePage }
  //       ];
  //       break;
  //     //LOS SIGUIENTES MENUS HAY QUE IR ARREGLANDOLOS
  //     case 'Supervisor':
  //     case 'Dueño':
  //       this.pages = [
  //         { title: 'Reservas', component: MesasPage },
  //         { title: 'Nuevo Empleado', component: MesasPage },
  //         { title: 'Nuevo Supervisor', component: MesasPage },
  //         { title: 'Estadisticas', component: MesasPage },
  //         { title: 'Encuesta', component: EncuestaEnstradaSalidaPage }
  //       ];
  //       break;

  //     case 'Cocinero':
  //     case 'Bartender':
  //       this.pages = [
  //         { title: 'Mesas', component: MesasPage },
  //         { title: 'Alta Cliente', component: AltaClientePage },
  //        //{ title: 'Alta Pedido', component: AltaPedidoPage },
  //         //{ title: 'Pedidos', component: PedidosPage }
  //       ];
  //       break;

  //     case 'Cliente':
  //       this.pages = [
  //         { title: 'Reservar', component: MesasPage },
  //         { title: 'Hacer pedido', component: EncuestaEnstradaSalidaPage },
  //         { title: 'Encuesta satisfaccion', component: EncuestaSupervisorPage }
  //       ];
  //       break;
  //   }
  // }



  // ionViewDidLoad() {

  // }

  // enviarPage(p: any) {
  //  //this.navCtrl.push(p);
  //  this.openPage.emit(p);
  // }
  // logoutApp() {

  // }

//}
