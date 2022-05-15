import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Moneda } from '../_model/moneda';

@Injectable({
  providedIn: 'root'
})
export class MonedaService extends GenericService<Moneda> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/monedas`);
   }
}
