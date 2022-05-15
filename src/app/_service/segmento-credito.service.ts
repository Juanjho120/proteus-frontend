import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { SegmentoCredito } from '../_model/segmentoCredito';

@Injectable({
  providedIn: 'root'
})
export class SegmentoCreditoService extends GenericService<SegmentoCredito> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/segmento-creditos`);
  }

  getBySegmento(idSegmento : number) {
    return this.http.get<SegmentoCredito>(`${this.url}/segmento/${idSegmento}`);
  }
}
