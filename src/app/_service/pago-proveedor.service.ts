import { PagoProveedorTransaccionChequeDTO } from '../_model/dto/pagoProveedorTransaccionChequeDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { PagoProveedor } from '../_model/pagoProveedor';

@Injectable({
  providedIn: 'root'
})
export class PagoProveedorService extends GenericService<PagoProveedor> {

  constructor(protected http : HttpClient) {
    super(http, `${environment.HOST}/pagos-proveedores`);
  }

  getByCreditoProveedor(idCreditoProveedor : number) {
    return this.http.get<PagoProveedor[]>(`${this.url}/credito-proveedor/${idCreditoProveedor}`);
  }

  createDTO(pagoProveedorDto : PagoProveedorTransaccionChequeDTO) {
    return this.http.post(`${this.url}/dto`, pagoProveedorDto);
  }
  
}
