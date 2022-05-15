import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Cheque } from './../_model/cheque';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChequeService extends GenericService<Cheque> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/cheques`);
  }

  getByBanco(idBanco : number) {
    return this.http.get<Cheque[]>(`${this.url}/banco/${idBanco}`);
  }

  getByCuentaBancaria(idCuentaBancaria : number) {
    return this.http.get<Cheque[]>(`${this.url}/cuenta-bancaria/${idCuentaBancaria}`);
  }

  getInBoletas() {
    return this.http.get<Cheque[]>(`${this.url}/in-boletas`);
  }

  getNotInBoletas() {
    return this.http.get<Cheque[]>(`${this.url}/not-in-boletas`);
  }

  getNotInBoletasExceptCheque(idCheque : number) {
    return this.http.get<Cheque[]>(`${this.url}/not-in-boletas/except/${idCheque}`);
  }

  getByNombre(nombre : string) {
    return this.http.get<Cheque[]>(`${this.url}/nombre/${nombre}`);
  }

  getByNumero(numero : string) {
    return this.http.get<Cheque[]>(`${this.url}/numero/${numero}`);
  }

  getByFechaEmision(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Cheque[]>(`${this.url}/fecha-emision/${fechaDesde}/${fechaHasta}`);
  }

  getByFechaDeposito(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Cheque[]>(`${this.url}/fecha-deposito/${fechaDesde}/${fechaHasta}`);
  }
  
}
