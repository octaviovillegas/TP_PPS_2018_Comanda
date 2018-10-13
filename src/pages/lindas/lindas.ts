import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Label, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { usuario } from '../../clases/usuario';
import { cosas } from '../../clases/cosas';
import { Imagen } from '../../clases/imagen';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { ModalController } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import {ModalPage} from '../modal/modal';

/**
 * Generated class for the LindasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lindas',
  templateUrl: 'lindas.html',
})
export class LindasPage {
  @ViewChild('lindasCanvas') lindasCanvas;
  cosas:Imagen[];
  
  usuario:usuario;
  
  
  
  donde:string;
  coleccionCosas:AngularFirestoreCollection<Imagen>;
  ListadoDeCosasObservable:Observable<Imagen[]>;
  data:any;
  constructor(public storage: AngularFireStorage,
              
              private db: AngularFirestore,
              private loadingCtrl: LoadingController,
              private params:NavParams,
              private navCtrl: NavController,
              private modalCtrl: ModalController)
  {
    this.usuario = this.params.get('usuario');
    this.donde = this.params.get('donde');
    /*
    this.ListadoDeCosasObservable = this.coleccionCosas.snapshotChanges().map(actions =>{
      return actions.map(a =>{
        const data = a.payload.doc.data() as Imagen;
        const id = a.payload.doc.id;
        return {id, ...data};
      })
    });
    this.ListadoDeCosasObservable.subscribe( res =>{
      this.cosas = res;
    })
    */
    this.db.collection<Imagen>(this.donde, ref => ref.orderBy('votos', 'desc')).valueChanges()
    .subscribe(res =>{
      this.cosas = res;
      let etiquetas = [];
      let datos = [];
      let etiqueta = "votos";
      if(this.donde == 'feas'){
        var fotos = this.cosas;
        var cargador  = this.loadingCtrl;
        var modalo = this.modalCtrl;
        var visualizador = ModalPage;
        this.cosas.forEach(element => {
          etiquetas.push(element.nombre);
          datos.push(element.votos);
        });
        var myChart = HighCharts.chart('container',{
          title:{
            text:'Fotos feas más votadas'
          },
          xAxis: {
            categories: etiquetas,
          },
          yAxis: {
            title: {
              text: 'cantidad'
            }
          },
          series:[{
            type:'bar',
            name:"Votos",
            data: datos,
            point:{
              events:{
                click: function(event){
                  let foto =fotos.filter(foto => foto.nombre === this.category);
                  
                  let modalPage = modalo.create(visualizador,{
                    foto:foto[0].url,
                    usuario: foto[0].nombreUsuario,
                    nombre:foto[0].nombre,
                  });

                  modalPage.present();
                  
                }
              }
            }
          }]
  
        })        
      }
      else if( this.donde == 'lindas'){
        var fotos = this.cosas;
        var cargador  = this.loadingCtrl;
        var modalo = this.modalCtrl;
        var visualizador = ModalPage;
        let total = 0;
        this.cosas.forEach(element => {
          total += element.votos;
        });
        this.cosas.forEach(element => {
          etiquetas.push(element.nombre);
          let serie = [element.nombre, this.calcular(total, element.votos), element.url]
          datos.push(serie);
        });
        let myChart = HighCharts.chart('container',{
          title:{
            text:'Fotos lindas más votadas'
          },
          tooltip:{
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
          },
          series:[
            {
              "data":datos,
              type:'pie',
              size:250,
              point:{
                events:{
                  click: function(event){
                    let foto =fotos.filter(foto => foto.nombre === this.name);
                    
                    let modalPage = modalo.create(visualizador,{
                      foto:foto[0].url,
                      usuario: foto[0].nombreUsuario,
                      nombre:foto[0].nombre,
                    });
                    
                    modalPage.present();

                  }
                }
              }
            }
          ]
        });
      }
    })

  }

  private calcular(total:number, numero:number){
    let porcentaje = numero * 100;
    porcentaje = porcentaje / total;
    return porcentaje;
  }



}
