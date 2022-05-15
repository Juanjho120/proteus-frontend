import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacturaAnulada } from '../_model/facturaAnulada';

@Injectable({
  providedIn: 'root'
})
export class FacturaAnuladaService extends GenericService<FacturaAnulada> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/facturas-anuladas`);
  }
}