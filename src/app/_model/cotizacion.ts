import { CotizacionRepuesto } from './cotizacionRepuesto';
import { CotizacionTrabajo } from './cotizacionTrabajo';
import { Segmento } from './segmento';
import { Usuario } from './usuario';
export class Cotizacion {
    idCotizacion : number;
    usuario : Usuario;
    segmento : Segmento;
    fechaHora : string;
    total : number;
    cotizacionTrabajo : CotizacionTrabajo[];
    cotizacionRepuesto : CotizacionRepuesto[];
}