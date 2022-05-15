import { MarcaRepuesto } from './marcaRepuesto';
import { Repuesto } from './repuesto';
export class FacturaCompraDetalle {
    idFacturaCompraDetalle : number;
    repuesto : Repuesto;
    marcaRepuesto : MarcaRepuesto;
    cantidad : number;
    costoUnitario : number;
    costoTotal : number;
}