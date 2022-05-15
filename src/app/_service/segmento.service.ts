import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Segmento } from '../_model/segmento';

@Injectable({
  providedIn: 'root'
})
export class SegmentoService extends GenericService<Segmento> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/segmentos`);
  }

  getWithCredito() {
    return this.http.get<Segmento[]>(`${this.url}/with-credito`);
  }

  createMod(segmento: Segmento, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, segmento);
  }

  updateMod(segmento: Segmento, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, segmento);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }

}
