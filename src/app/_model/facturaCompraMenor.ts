import { FacturaCompraMenorDetalle } from './facturaCompraMenorDetalle';
import { Servicio } from 'src/app/_model/servicio';
import { ProveedorMenor } from 'src/app/_model/proveedorMenor';
export class FacturaCompraMenor {
    idFacturaCompraMenor : number;
    proveedorMenor : ProveedorMenor;
    codigo : string;
    fecha : string;
    total : number;
    servicio : Servicio;
    facturaCompraMenorDetalle : FacturaCompraMenorDetalle[];
}