import { SegmentoCreditoDetalle } from 'src/app/_model/segmentoCreditoDetalle';
import { SegmentoPago } from './segmentoPago';
export class SegmentoPagoDetalle {
    idSegmentoPagoDetalle : number;
    segmentoPago : SegmentoPago;
    segmentoCreditoDetalle : SegmentoCreditoDetalle;
}