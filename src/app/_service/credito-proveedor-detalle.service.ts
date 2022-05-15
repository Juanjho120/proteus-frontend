import { FacturaProveedorDTO } from './../_model/dto/facturaProveedorDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { CreditoProveedorDetalle } from '../_model/creditoProveedorDetalle';

@Injectable({
  providedIn: 'root'
})
export class CreditoProveedorDetalleService extends GenericService<CreditoProveedorDetalle> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/credito-proveedor-detalles`);
  }

  getByCreditoProveedor(idCreditoProveedor : number) {
    return this.http.get<CreditoProveedorDetalle[]>(`${this.url}/credito-proveedor/${idCreditoProveedor}`);
  }

  getByCreditoProveedorAndPagada(idCreditoProveedor : number, pagada : boolean) {
    return this.http.get<CreditoProveedorDetalle[]>(`${this.url}/credito-proveedor/${idCreditoProveedor}/pagada/${pagada}`);
  }

  getByCreditoProveedorAndSucursalAndPagada(idCreditoProveedor : number, idSucursal : number, pagada : boolean) {
    return this.http.get<CreditoProveedorDetalle[]>(`${this.url}/credito-proveedor/${idCreditoProveedor}/sucursal/${idSucursal}/pagada/${pagada}`);
  }

  getByPagada(pagada : boolean) {
    return this.http.get<CreditoProveedorDetalle[]>(`${this.url}/pagada/${pagada}`);
  }

  checkVencimiento() {
    return this.http.put(`${this.url}/check-vencimiento`, null);
  }

  getFacturaByProveedor(idProveedor : number) {
    return this.http.get<FacturaProveedorDTO[]>(`${this.url}/factura/proveedor/${idProveedor}`);
  }

  getFacturaByFecha(fechaDesde : string, fechaHasta : string) {
    return this.http.get<FacturaProveedorDTO[]>(`${this.url}/factura/fecha-factura/${fechaDesde}/${fechaHasta}`);
  }
  
}
