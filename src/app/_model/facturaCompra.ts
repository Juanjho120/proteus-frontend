import { ProveedorMenor } from 'src/app/_model/proveedorMenor';
import { FacturaCompraDetalle } from './facturaCompraDetalle';
import { Proveedor } from './proveedor';
import { Sucursal } from './sucursal';
export class FacturaCompra {
    idFacturaCompra : number;
    proveedor : Proveedor;
    proveedorMenor : ProveedorMenor;
    codigo : string;
    fecha : string;
    total : number;
    retencionIva : number;
    totalNeto : number;
    sucursal: Sucursal;
    facturaCompraDetalle : FacturaCompraDetalle[];
}