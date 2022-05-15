import { FacturaCompraMenor } from './facturaCompraMenor';
import { ComprobanteTipo } from './comprobanteTipo';
import { Personal } from './personal';
import { Concepto } from './concepto';
export class CajaChica {
    idCajaChica : number;
    fechaIngreso : string;
    concepto : Concepto;
    monto : number;
    autoriza : Personal;
    recibe : Personal;
    descripcion : string;
    comprobanteTipo : ComprobanteTipo;
    numeroComprobante : string;
    facturaCompraMenor : FacturaCompraMenor;
}