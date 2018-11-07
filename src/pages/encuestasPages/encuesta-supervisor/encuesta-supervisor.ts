import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import {MesasPage} from '../../mesasPages/mesas/mesas';
import { Iusuario} from '../../../clases/usuario';
import {UsuariosProvider} from '../../../providers/usuarios/usuarios';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorUsuarios: UsuariosProvider,
    public formBuilder: FormBuilder) 
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
    })

    this.encuestaEmpleadoForm3 = this.formBuilder.group({
      observaciones:['', Validators.required]
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
        this.ir(4);
        break;
      default:
        break;
    }
  }

}
