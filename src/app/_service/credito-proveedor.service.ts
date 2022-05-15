import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { CreditoProveedor } from '../_model/creditoProveedor';

@Injectable({
  providedIn: 'root'
})
export class CreditoProveedorService extends GenericService<CreditoProveedor> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/creditos-proveedores`);
  }

  getByProveedor(idProveedor : number) {
    return this.http.get<CreditoProveedor>(`${this.url}/proveedor/${idProveedor}`);
  }

}
