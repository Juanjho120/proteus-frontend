import { Servicio } from './servicio';
import { SegmentoCredito } from './segmentoCredito';
export class SegmentoCreditoDetalle {
    idSegmentoCreditoDetalle : number;
    segmentoCredito : SegmentoCredito;
    facturaNumero : string;
    facturaSerie : string;
    servicio : Servicio;
    fechaHoraEmision : string;
    totalFacturado : number;
    totalRestante : number;
    totalPagado : number;
}