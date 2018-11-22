import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController,MenuController } from 'ionic-angular';
import {EsperaProvider} from '../../providers/espera/espera';
import {IEspera} from '../../clases/IEspera';
import {ModalEsperaPage} from '../espera/modal-espera/modal-espera';
import {Observable} from 'rxjs';
import { EncuestaEnstradaSalidaPageModule } from '../encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida.module';
import { Iusuario} from '../../clases/usuario';
import {UsuariosProvider} from '../../providers/usuarios/usuarios';
import {ReservaProvider} from '../../providers/reserva/reserva';
import {ComandaProvider} from '../../providers/comanda/comanda';
import {MesasProvider} from '../../providers/mesas/mesas';
import {IReserva} from '../../clases/IReserva';
import {IComanda} from '../../clases/IComanda';
import { messaging } from 'firebase';

/**
 * Generated class for the EsperaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-espera',
  templateUrl: 'espera.html',
})
export class EsperaPage {
  //public lista:Observable<IEspera[]>;
  public perfil: string = "";
  public lista:IEspera[];
  public usuarios:Iusuario[];
  public mozos:Iusuario[];
  public mozo:Iusuario;
  public estado:string;
  public fecha:string;
  public listaReserva:IReserva[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorEspera:EsperaProvider,
    public proveedorUsuario:UsuariosProvider,
    public proveedorReservas:ReservaProvider,
    public modalCtrl:ModalController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    public proveedorComanda:ComandaProvider,
    public proveedorMesa:MesasProvider) 
  {
    this.mozos = [];
    this.estado = "espera";
    this.menuCtrl.enable(true, "menu");
    this.lista = [];
    this.listaReserva = [];
    this.buscarListaEspera();
    this.buscarReservas();
    this.proveedorUsuario.obtenerUsuarios().subscribe(data =>{
      this.usuarios = data;
      data.forEach(element => {
        if(element.perfil == 'Mozo'){
          console.log(this.mozos);
          this.mozos = data;
        }
      });
    })
  }

  ionViewWillEnter() {
    this.perfil = localStorage.getItem("perfil");
  }

  ngOnInit() {
    //this.lista = this.proveedorEspera.traerEnLista();
  }
  public asignarMesa(espera:IEspera){
    let nombre = "";
    let dni = "";
    if(!espera.esAnonimo){
      nombre = espera.nombre;
      dni = espera.dni;
    }
    let miModal = this.modalCtrl.create(ModalEsperaPage,{
      comensales:espera.comensales,
      idCliente:espera.uidCliente,
      idEspera:espera.key,
      esAnonimo: espera.esAnonimo,
      nombre: nombre,
      dni: dni
    });
    miModal.onDidDismiss(data =>{
      let loading = this.loadingCtrl.create({
        spinner:'hide', 
        content:`<ion-grid>
                    <ion-row>
                       <ion-col>
                          <img src="assets/imgs/icono_restaurant.png" class="esperando">
                       </ion-col>
                    </ion-row>
                  </ion-grid>
                `,
        cssClass: 'my-loading-class'
      });      

      if(data != null){
        if(data.comanda == "True"){
          loading.present();

          this.proveedorEspera.asignarMesa(espera.key)
          .then(data =>{
            this.buscarListaEspera();
            loading.dismiss();
          })
          .catch(error =>{
            console.log(error);
          })
        }
      }
    })
    miModal.present();
  }

  public buscarListaEspera(){
    this.lista = [];
    this.proveedorEspera.traerEnLista()
    .subscribe(data =>{
      this.lista = [];
      console.log(data);
      data.forEach(element => {
        if(element.estado == 'espera'){
          
          this.lista.push(element);
        }
      });
    })
  }

  public buscarReservas(){
    this.listaReserva = [];
    let hoy = this.hoy();
    let hora = this.horaAntes();
    this.proveedorReservas.traerReservasConfirmadas().subscribe(data =>{
      console.log(data);
      this.listaReserva=[];
      data.forEach(element => {
        if(element.fecha == hoy){
          this.listaReserva.push(element);
        }
      });
    })
  }

  public abrirComanda(reserva:IReserva){
    let nueva:IComanda = {
      id: 0,
      cliente: "",
      fechaHora:0,
      mesa: 0,
      nombreCliente:"",
      fotoCliente:"",
      userID: "",
      estado: "Abierta",
      ClienteId:"",
      MozoId:"",
    }
    nueva.fechaHora = Date.now();
    nueva.mesa = reserva.mesaId;
    nueva.id = new Date().valueOf();
    nueva.userID = this.mozo.id;
    nueva.ClienteId = reserva.clienteId;
    nueva.MozoId = this.mozo.id;
    nueva.nombreCliente = reserva.nombreCliente;
    nueva.cliente = reserva.dni;
    this.proveedorMesa.traerMesasconId()
    .subscribe(mesas =>{
      let cargando = this.loadingCtrl.create({
        content:'Abriendo comanda...'
      });
      cargando.present();
      mesas.forEach(element => {
        if(element.idMesa == nueva.mesa){
          this.proveedorComanda.saveComanda(nueva, element, nueva.mesa.toString())
          .then(data =>{
            cargando.dismiss();
          })
        }
      });
    })
  }


  private hoy(){
    let today = new Date();
    let dd:any = today.getDate()
    let mm:any = today.getMonth() + 1; //Enero es 0!

    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
     return dd + mm + yyyy;
  }

  private horaAntes(){
    let fecha = new Date();
    let hora = fecha.getHours();
    return hora -1;
  }
}
