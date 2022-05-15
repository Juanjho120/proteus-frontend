import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Transaccion } from './../_model/transaccion';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService extends GenericService<Transaccion> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/transacciones`);
  }
}
