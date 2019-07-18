import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Loading, LoadingController } from 'ionic-angular';
import {MesasPage} from '../../mesasPages/mesas/mesas';
import { Iusuario} from '../../../clases/usuario';
import {UsuariosProvider} from '../../../providers/usuarios/usuarios';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { validateArgCount } from '@firebase/util';
import {DatosEncuestaProvider} from '../../../providers/datos/datosEncuesta';
/**
 * Generated class for the EncuestaSupervisorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-supervisor',
  templateUrl: 'encuesta-supervisor.html',
})
export class EncuestaSupervisorPage {
  @ViewChild(Slides) slides: Slides;
  usuarios:Iusuario[];
  usuario:String;
  rate:any;
  encuestaEmpleadoForm:FormGroup;
  encuestaEmpleadoForm2:FormGroup;
  encuestaEmpleadoForm3:FormGroup;
  encuestaClienteForm:FormGroup;
  encuestaClienteForm2:FormGroup;
  encuestaClienteForm3:FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorUsuarios: UsuariosProvider,
    public formBuilder: FormBuilder,
    public proveedorEncuesta: DatosEncuestaProvider,
    public loadingCtrl: LoadingController) 
  {
    this.usuarios = [];
    this.usuario = "";
    this.encuestaEmpleadoForm = this.formBuilder.group({
      relacionColegas:['', Validators.required], //radioButton
      puntualidad:['false'],  // checkbox
      actitud:['false'], // checkbox
      eficacia:['false'],
      //rendimiento:['', Validators.required],
      //calificacion:['', Validators.required],
      //observaciones:['', Validators.required]
    });

    this.encuestaEmpleadoForm2 = this.formBuilder.group({
      rendimiento:['', Validators.required],
      calificacion:['', Validators.required],
    });

    this.encuestaEmpleadoForm3 = this.formBuilder.group({
      observaciones:['', Validators.required]
    });

    this.encuestaClienteForm = this.formBuilder.group({
      servicioCliente:['', Validators.required],
      amabilidad: ['false'],
      propina: ['false'],
      fidelidad: ['false']
    });

    this.encuestaClienteForm2 = this.formBuilder.group({
      propinaServicio: ['', Validators.required],
      calificacionCliente: ['', Validators.required]
    })

    this.encuestaClienteForm3 = this.formBuilder.group({
      observacionesCliente: ['', Validators.required],
    })

  }

  public inicio(){
    this.navCtrl.setRoot(MesasPage) // Cambiar por menu principal de cocinero
  }
  public siguiente(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    console.log(this.usuario);
  }
  onIonDrag(event){
    this.slides.lockSwipes(true);
  }

  public anterior(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
  }

  public ir(donde:number){
    this.slides.lockSwipes(false);
    this.slides.slideTo(donde);
  }

  public empezar(tipo:String){
    switch (tipo) {
      case 'empleado':
        this.usuarios = [];
        this.proveedorUsuarios.obtenerUsuarios()
        .subscribe(data =>{
          data.forEach(element => {
            if(element.perfil == 'Cocinero' || element.perfil == 'Mestre' || element.perfil == 'Mozo' || element.perfil == 'Bartender'){
              this.usuarios.push(element);
            }
            else{
              console.log("No entra");
            }
          });
        })
        this.siguiente();
        break;
      case 'cliente':
        this.usuarios = [];
        this.proveedorUsuarios.obtenerUsuarios()
        .subscribe(data =>{
          data.forEach(element =>{
            if(element.perfil == 'Cliente'){
              this.usuarios.push(element);
            }
            else{
              console.log("No entra");
            }
          })
        })
        console.log(this.usuarios);
        this.ir(5);
        break;
      default:
        break;
    }
  }

  public guardarEmpleado(){
    let cargando = this.loadingCtrl.create({
      content: 'Cargando encuesta...'
    })
    cargando.present();
    this.proveedorEncuesta.guardarEncuestaSupervisorEmpleado(
      this.usuarios[0].dni.toString(),
      this.encuestaEmpleadoForm.controls['relacionColegas'].value,
      this.encuestaEmpleadoForm.controls['puntualidad'].value,
      this.encuestaEmpleadoForm.controls['actitud'].value,
      this.encuestaEmpleadoForm.controls['eficacia'].value,
      this.encuestaEmpleadoForm2.controls['rendimiento'].value,
      this.encuestaEmpleadoForm2.controls['calificacion'].value,
      this.encuestaEmpleadoForm3.controls['observaciones'].value,
    )
    .then( data =>{
      cargando.dismiss();
      let cargada = this.esperar(this.creaFondo("¡Encuesta Cargada!", "assets/imgs/logueado.png"));
      cargada.present();
      setTimeout(() => {
        cargada.dismiss();
        this.navCtrl.setRoot(MesasPage);
      }, 4000);
    })
  }

  public guardarCliente(){
    let cargando = this.loadingCtrl.create({
      content: 'Cargando encuesta...'
    })
    cargando.present();
    this.proveedorEncuesta.guardarEncuestaSupervisorCliente(
      this.usuarios[0].dni.toString(),
      this.encuestaClienteForm.controls['servicioCliente'].value,
      this.encuestaClienteForm.controls['amabilidad'].value,
      this.encuestaClienteForm.controls['propina'].value,
      this.encuestaClienteForm.controls['fidelidad'].value,
      this.encuestaClienteForm2.controls['propinaServicio'].value,
      this.encuestaClienteForm2.controls['calificacionCliente'].value,
      this.encuestaClienteForm3.controls['observacionesCliente'].value,
    )
    .then( data =>{
      cargando.dismiss();
      let cargada = this.esperar(this.creaFondo("¡Encuesta Cargada!", "assets/imgs/logueado.png"));
      cargada.present();
      setTimeout(() => {
        cargada.dismiss();
        this.navCtrl.setRoot(MesasPage);
      }, 4000);
    })
  }



  esperar(personalizado?: string): Loading {
    let loading;
    if (!personalizado) {
      loading = this.loadingCtrl.create({

        content: 'Por favor, espere...'
      });
    }
    else {
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    return loading;
  }

  creaFondo(mensaje, imagen) {
    let fondo = `
          <div>
            <ion-row>
              <ion-col>
                <img src="${imagen}">
              </ion-col>
            </ion-row>
            <ion-row>
              <h1> ${mensaje} </h1>
            </ion-row> 
          </div> `;
    return fondo;

  }


}
