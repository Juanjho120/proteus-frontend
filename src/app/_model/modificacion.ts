import { Usuario } from './usuario';
import { Concepto } from './concepto';
export class Modificacion {
    idModificacion : number;
    concepto : Concepto;
    tabla : string;
    columna : string;
    usuario : Usuario;
    fechaHora : string;
    valorAnterior : string;
    valorActual : string;
    idItem : number;
}