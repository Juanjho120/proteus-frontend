import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Boleta } from './../_model/boleta';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoletaService extends GenericService<Boleta> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/boletas`);
  }

  getByCheque(idCheque : number) {
    return this.http.get<Boleta[]>(`${this.url}/cheque/${idCheque}`);
  }

  getByBanco(idBanco : number) {
    return this.http.get<Boleta[]>(`${this.url}/banco/${idBanco}`);
  }

  getByCuentaBancaria(idCuentaBancaria : number) {
    return this.http.get<Boleta[]>(`${this.url}/cuenta-bancaria/${idCuentaBancaria}`);
  }

  getByNumero(numero : string) {
    return this.http.get<Boleta[]>(`${this.url}/numero/${numero}`);
  }

  getByBoletaTipoDocumento(idBoletaTipoDocumento : number) {
    return this.http.get<Boleta[]>(`${this.url}/boleta-tipo-documento/${idBoletaTipoDocumento}`);
  }

  getByFecha(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Boleta[]>(`${this.url}/fecha/${fechaDesde}/${fechaHasta}`);
  }
}
