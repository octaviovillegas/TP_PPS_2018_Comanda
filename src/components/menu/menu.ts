import { AuthProvider } from './../../providers/auth/auth';
import { Nav } from 'ionic-angular';
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  @ViewChild(Nav) nav: Nav;
  @Output() openPage = new EventEmitter();
  @Output() cerrarSesion = new EventEmitter();

  public pages: Array<{ title: string, component: string }>;

  constructor(
    private auth: AuthProvider
  ) {

    //Me subscribo para tomar los cambios del perfil
      this.auth.buscarPerfil().subscribe(
        (valor:string)=> this.cargarPages(valor)
      );
  }

  cargarPages(perfil:string) {

    switch (perfil) {

      case 'Mozo':
        this.pages = [
          { title: 'Mesas', component: "MesasPage" },
          { title: 'Encuesta e/s', component: "EncuestaEnstradaSalidaPage" },
          { title: 'Nuevo cliente', component: "AltaClientePage" }
        ];
        break;
      //LOS SIGUIENTES MENUS HAY QUE IR ARREGLANDOLOS
      case 'Supervisor':
      case 'Dueño':
        this.pages = [
          { title: 'Reservas', component: "ReservasPage" },
          { title: 'Nuevo Empleado', component: "AltaEmpleadoPage" },
          { title: 'Nuevo Supervisor', component: "AltaSupervisorPage" },
          { title: 'Nuevo Dueño', component:"AltaDueñoPage"},
          { title: 'Nueva Mesa', component:"AltaMesaPage"},
          { title: 'Encuesta e/s', component: "EncuestaEnstradaSalidaPage" },
          { title: 'Encuesta', component: "EncuestaEnstradaSalidaPage" },
          { title: 'Encuesta supervisor', component: "EncuestaSupervisorPage" },   
        ];
        break;

      case 'Cocinero':
        this.pages = [
          { title: 'Pedidos', component: "PedidosCocinaPage" },
          { title: 'Nuevo plato', component: "AltaPlatoPage"},
          { title: 'Encuesta e/s', component: "EncuestaEnstradaSalidaPage" }     
        ];
          break;
      case 'Bartender':
        this.pages = [
          { title: 'Pedidos', component: "PedidosCocinaPage" },
          { title: 'Nueva bebida', component: "AltaBebidaPage"},
          { title: 'Encuesta e/s', component: "EncuestaEnstradaSalidaPage" }
        ];
        break;

      case 'Cliente':
        this.pages = [
          { title: 'Reservar', component: "MesasPage" },
          { title: 'Hacer pedido', component: "PedidosPage" },
          { title: 'Encuesta satisfaccion', component: "EncuestaClientePage" },
        ];
        break;

        case 'Mestre':
        this.pages = [
          { title: 'Reservar', component: "EsperaPage" },
          { title: 'Encuesta e/s', component: "EncuestaEnstradaSalidaPage" }
        ];
        break; 
    }
  }


  enviarPage(p: any) {
    this.openPage.emit(p);
  }
  salir() {
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    this.cerrarSesion.emit(LoginPage);
  }

}


