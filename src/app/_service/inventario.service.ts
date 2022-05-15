import { ProductoEntradaSalidaDTO } from './../_model/dto/productoEntradaSalidaDTO';
import { InventarioEntradaSalidaDTO } from './../_model/dto/inventarioEntradaSalidaDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Inventario } from '../_model/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService extends GenericService<Inventario>{

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/inventarios`);
  }

  getByConcepto(idConcepto : number) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}`);
  }

  getByFacturaCompraCodigoLike(codigo : string) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}`);
  }

  getByConceptoAndRepuesto(idConcepto : number, idRepuesto : number) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/repuesto/${idRepuesto}`);
  }

  getByFacturaCompraCodigoLikeAndRepuesto(codigo : string, idRepuesto : number) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/repuesto/${idRepuesto}`);
  }

  getByConceptoAndRepuestoAndUsuario(idConcepto : number, idRepuesto : number, idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/repuesto/${idRepuesto}/usuario/${idUsuario}`);
  }

  getByFacturaCompraCodigoLikeAndRepuestoAndServicioCorrelativoLike(codigo : string, idRepuesto : number, correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/repuesto/${idRepuesto}/servicio/correlativo/${correlativo}`);
  }

  getByConceptoAndRepuestoAndFecha(idConcepto : number, idRepuesto : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByFacturaCompraCodigoLikeAndRepuestoAndFecha(codigo : string, idRepuesto : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByConceptoAndRepuestoAndFechaAndUsuario(idConcepto : number, idRepuesto : number, fechaDesde : string, fechaHasta : string, idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}/usuario/${idUsuario}`);
  }

  getByFacturaCompraCodigoLikeAndRepuestoAndFechaAndServicioCorrelativoLike(codigo : string, idRepuesto : number, fechaDesde : string, fechaHasta : string, correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}/servicio/correlativo/${correlativo}`);
  }

  getByConceptoAndUsuario(idConcepto : number, idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/usuario/${idUsuario}`);
  }

  getByFacturaCompraCodigoLikeAndServicioCorrelativoLike(codigo : string, correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/servicio/correlativo/${correlativo}`);
  }

  getByFechaRango(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByConceptoAndFechaRango(idConcepto : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByFacturaCompraCodigoLikeAndFechaRango(codigo : string, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByConceptoAndFechaAndUsuario(idConcepto : number, fechaDesde : string, fechaHasta : string, idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/concepto/${idConcepto}/fecha-rango/${fechaDesde}/${fechaHasta}/usuario/${idUsuario}`);
  }

  getByFacturaCompraCodigoLikeAndFechaAndServicioCorrelativoLike(codigo : string, fechaDesde : string, fechaHasta : string, correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/factura-compra/codigo/${codigo}/fecha-rango/${fechaDesde}/${fechaHasta}/servicio/correlativo/${correlativo}`);
  }

  getByRepuesto(idRepuesto : number) {
    return this.http.get<Inventario[]>(`${this.url}/repuesto/${idRepuesto}`);
  }

  getByRepuestoAndUsuario(idRepuesto : number, idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/repuesto/${idRepuesto}/usuario/${idUsuario}`);
  }

  getByRepuestoAndServicioCorrelativoLike(idRepuesto : number, correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/repuesto/${idRepuesto}/servicio/correlativo/${correlativo}`);
  }

  getByRepuestoAndFechaRango(idRepuesto : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getProductoEntradaSalidaDTO(idRepuesto : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<ProductoEntradaSalidaDTO[]>(`${this.url}/entradas-salidas-producto/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByRepuestoAndFechaAndUsuario(idRepuesto : number, fechaDesde : string, fechaHasta : string, idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}/usuario/${idUsuario}`);
  }

  getByRepuestoAndFechaAndServicioCorrelativoLike(idRepuesto : number, fechaDesde : string, fechaHasta : string, correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/repuesto/${idRepuesto}/fecha-rango/${fechaDesde}/${fechaHasta}/servicio/correlativo/${correlativo}`);
  }

  getByUsuario(idUsuario : number) {
    return this.http.get<Inventario[]>(`${this.url}/usuario/${idUsuario}`);
  }

  getByServicioCorrelativoLike(correlativo : number) {
    return this.http.get<Inventario[]>(`${this.url}/servicio/correlativo/${correlativo}`);
  }

  getByUsuarioAndFechaRango(idUsuario : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/usuario/${idUsuario}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getByServicioCorrelativoLikeAndFechaRango(correlativo : number, fechaDesde : string, fechaHasta : string) {
    return this.http.get<Inventario[]>(`${this.url}/servicio/correlativo/${correlativo}/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  getInventarioEntradaSalidaByFechaRango(fechaDesde : string, fechaHasta : string) {
    return this.http.get<InventarioEntradaSalidaDTO[]>(`${this.url}/entradas-salidas/fecha-rango/${fechaDesde}/${fechaHasta}`);
  }

  createMod(inventario: Inventario, idUsuario : number) {
    return this.http.post(this.url, inventario);
  }

  cuadrarInventarioRepuestoExistencia() {
    return this.http.post(`${this.url}/cuadrar-inventarios-repuestos`, null);
  }
  
}
