import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Slides  } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Imagen } from '../../clases/imagen';
import { usuario } from '../../clases/usuario';
import { base64 } from '../../clases/base64';
import { Observable } from 'rxjs';
import { forEach } from '@firebase/util';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { LindasPage } from '../lindas/lindas';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
/**
 * Generated class for the FeasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feas',
  templateUrl: 'feas.html',
})
export class FeasPage {
  task: AngularFireUploadTask;
  fotos:any =[];
  progress: any;  // Observable 0 to 100
  usuario:string;
  image: string; // base64
  rutaArchivo:string;
  cosas:Imagen[];
  donde:string;
  cargo:Boolean = false;
  @ViewChild('slides') slides: Slides;
  coleccionCosas:AngularFirestoreCollection<Imagen>;
  ListadoDeCosasObservable:Observable<Imagen[]>;
  x = 0;
  y = 0;
  z = 0;
  constructor(public storage: AngularFireStorage,
              private camera: Camera,
              private db: AngularFirestore,
              private loadingCtrl: LoadingController,
              private params:NavParams,
              private navCtrl: NavController,
              private deviceMotion: DeviceMotion,
             )
  {
    this.usuario = this.params.get('usuario');
    this.donde = this.params.get('donde');
    this.coleccionCosas = this.db.collection<any>(this.donde);
    this.ListadoDeCosasObservable = this.coleccionCosas.snapshotChanges().map(actions =>{
      return actions.map(a =>{
        const data = a.payload.doc.data() as Imagen;
        const id = a.payload.doc.id;
        return {id, ...data};
      })
    });
    this.ListadoDeCosasObservable.subscribe( res =>{
      let ordenados = res.sort((x,y)=>{
        if(y.fecha > x.fecha){
          return 1;
        }
        if(y.fecha < x.fecha){
          return 0;
        }
        return 1;
      });
      setTimeout(() => {
        this.cargo = true;
        this.moverse();
      }, 4000);
      this.cosas = ordenados;
      console.log(this.cosas);
    });
    
  }



  traerCosas(){
    this.coleccionCosas = this.db.collection<Imagen>('feas');
    this.ListadoDeCosasObservable = this.coleccionCosas.valueChanges()
    this.ListadoDeCosasObservable.subscribe(cosasTraidas =>{
      let ordenados = cosasTraidas.sort((x, y)=>{
        if(x.fecha > y.fecha){
          return 1;
        }
        if(x.fecha < y.fecha ){
          return 0;
        }
        return -1;
      })
      this.cosas = ordenados;
      this.cosas.forEach(element => {
        element.fecha;
      });
      this.cargo = true;
    })
  }

  yaCargo(){
    this.cargo = true;
  }

  // Our methods will go here...
  public captureImage() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.CAMERA
      }

      this.camera.getPicture(options)
      .then(data =>{
        this.image = 'data:image/jpg;base64,' + data;
        this.fotos.push(this.image);
        //this.fotos.reverse();
      })
      
  }
  createUploadTask(file: string) {

    this.rutaArchivo = `${this.donde}/${this.usuario}_${ new Date().getTime() }.jpg`;
    this.image = 'data:image/jpg;base64,' + file;
    
    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
  } 

     uploadHandler() {
     //const base64 = await this.captureImage();
     /*
     if(this.fotos.length > 0){
       this.fotos.forEach(element => {
        let fotos: number = this.fotos.length;
        let loading = this.loadingCtrl.create({
          content: `Cargando ${fotos} foto(s)...`
        });

        loading.present();

        this.createUploadTask(element)
        .then(res =>{
          this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
          .then(urlImagen =>{
            this.db.collection(this.donde).add({
              nombreUsuario: this.usuario,
              url: urlImagen,
              votos: 0,
              votantes: [],
              fecha: new Date().getTime(),
            })
            .then(res =>{
              loading.dismiss();
              fotos = fotos - 1;
            })
          })
        })
        this.fotos = [];
       });
     }
     */
    if(this.fotos.length > 0){
      let loading = this.loadingCtrl.create({
        content: `Cargando ${this.fotos.length} foto(s)...`
      });
      loading.present();
      this.createUploadTask(this.fotos[this.fotos.length -1])
      .then(res =>{
        this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
        .then(urlImagen =>{
          this.db.collection(this.donde).add({
            nombreUsuario: this.usuario,
            nombre:new Date().toLocaleString(),
            url: urlImagen,
            votos: 0,
            votantes: [],
            fecha: new Date().getTime(),
          })
          .then(res =>{
            this.fotos.pop();
            loading.dismiss();
            this.uploadHandler();
          })
        })
      })
    }
  }

  public votar(id:any){
    let yaVoto = false;
    console.log(id);
    this.cosas.forEach(element => {
      if(element.id == id){
        if(this.estaEnArray(this.usuario, element.votantes)){
          yaVoto = true;
        }
      }
    });
    if(!yaVoto){
      let imagenVotada:Imagen[];
      imagenVotada = this.cosas.filter(imagenes => imagenes.id == id);
      
      imagenVotada[0].votos = imagenVotada[0].votos + 1;
      imagenVotada[0].votantes.push(this.usuario);
      let corazon:Loading;
      corazon = this.loadingCtrl.create({
        spinner: 'hide',
        content:`<ion-grid>
                    <ion-row text-center>
                      <ion-col>
                        <img class="algo" src="assets/imgs/heart.png">
                      </ion-col>
                    </ion-row>
                  </ion-row>`,
        cssClass: 'my-loading-class'
      });
      corazon.present();
      this.db.collection<Imagen>(this.donde).doc(id).update(imagenVotada[0])
      .then(res =>{
        setTimeout(() => {
          corazon.dismiss();
        }, 2000);
      })
      .catch(res =>{
        console.log("error");
        corazon.dismiss();
        imagenVotada[0].votos = imagenVotada[0].votos -1;
      })
    }
    else if(yaVoto){
      let imagenVotada:Imagen[];
      imagenVotada = this.cosas.filter(imagenes => imagenes.id == id);
      imagenVotada[0].votos = imagenVotada[0].votos -1;
      const index  = imagenVotada[0].votantes.indexOf(this.usuario);
      if(index !== -1){
        imagenVotada[0].votantes.splice(index, 1);
        let corazon:Loading;
        corazon = this.loadingCtrl.create({
          spinner: 'hide',
          content:`<ion-grid>
                      <ion-row text-center>
                        <ion-col>
                          <img class="algo" src="assets/imgs/heartBlanco.png">
                        </ion-col>
                      </ion-row>
                    </ion-row>`,
          cssClass: 'my-loading-class'
        });
        corazon.present();
        this.db.collection<Imagen>(this.donde).doc(id).update(imagenVotada[0])
        .then(res =>{
          setTimeout(() => {
            corazon.dismiss();
          }, 2000);
        })
        .catch(error =>{
          console.log("error");
          corazon.dismiss();
          imagenVotada[0].votos = imagenVotada[0].votos +1;
          imagenVotada[0].votantes.push(this.usuario);
        })
      }
    }
  }

  private estaEnArray(value:any, array:any[]){
    return array.indexOf(value) > -1;
  }

  public ir(){
    if(this.donde == 'feas'){
      this.navCtrl.push(LindasPage,{
        usuario: this.usuario,
        donde: 'feas'
      })
    }
    else if(this.donde = 'lindas'){
      this.navCtrl.push(LindasPage,{
        usuario: this.usuario,
        donde: 'lindas'
      })
    }
  }

  private proximo(){
    this.slides.slideNext();
  }
  private anterior(){
    this.slides.slidePrev();
  }
  private principio(){
    this.slides.slideTo(0);
  }

  private moverse(){
    var options = { frequency:500 };
    let subcripcion = this.deviceMotion.watchAcceleration(options)
    .subscribe((aceleracion)=>{
      this.x = aceleracion.x;
      this.y = aceleracion.y;
      this.z = aceleracion.z;
      if(this.x > 6){
        this.proximo();
      }
      if(this.z > 9){
        this.principio();
      }
      if(this.x < -6){
        this.anterior();
      }
    })
  }
}