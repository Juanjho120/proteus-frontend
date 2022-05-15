import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { SegmentoPagoDetalle } from './../_model/segmentoPagoDetalle';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SegmentoPagoDetalleService extends GenericService<SegmentoPagoDetalle> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/segmento-pago-detalles`);
  }
}
