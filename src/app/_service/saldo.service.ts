import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Saldo } from './../_model/saldo';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaldoService extends GenericService<Saldo> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/saldos`);
  }

  getByNombre(nombre : string) {
    return this.http.get<Saldo>(`${this.url}/nombre/${nombre}`);
  }

}
