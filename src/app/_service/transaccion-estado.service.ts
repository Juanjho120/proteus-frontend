import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { TransaccionEstado } from './../_model/transaccionEstado';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionEstadoService extends GenericService<TransaccionEstado> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/transaccion-estados`);
  }
}
