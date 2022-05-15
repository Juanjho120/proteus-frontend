import { FacturaCompra } from './facturaCompra';
import { InventarioDetalle } from './inventarioDetalle';
import { Concepto } from './concepto';
import { Usuario } from './usuario';
import { Sucursal } from './sucursal';
export class Inventario {
    idInventario : number;
    usuario : Usuario;
    facturaCompra : FacturaCompra;
    concepto : Concepto;
    razon : string;
    cantidad : number;
    fechaHora : string;
    inventarioDetalle : InventarioDetalle[];
    sucursal: Sucursal;
}