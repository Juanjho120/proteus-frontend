import { FacturaSegmentoDTO } from './../_model/dto/facturaSegmentoDTO';
import { SegmentoCreditoDetalleDTO } from './../_model/dto/segmentoCreditoDetalleDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { SegmentoCreditoDetalle } from '../_model/segmentoCreditoDetalle';

@Injectable({
  providedIn: 'root'
})
export class SegmentoCreditoDetalleService extends GenericService<SegmentoCreditoDetalle> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/segmento-credito-detalles`);
  }

  getBySegmento(idSegmento : number) {
    return this.http.get<SegmentoCreditoDetalle[]>(`${this.url}/segmento/${idSegmento}`);
  }

  getBySegmentoAndSucursal(idSegmento : number, idSucursal : number) {
    return this.http.get<SegmentoCreditoDetalle[]>(`${this.url}/segmento/${idSegmento}/sucursal/${idSucursal}`);
  }

  getBySegmentoSinPagar(idSegmento : number) {
    return this.http.get<SegmentoCreditoDetalle[]>(`${this.url}/saldo-pendiente/segmento/${idSegmento}`);
  }

  getFacturaBySegmento(idSegmento : number) {
    return this.http.get<FacturaSegmentoDTO[]>(`${this.url}/factura/segmento/${idSegmento}`);
  }

  getFacturaByFechaEmision(fechaDesde : string, fechaHasta : string) {
    return this.http.get<FacturaSegmentoDTO[]>(`${this.url}/factura/fecha-emision/${fechaDesde}/${fechaHasta}`);
  }
  
}
