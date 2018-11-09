import { ISubPedido } from "./ISubPedido";

export interface ISubPedidoCocina extends ISubPedido {

    items: {
        cantidad:number;
        platoID:number;
    }[]
}