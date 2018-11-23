import { UtilProvider } from "./../../../providers/util/util";
import { ComandaProvider } from "./../../../providers/comanda/comanda";
import { IComandaPedido } from "./../../../clases/IComandaPedido";
import { ISubPedidoBebida } from "./../../../clases/ISubPedidoBebida";
import { ISubPedidoCocina } from "./../../../clases/ISubPedidoCocina";
import { IComanda } from "./../../../clases/IComanda";
import { AngularFireList } from "angularfire2/database";
import { VerImagenPedidoPage } from "./../ver-imagen-pedido/ver-imagen-pedido";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  List
} from "ionic-angular";
import { bebidasProvider } from "../../../providers/bebidas/bebidas";
import { platosProvider } from "../../../providers/platos/plato";
import { IPlato } from "./../../../clases/IPlato";
import { ISubpedidoItem } from "../../../clases/ISubpedidoItem";

@IonicPage()
@Component({
  selector: "page-alta-pedido",
  templateUrl: "alta-pedido.html"
})
export class AltaPedidoPage {
  public comanda: IComanda;
  public menu = [];
  public lCalientes: ISubpedidoItem[] = [];
  public lFrios: ISubpedidoItem[] = [];
  public lMinutas: ISubpedidoItem[] = [];
  public lPostres: ISubpedidoItem[] = [];
  public lBebidas: ISubpedidoItem[] = [];

  public mesa: any;
  public tipomenu: any;
  public pedidoACargar: ISubpedidoItem[] = [];
  cant: number;
  public platos: any;

