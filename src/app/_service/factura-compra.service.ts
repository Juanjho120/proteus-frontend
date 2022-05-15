import { FacturaCompraDTO } from './../_model/dto/facturaCompraDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { FacturaCompra } from '../_model/facturaCompra';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraService extends GenericService<FacturaCompra> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/facturas-compras`);
  }

  getAllNotInInventarios() {
    return this.http.get<FacturaCompraDTO[]>(`${this.url}/dto/not-in-inventarios`);
  }

  getByProveedor(idProveedor : number) {
    return this.http.get<FacturaCompra[]>(`${this.url}/proveedor/${idProveedor}`);
  }

  getByFecha(fechaDesde : string, fechaHasta : string) {
    return this.http.get<FacturaCompra[]>(`${this.url}/fecha/${fechaDesde}/${fechaHasta}`);
  }

  getByRepuesto(idRepuesto : number) {
    return this.http.get<FacturaCompra[]>(`${this.url}/repuesto/${idRepuesto}`);
  }

  getByVencimiento(vencida : boolean) {
    return this.http.get<FacturaCompra[]>(`${this.url}/vencimiento/${vencida}`);
  }

  getNotInCreditoProveedorDetalle() {
    return this.http.get<FacturaCompra[]>(`${this.url}/not-in-credito-proveedor`);
  }
  
}
