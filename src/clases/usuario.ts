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