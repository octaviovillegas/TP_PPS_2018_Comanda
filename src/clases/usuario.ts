export interface Iusuario{
    nombre:string;
    apellido:string;
    dni:number;
    foto:string
    perfil:string;
    email:string;
    cuil?:number;
    id?:any;
}

export class usuario{
    id:number;
    usuario:string;
    perfil:string;
    constructor(id:number, usuario:string, perfil:string){
        this.id = id;
        this.usuario = usuario;
        this.perfil = perfil;
    }
}