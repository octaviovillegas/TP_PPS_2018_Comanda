import { IPlato } from "./IPlato";

export interface ISubpedidoItem extends IPlato {
    idSubpedido: number;
    cantidad: number;
}