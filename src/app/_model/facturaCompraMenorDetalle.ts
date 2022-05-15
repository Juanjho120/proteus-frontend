import { FacturaCompraMenor } from './facturaCompraMenor';
export class FacturaCompraMenorDetalle {
    idFacturaCompraMenorDetalle : number;
    facturaCompraMenor : FacturaCompraMenor;
    cantidad : number;
    descripcion : string;
    costoCompra : number;
    costoVenta : number;
}