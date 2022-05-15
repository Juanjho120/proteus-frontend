import { SegmentoPagoTransaccionChequeDTO } from './../_model/dto/segmentoPagoTransaccionChequeDTO';
import { SegmentoPagoDTO } from './../_model/dto/segmentoPagoDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { SegmentoPago } from '../_model/segmentoPago';

@Injectable({
  providedIn: 'root'
})
export class SegmentoPagoService extends GenericService<SegmentoPago> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/segmento-pagos`);
  }

  getBySegmento(idSegmento : number) {
    return this.http.get<SegmentoPago[]>(`${this.url}/segmento/${idSegmento}`);
  }

  getDTOBySegmento(idSegmento : number) {
    return this.http.get<SegmentoPagoDTO[]>(`${this.url}/dto/segmento/${idSegmento}`);
  }

  createDTO(segmentoPagoDto : SegmentoPagoTransaccionChequeDTO) {
    return this.http.post(`${this.url}/dto`, segmentoPagoDto);
  }

}