  //CAMPOS COMANDA
  public itemsCocina: { cantidad: number; platoID: number }[] = [];
  public itemsBebida: { cantidad: number; bebidaID: number }[] = [];
  public tiemposEstimadosDelPedido = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popCtrl: PopoverController,
    public _platosProvider: platosProvider,
    public _bebidasProvider: bebidasProvider,
    public _comandas: ComandaProvider,
    public UtilProvider: UtilProvider
  ) {
    this.traerMenuPorCategoria("Minutas");

    this.mesa = this.navParams.get("mesa");
    this.comanda = this.navParams.get("comanda");
    this.tipomenu = "minutas";
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AltaPedidoPage');
  }

  cargarLista(item: IPlato, cantidad: number): ISubpedidoItem {
    let pedido: ISubpedidoItem = {
      nombre: item.nombre,
      id: item.id,
      tiempoEstimado: item.tiempoEstimado,
      importe: item.importe,
      categoria: item.categoria,
      descripcion: item.descripcion,
      ingredientesFoto: item.ingredientesFoto,
      preparacionFoto: item.preparacionFoto,
      preparadoFoto: item.preparadoFoto,
      idSubpedido: 0,
      cantidad: cantidad
    };
    return pedido;
  }

  existeMenu(categoria: string): boolean {
    switch (categoria) {
      case "Minutas":
        if (this.lMinutas.length > 0) {
          return true;
        }
        break;

      case "Calientes":
        if (this.lCalientes.length > 0) {
          return true;
        }
        break;

      case "Frios":
        if (this.lFrios.length > 0) {
          return true;
        }
        break;

      case "Postres":
        if (this.lPostres.length > 0) {
          return true;
        }
        break;

      case "Bebidas":
        if (this.lBebidas.length > 0) {
          return true;
        }
        break;
    }

    return false;
  }

  traerMenuPorCategoria(categoria: string) {
    if (!this.existeMenu(categoria)) {
      this._platosProvider.traerPlatos(categoria).subscribe(dataPlatos => {
        // console.log("CATEGORIA");
        // console.log(categoria);
        // console.log(dataPlatos);

        switch (categoria) {
          case "Minutas":
            if (this.lMinutas.length > 0) {
              let listaAux: ISubpedidoItem[] = this.lMinutas;
              let itemAux: ISubpedidoItem = null;

              this.lMinutas = [];
              dataPlatos.forEach((item: IPlato) => {
                itemAux = listaAux.find(i => i.id == item.id);

                if (itemAux != null)
                  //ya estaba en la lista
                  this.lMinutas.push(this.cargarLista(item, itemAux.cantidad));
                else this.lMinutas.push(this.cargarLista(item, 0));

                if (!this.lMinutas.some(p => p.id === item.id)) {
                  this.lMinutas.push(this.cargarLista(item, 0));
                }
              });
            } else {
              dataPlatos.forEach((item: IPlato) => {
                if (!this.lMinutas.some(p => p.id === item.id)) {
                  this.lMinutas.push(this.cargarLista(item, 0));
                }
              });
            }

            break;
          case "Calientes":
            if (this.lCalientes.length > 0) {
              let listaAux: ISubpedidoItem[] = this.lCalientes;
              let itemAux: ISubpedidoItem = null;

              this.lCalientes = [];
              dataPlatos.forEach((item: IPlato) => {
                itemAux = listaAux.find(i => i.id == item.id);

                if (itemAux != null)
                  this.lCalientes.push(
                    this.cargarLista(item, itemAux.cantidad)
                  );
                else this.lCalientes.push(this.cargarLista(item, 0));

                if (!this.lCalientes.some(p => p.id === item.id)) {
                  this.lCalientes.push(this.cargarLista(item, 0));
                }
              });
            } else {
              dataPlatos.forEach((item: IPlato) => {
                if (!this.lCalientes.some(p => p.id === item.id)) {
                  this.lCalientes.push(this.cargarLista(item, 0));
                }
              });
            }

            break;
          case "Frios":
            if (this.lFrios.length > 0) {
              let listaAux: ISubpedidoItem[] = this.lFrios;
              let itemAux: ISubpedidoItem = null;

              this.lFrios = [];
              dataPlatos.forEach((item: IPlato) => {
                itemAux = listaAux.find(i => i.id == item.id);

                if (itemAux != null)
                  this.lFrios.push(this.cargarLista(item, itemAux.cantidad));
                else this.lFrios.push(this.cargarLista(item, 0));

                if (!this.lFrios.some(p => p.id === item.id)) {
                  this.lFrios.push(this.cargarLista(item, 0));
                }
              });
            } else {
              dataPlatos.forEach((item: IPlato) => {
                if (!this.lFrios.some(p => p.id === item.id)) {
                  this.lFrios.push(this.cargarLista(item, 0));
                }
              });
            }

            break;
          case "Postres":
            if (this.lPostres.length > 0) {
              let listaAux: ISubpedidoItem[] = this.lPostres;
              let itemAux: ISubpedidoItem = null;

              this.lPostres = [];
              dataPlatos.forEach((item: IPlato) => {
                itemAux = listaAux.find(i => i.id == item.id);

                if (itemAux != null)
                  this.lPostres.push(this.cargarLista(item, itemAux.cantidad));
                else this.lPostres.push(this.cargarLista(item, 0));

                if (!this.lPostres.some(p => p.id === item.id)) {
                  this.lPostres.push(this.cargarLista(item, 0));
                }
              });
            } else {
              dataPlatos.forEach((item: IPlato) => {
                if (!this.lPostres.some(p => p.id === item.id)) {
                  this.lPostres.push(this.cargarLista(item, 0));
                }
              });
            }

            break;
        }
      });
    }
  }

  traerMenuBebidas() {
    if (!this.existeMenu("Bebidas")) {
      this._bebidasProvider.traerBebidas().subscribe(dataBebidas => {
        if (this.lBebidas.length > 0) {
          let listaAux: ISubpedidoItem[] = this.lBebidas;
          let itemAux: ISubpedidoItem = null;

          this.lBebidas = [];
          dataBebidas.forEach((item: IPlato) => {
            itemAux = listaAux.find(i => i.id == item.id);

            if (itemAux != null)
              this.lBebidas.push(this.cargarLista(item, itemAux.cantidad));
            else this.lBebidas.push(this.cargarLista(item, 0));

            if (!this.lBebidas.some(p => p.id === item.id)) {
              this.lBebidas.push(this.cargarLista(item, 0));
            }
          });
        } else {
          dataBebidas.forEach((item: IPlato) => {
            if (!this.lBebidas.some(p => p.id === item.id)) {
              this.lBebidas.push(this.cargarLista(item, 0));
            }
          });
        }
      });
    }
  }

  seleccionarPedido(item: any, value: number) {
    // if (this.pedido.some(p => p.id === item.id)) {
    //   for (var i = 0; i < this.pedido.length; i++) {
    //     if (this.pedido[i].id === item.id) {
    //       this.pedido[i].cantidad += value;
    //       if (this.pedido[i].cantidad == 0) {
    //         this.pedido.splice(i, 1);
    //       }
    //       break;
    //     }
    //   }
    // }
    // else {
    //   this.pedido.push({
    //     "id": item.id,
    //     "nombre:": item.nombre,
    //     "descripcion": item.descripcion,
    //     "cantidad": 1
    //   })
    // }
    // console.log(this.pedido);
  }

  sumarCantidad(item: ISubpedidoItem, value: number) {
    item.cantidad = item.cantidad + value;
    console.log(item.cantidad);
  }
  restarCantidad(item: ISubpedidoItem, value: number) {
    if (item.cantidad > 0) {
      item.cantidad = item.cantidad + value;
    }
  }

  mostrarImagenes(
    fotoIngredientes: any,
    fotoPreparacion: any,
    fotoPreparado: any
  ) {
    // console.log(fotoIngredientes);
    // console.log(fotoPreparacion);
    // console.log(fotoPreparado);

    const popover = this.popCtrl.create(VerImagenPedidoPage, {
      fIngredientes: fotoIngredientes,
      fPreparacion: fotoPreparacion,
      fPreparado: fotoPreparado
    });
    popover.present();
  }
  getItems(ev: any) {
    //this.inicializarItemsMenu();
    const val = ev.target.value;

    console.log(this.tipomenu);
    if (val && val.trim() != "") {
      this.lCalientes = this.lCalientes.filter(item => {
        return item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
  inicializarItemsMenu() {
    // this.menu = [
    //   {
    //     "id": 1,
    //     "nombre": "Milanesas con pure",
    //     "descripcion": "Ternera rebozada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 2,
    //     "nombre": "Suprema con papas",
    //     "descripcion": "Pechuga de pollo rebozada con papas fritas",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 3,
    //     "nombre": "Ensalada cesar",
    //     "descripcion": "Ensalada de lechuga, pollo con salsa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 4,
    //     "nombre": "Mozzarella individual",
    //     "descripcion": "Ternera empanada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 5,
    //     "nombre": "Filet de merluza con pure",
    //     "descripcion": "Merluza empanada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 6,
    //     "nombre": "Ravioles",
    //     "descripcion": "Ternera empanada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 7,
    //     "nombre": "Coca Cola",
    //     "descripcion": "Cocacola 330 ml",
    //     "precio": 20,
    //     "categoria": 3
    //   },
    //   {
    //     "id": 8,
    //     "nombre": "Pepsi",
    //     "descripcion": "Pepsi 330ml",
    //     "precio": 20,
    //     "categoria": 3
    //   },
    //   {
    //     "id": 9,
    //     "nombre": "Vitel tone",
    //     "descripcion": "Peceto con salsa de atun",
    //     "precio": 20,
    //     "categoria": 2
    //   },
    //   {
    //     "id": 10,
    //     "nombre": "Ensalada rusa",
    //     "descripcion": "Zanahoria, Papa y arvejas con mayonesa",
    //     "precio": 20,
    //     "categoria": 2
    //   }
    // ];
  }

  agregarPedido() {
    let estadoCocina: string = "";
    let estadoBebida: string = "";
    let comandaPedido: IComandaPedido;
    let comandaPedidos: IComandaPedido[];

    this.cargarItemsSubpedidos(this.lMinutas);
    this.cargarItemsSubpedidos(this.lFrios);
    this.cargarItemsSubpedidos(this.lCalientes);
    this.cargarItemsSubpedidos(this.lPostres);
    this.cargarItemsSubpedidos(this.lBebidas);

    //Aca tengo cargados los items categorizados
    //Si hay items cargados le doy el estado Pendiente, sino Nada (porque en los pedidos de la comanda van a haber 2 subitems)
    if (this.itemsCocina.length > 0) estadoCocina = "Pendiente";
    else estadoCocina = "Nada";

    if (this.itemsBebida.length > 0) estadoBebida = "Pendiente";
    else estadoBebida = "Nada";

    let subCocina: ISubPedidoCocina = {
      id: new Date().valueOf(),
      estado: estadoCocina,
      items: this.itemsCocina
    };

    let subBebida: ISubPedidoBebida = {
      id: new Date().valueOf(),
      estado: estadoBebida,
      items: this.itemsBebida
    };

    let tiempoMayorEstimado = Math.max(...this.tiemposEstimadosDelPedido);

    comandaPedido = {
      id: new Date().valueOf(),
      estado: "Pendiente",
      subPedidosBebida: subBebida,
      subPedidosCocina: subCocina,
      tiempoMayorEstimado: tiempoMayorEstimado
    };

    if (this.comanda.pedidos != null) {
      this.comanda.pedidos.push(comandaPedido);
    } else {
      comandaPedidos = [comandaPedido];
      this.comanda.pedidos = comandaPedidos;
    }

    this._comandas.actualizarComanda(this.comanda).then(
      () => {
        //this.UtilProvider.mostrarMensaje("Se cargó el pedido");

        //this.navParams.get("parentPage").inicializar();

        setTimeout(() => {
          this.navCtrl.pop();
        }, 2000);
      },
      () => {
        this.UtilProvider.mostrarMensaje("Reintente por favor");
      }
    );
  }

  cargarSubpedidos() {}

  cargarItemsSubpedidos(itemsSeleccionados: ISubpedidoItem[]) {
    itemsSeleccionados
      .filter(item => item.cantidad > 0)
      .forEach((i: ISubpedidoItem) => {
        //Cargo los items discriminados por categoria Bebidas o Platos
        if (i.categoria == "Bebidas") {
          this.itemsBebida.push({ cantidad: i.cantidad, bebidaID: i.id });
          this.tiemposEstimadosDelPedido.push(i.tiempoEstimado);
        } else {
          this.itemsCocina.push({ cantidad: i.cantidad, platoID: i.id });
          this.tiemposEstimadosDelPedido.push(i.tiempoEstimado);
        }

        // this.pedidoACargar.push(i);
      });
  }
}
