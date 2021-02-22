import { ISubPedidoCocina } from "./ISubPedidoCocina";
import { ISubPedidoBebida } from "./ISubPedidoBebida";

export interface IComandaPedido {
  id: number;
  estado: string; //pendiente, derivado, entregado
  subPedidosCocina: ISubPedidoCocina;
  subPedidosBebida: ISubPedidoBebida;
  tiempoMayorEstimado?: number;
  horaDerivado?: number;
}
