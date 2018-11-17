import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import {MesasProvider} from '../../../providers/mesas/mesas';
import {IMesa} from '../../../clases/IMesa';
import {IComanda} from '../../../clases/IComanda';
import {ComandaProvider} from '../../../providers/comanda/comanda';
import {EsperaProvider} from '../../../providers/espera/espera';
import {UsuariosProvider} from '../../../providers/usuarios/usuarios';
import { Iusuario, usuario} from '../../../clases/usuario';
/**
 * Generated class for the ModalEsperaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-espera',
  templateUrl: 'modal-espera.html',
})
export class ModalEsperaPage {
  comensales:number;
  idCliente:string;
  mesasLibres:IMesa[] = [];
  nuevaComanda:IComanda;
  perfil:string;
  idEspera:string;
  esAnonimo:boolean;
  usuarios:Iusuario[];
  usuario:Iusuario;
  nombre:string;
  dni:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorMesas:MesasProvider,
    public proveedorComanda:ComandaProvider,
    public proveedorEspera:EsperaProvider,
    public viewCtrl:ViewController,
    public proveedorUsuarios:UsuariosProvider) 
  {
    this.usuarios = [];
    this.mesasLibres = [];
    
    this.comensales = this.navParams.get('comensales');
    this.idCliente = this.navParams.get('idCliente');
    this.idEspera = this.navParams.get('idEspera');
    this.idCliente = this.navParams.get('idCliente');
    this.esAnonimo = this.navParams.get('esAnonimo');
    if(!this.esAnonimo){
      this.dni = this.navParams.get('dni');
      this.nombre = this.navParams.get('nombre');
    }
    this.proveedorUsuarios.obtenerUsuarios()
    .subscribe(data =>{
      data.forEach(element => {
        if(element.perfil == 'Mozo'){
          this.usuarios.push(element);
        }
      });
    })
    this.proveedorMesas.traerMesasconId().subscribe(data =>{
      console.log(data);  
      this.mesasLibres = [];
      data.forEach(element => {
        if(element.estado == 'Libre'  && parseInt(element.capacidad) >= this.comensales){
          this.mesasLibres.push(element);
          
        }
      });
      console.log(this.mesasLibres);
      console.log(this.comensales);
      console.log(this.idCliente);
      
      console.log(this.esAnonimo);
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEsperaPage');
  }

  public asignar(mesaAsignada:IMesa){
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
    //cliente -> dni
    //
    nueva.fechaHora = Date.now();
    if(this.esAnonimo){
      nueva.nombreCliente = localStorage.getItem('nombre');
      nueva.fotoCliente = localStorage.getItem('fotoAnonimo');
    }
    else{
      nueva.nombreCliente = this.nombre;
      nueva.cliente = this.dni;
    }
    nueva.mesa = mesaAsignada.idMesa;
    nueva.id = new Date().valueOf();
    nueva.userID = this.usuario.id;
    nueva.ClienteId = this.idCliente;
    nueva.MozoId = this.usuario.id;
    console.log(mesaAsignada);
    console.log(nueva);
    this.proveedorComanda.saveComanda(nueva, mesaAsignada, mesaAsignada.key)
    .then(data =>{
      this.viewCtrl.dismiss({
        'comanda': 'True'
      })
    })

    

  }

}
