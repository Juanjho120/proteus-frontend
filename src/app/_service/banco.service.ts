import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Banco } from '../_model/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends GenericService<Banco> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/bancos`);
  }
}