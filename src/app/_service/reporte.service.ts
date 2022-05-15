import { CotizacionAutomotorDTO } from './../_model/dto/cotizacionAutomotorDTO';
import { InventarioEntradaSalidaDTO } from './../_model/dto/inventarioEntradaSalidaDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReporteService extends GenericService<any> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/reportes`);
  }

  crearReporteInventarioEntradaSalida(fechaDesde : string, fechaHasta : string) {
    return this.http.get(`${this.url}/inventarios/inventario-entrada-salida/${fechaDesde}/${fechaHasta}`, {
      responseType: 'blob'
    });
  }

  crearReporteCotizacion(idCotizacion : number, placaNumero : string) {
    return this.http.get(`${this.url}/cotizacion/${idCotizacion}/placa/${placaNumero}`, {
      responseType: 'blob'
    });
  }

  crearReporteServicio(idServicio : number) {
    return this.http.get(`${this.url}/servicio/${idServicio}`, {
      responseType: 'blob'
    });
  }

  crearReporteCajaChica(idUsuario : number, fechaInicio : string, fechaFin : string) {
    return this.http.get(`${this.url}/usuario/${idUsuario}/fecha-rango/${fechaInicio}/${fechaFin}`, {
      responseType: 'blob'
    });
  }

  crearReporteFacturaSegmentoSinPrecio(idSegmentoCreditoDetalle : number) {
    return this.http.get(`${this.url}/segmento-credito-detalle/${idSegmentoCreditoDetalle}`, {
      responseType: 'blob'
    });
  }

  crearReporteCreditoProveedorDetallePorProveedorSinPagar(idProveedor : number, idSucursal : number, idUsuario : number) {
    return this.http.get(`${this.url}/credito-proveedor-detalle/sin-pagar/proveedor/${idProveedor}/sucursal/${idSucursal}/usuario/${idUsuario}`, {
      responseType: 'blob'
    });
  }

  crearReportePagoProveedor(idCreditoProveedor : number, idSucursal : number, idUsuario : number) {
    return this.http.get(`${this.url}/pago-proveedor/credito-proveedor/${idCreditoProveedor}/sucursal/${idSucursal}/usuario/${idUsuario}`, {
      responseType: 'blob'
    });
  }

  crearReporteChecklist(idChecklist : number) {
    return this.http.get(`${this.url}/checklist/${idChecklist}`, {
      responseType: 'blob'
    });
  }

  crearCotizacionCliente(cotizacionAutomotor : CotizacionAutomotorDTO) {
    return this.http.post(`${this.url}/cotizacion/clientes`, cotizacionAutomotor, {
      responseType: 'blob'
    });
  }

  crearReporteCardex(idSucursal: number) {
    return this.http.get(`${this.url}/cardex/sucursal/${idSucursal}`, {
      responseType: 'blob'
    });
  }

  crearReporteCardexIndividual(idRepuesto : number, idSucursal: number) {
    return this.http.get(`${this.url}/cardex-individual/${idRepuesto}/sucursal/${idSucursal}`, {
      responseType: 'blob'
    });
  }

  crearReporteCardexIndividualServicioFactura(idRepuesto : number, idSucursal: number) {
    return this.http.get(`${this.url}/cardex-individual-servicio-factura/${idRepuesto}/sucursal/${idSucursal}`, {
      responseType: 'blob'
    });
  }

  crearReporteServiciosPorPlaca(idPlaca : number) {
    return this.http.get(`${this.url}/servicios/placa/${idPlaca}`, {
      responseType: 'blob'
    });
  }

  crearReporteSegmentoCreditoConPagoPagadas(idSegmento : number, idSucursal : number) {
    return this.http.get(`${this.url}/segmento-credito-detalle/facturas-pagadas/segmento/${idSegmento}/sucursal/${idSucursal}`, {
      responseType: 'blob'
    });
  }

  crearReporteSegmentoCreditoConPagoSinPagar(idSegmento : number, idSucursal : number) {
    return this.http.get(`${this.url}/segmento-credito-detalle/facturas-sin-pagar/segmento/${idSegmento}/sucursal/${idSucursal}`, {
      responseType: 'blob'
    });
  }

  crearReporteEstadoDeCuentaSegmento(idSegmento : number, idSucursal : number) {
    return this.http.get(`${this.url}/segmento-credito-detalle/estado-de-cuenta/segmento/${idSegmento}/sucursal/${idSucursal}`, {
      responseType: 'blob'
    });
  }

  crearReporteAutorizaciones(fechaInicio : string, fechaFin : string) {
    return this.http.get(`${this.url}/autorizaciones/fecha-hora/${fechaInicio}/${fechaFin}`, {
      responseType: 'blob'
    });
  }
}
