import { Usuario } from "./usuario";

export class Autorizacion {
    idAutorizacion: number;
    fechaHora: string;
    responsable: Usuario;
    autorizado: Usuario;
    razon: string;
    descripcion: string;
}