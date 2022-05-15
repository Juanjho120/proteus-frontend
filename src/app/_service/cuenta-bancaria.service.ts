import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { CuentaBancaria } from '../_model/cuentaBancaria';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService extends GenericService<CuentaBancaria> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/cuentas-bancarias`);
  }

  getByCategoria(idCategoria : number) {
    return this.http.get<CuentaBancaria[]>(`${this.url}/categoria/${idCategoria}`);
  }

  getByCategoriaAndItem(idCategoria : number, idItem : number) {
    return this.http.get<CuentaBancaria[]>(`${this.url}/categoria/${idCategoria}/item/${idItem}`);
  }

  getByBanco(idBanco : number) {
    return this.http.get<CuentaBancaria[]>(`${this.url}/banco/${idBanco}`);
  }

  getByMoneda(idMoneda : number) {
    return this.http.get<CuentaBancaria[]>(`${this.url}/moneda/${idMoneda}`);
  }

  getByNombreLike(nombre : string) {
    return this.http.get<CuentaBancaria[]>(`${this.url}/nombre/${nombre}`);
  }

  getByCuentaBancariaTipo(idCuentaBancariaTipo : number) {
    return this.http.get<CuentaBancaria[]>(`${this.url}/tipo/${idCuentaBancariaTipo}`);
  }
}
