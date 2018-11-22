import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { Iusuario} from '../../../clases/usuario';
import {UsuariosProvider} from '../../../providers/usuarios/usuarios';
import {ReservaProvider} from '../../../providers/reserva/reserva';
import {ComandaProvider} from '../../../providers/comanda/comanda';
import {MesasProvider} from '../../../providers/mesas/mesas';
import {IReserva} from '../../../clases/IReserva';
import {IComanda} from '../../../clases/IComanda';
import {IMesa} from '../../../clases/IMesa';

/**
 * Generated class for the ReservasMestrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reservas-mestre',
  templateUrl: 'reservas-mestre.html',
})
export class ReservasMestrePage {
  public perfil: string = "";
  
  public usuarios:Iusuario[];
  public mozos:Iusuario[];
  public mozo:Iusuario;
  public estado:string;
  public fecha:string;
  public mesas:IMesa[] = [];
  public listaReserva:IReserva[]=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    
    public proveedorUsuario:UsuariosProvider,
    public proveedorReservas:ReservaProvider,
    
    public menuCtrl: MenuController,
    public loadingCtrl:LoadingController,
    public proveedorComanda:ComandaProvider,
    public proveedorMesa:MesasProvider) 
  {
    this.mozos = [];
    this.buscarReservas();
    this.menuCtrl.enable(true, "menu");
    this.proveedorMesa.traerMesasconId()
    .subscribe(data =>{
      this.mesas = data;
    })
    this.proveedorUsuario.obtenerUsuarios().subscribe(data =>{
      this.usuarios = data;
      data.forEach(element => {
        if(element.perfil == 'Mozo'){
          
          this.mozos.push(element);
        }
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservasMestrePage');
  }
  ionViewWillEnter() {
    this.perfil = localStorage.getItem("perfil");
  }
  public buscarReservas(){
    this.listaReserva = [];
    let hoy = this.hoy();
    let hora = this.horaAntes();
    this.proveedorReservas.traerReservasConfirmadas().subscribe(data =>{
      console.log(data);
      this.listaReserva=[];
      this.listaReserva = data;
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
    console.log("list");
    nueva.fechaHora = Date.now();//
    nueva.mesa = reserva.mesaId; //
    nueva.id = new Date().valueOf(); //
    nueva.userID = this.mozo.id; //
    nueva.ClienteId = reserva.clienteId;
    nueva.MozoId = this.mozo.id; //
    nueva.nombreCliente = reserva.nombreCliente; //
    nueva.cliente = reserva.dni; //
    let cargando = this.loadingCtrl.create({
      content:'Abriendo comanda...'
    });
    cargando.present();
    this.mesas.forEach(element => {      
      if(element.idMesa == nueva.mesa){
        console.log(element);
        this.proveedorComanda.saveComanda(nueva, element, nueva.mesa.toString())
        .then(data =>{
          cargando.dismiss();
        })
      }
    });
  }

}
