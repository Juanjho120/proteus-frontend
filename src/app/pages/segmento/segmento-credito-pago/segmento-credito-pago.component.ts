import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteService } from './../../../_service/reporte.service';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { SegmentoPagoDetalleDialogoComponent } from './segmento-pago-detalle-dialogo/segmento-pago-detalle-dialogo.component';
import { SegmentoService } from './../../../_service/segmento.service';
import { SegmentoCreditoDetalleDialogoComponent } from './segmento-credito-detalle-dialogo/segmento-credito-detalle-dialogo.component';
import { ServicioDTO } from './../../../_model/dto/servicioDTO';
import { ServicioService } from './../../../_service/servicio.service';
import { Servicio } from './../../../_model/servicio';
import { SegmentoPago } from './../../../_model/segmentoPago';
import { SegmentoPagoDialogoEliminarComponent } from './segmento-pago-dialogo-eliminar/segmento-pago-dialogo-eliminar.component';
import { MatSort } from '@angular/material/sort';
import { SegmentoPagoService } from './../../../_service/segmento-pago.service';
import { MatDialog } from '@angular/material/dialog';
import { SegmentoPagoDialogoComponent } from './segmento-pago-dialogo/segmento-pago-dialogo.component';
import { SegmentoCreditoDetalleService } from './../../../_service/segmento-credito-detalle.service';
import { MatTableDataSource } from '@angular/material/table';
import { SegmentoCreditoDetalle } from './../../../_model/segmentoCreditoDetalle';
import { SegmentoCredito } from './../../../_model/segmentoCredito';
import { Segmento } from './../../../_model/segmento';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SegmentoCreditoService } from './../../../_service/segmento-credito.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';
import { SucursalService } from 'src/app/_service/sucursal.service';
import { Sucursal } from 'src/app/_model/sucursal';

@Component({
  selector: 'app-segmento-credito-pago',
  templateUrl: './segmento-credito-pago.component.html',
  styleUrls: ['./segmento-credito-pago.component.css']
})
export class SegmentoCreditoPagoComponent implements OnInit {

  form : FormGroup;

  segmentos$ : Observable<Segmento[]>;
  idSegmento : number = 0;
  segmentoCredito : SegmentoCredito = new SegmentoCredito();
  segmentoCreditoTotal : number = 0;

  formatoFecha : string = 'YYYY-MM-DD';

  serviciosDTO : ServicioDTO[] = [];
  segmentoCreditoDetalles : SegmentoCreditoDetalle[] = [];
  segmentoPagos : SegmentoPago[] = [];

  displayedColumnsDetalle = ['fechaEmision', 'facturaNumero', 'servicio', 'placa', 'totalFacturado', 'totalPagado', 'totalRestante'];
  displayedColumnsPago = ['fechaPago', 'pagoTipo', 'facturas', 'monto', 'acciones'];
  displayedColumnsServicio = ['noServicio', 'fecha', 'servicioTipo', 'placaServicio', 'segmento', 'trabajo', 'repuesto', 'total', 'facturar'];
  dataSourceDetalle : MatTableDataSource<SegmentoCreditoDetalle>;
  dataSourcePago : MatTableDataSource<SegmentoPago>;
  dataSourceServicio : MatTableDataSource<ServicioDTO>;
  @ViewChild(MatSort) sort : MatSort;

  idVentana : number = VentanaUtil.SEGMENTOS;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  constructor(
    private segmentoCreditoService : SegmentoCreditoService,
    private segmentoCreditoDetalleService : SegmentoCreditoDetalleService,
    private segmentoPagoService : SegmentoPagoService,
    private segmentoService : SegmentoService,
    private servicioService : ServicioService,
    private sucursalService : SucursalService,
    private reporteService : ReporteService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'segmento' : new FormControl('', Validators.required)
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_PAGOS, PermisoUtil.CONSULTAR)) {
      this.segmentoPagoService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'AVISO', {duration : 2000});
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getWithCredito();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.servicioService.getByFinalizadoAndFacturado(true, false).subscribe(data => {
        for(let servicio of data) {
          this.serviciosDTO.push(this.convertirServicio(servicio));
        }
        this.filtrarServiciosPorSucursal();
      });
    }

    this.segmentoCreditoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.servicioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.segmentoCredito.segmento = new Segmento();
    this.segmentoCredito.credito = 0;

    this.sucursales$ = this.sucursalService.getAll();

  }

  filtrarPorSucursal() {
    this.filtrarServiciosPorSucursal();
    this.filtrarCreditosDetallePorSucursal();
    this.filtrarPagosPorSucursal();
  }

  filtrarServiciosPorSucursal() {
    this.dataSourceServicio = new MatTableDataSource(this.serviciosDTO.filter((servicio) => this.idSucursal > 0 ? servicio.idSucursal == this.idSucursal : servicio));
  }

  filtrarCreditosDetallePorSucursal() {
    this.segmentoCreditoTotal = 0;
    let segmentoCreditoDetallesAux = this.segmentoCreditoDetalles
                                      .filter((creditoDetalle) => 
                                        this.idSucursal > 0 ? 
                                          creditoDetalle.servicio.sucursal.idSucursal == this.idSucursal 
                                          : creditoDetalle);
    this.dataSourceDetalle = new MatTableDataSource(segmentoCreditoDetallesAux);
    segmentoCreditoDetallesAux
      .map((creditoDetalle) => this.segmentoCreditoTotal += creditoDetalle.totalRestante)
  }

  filtrarPagosPorSucursal() {
    this.dataSourcePago = new MatTableDataSource(this.segmentoPagos.filter((pago) => this.idSucursal > 0 ? pago.sucursal.idSucursal == this.idSucursal : pago));
  }

  buscarSegmentoCredito() {
    this.spinner.show();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_CREDITOS, PermisoUtil.CONSULTAR)) {
      this.dataSourceDetalle = new MatTableDataSource();
      this.dataSourcePago = new MatTableDataSource();
      document.getElementById("div-segmento").style.display = "block";

      this.segmentoCreditoService.getBySegmento(this.idSegmento).subscribe(data => {
        this.segmentoCredito = data;
      });

      this.segmentoCreditoDetalleService.getBySegmento(this.idSegmento).subscribe(data => {
        this.segmentoCreditoDetalles = [];
        for(let segmentoCreditoDetalle of data) {
          segmentoCreditoDetalle.fechaHoraEmision = moment(segmentoCreditoDetalle.fechaHoraEmision).format(this.formatoFecha);
          this.segmentoCreditoDetalles.push(segmentoCreditoDetalle);
        }
        this.filtrarCreditosDetallePorSucursal();
        this.dataSourceDetalle.sort = this.sort;
        this.spinner.hide();
      });

      this.segmentoPagoService.getBySegmento(this.idSegmento).subscribe(data => {
        this.segmentoPagos = [];
        for(let segmentoPago of data) {
          segmentoPago.fechaHoraPago = moment(segmentoPago.fechaHoraPago).format(this.formatoFecha);
          segmentoPago.facturas = "";
          for(let segmentoPagoDetalle of segmentoPago.segmentoPagoDetalle) {
            segmentoPago.facturas += `${segmentoPagoDetalle.segmentoCreditoDetalle.facturaNumero} `;
          }
          this.segmentoPagos.push(segmentoPago);
        }
        this.filtrarPagosPorSucursal();
        this.dataSourcePago.sort = this.sort;
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoSegmentoPagoDetalle(idSegmentoPago : number) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_PAGOS, PermisoUtil.CONSULTAR)) {
      this.dialog.open(SegmentoPagoDetalleDialogoComponent, {
        width : '1000px',
        data : idSegmentoPago
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirDialogoSegmentoPagoEliminar(segmentoPago : SegmentoPago) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_PAGOS, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(SegmentoPagoDialogoEliminarComponent, {
        width : '350px',
        data : segmentoPago
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.buscarSegmentoCredito();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  filterPago(value : string) {
    this.dataSourcePago.filter = value.trim().toLowerCase();
  }

  filterDetalle(value : string) {
    this.dataSourceDetalle.filter = value.trim().toLowerCase();
  }

  abrirDialogoSegmentoPago() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_PAGOS, PermisoUtil.CREAR)) {
      let dialogRef = this.dialog.open(SegmentoPagoDialogoComponent, {
        width : '600px',
        data : { segmentoCredito: this.segmentoCredito, idSucursal: this.idSucursal }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.buscarSegmentoCredito();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  crearReporteSegmentoCreditoConPagoPagadas() {
    this.spinner.show()
    this.reporteService.crearReporteSegmentoCreditoConPagoPagadas(this.segmentoCredito.segmento.idSegmento, this.idSucursal).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `FacturasPagadas_${this.segmentoCredito.segmento.nombre}.pdf`;
      a.click();
      this.spinner.hide()
    });
  }

  crearReporteSegmentoCreditoConPagoSinPagar() {
    this.spinner.show()
    this.reporteService.crearReporteSegmentoCreditoConPagoSinPagar(this.segmentoCredito.segmento.idSegmento, this.idSucursal).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `FacturasSinPagar_${this.segmentoCredito.segmento.nombre}.pdf`;
      a.click();
      this.spinner.hide()
    });
  }

  crearReporteEstadoDeCuentaSegmento() {
    this.spinner.show()
    this.reporteService.crearReporteEstadoDeCuentaSegmento(this.segmentoCredito.segmento.idSegmento, this.idSucursal).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `EstadoDeCuenta_${this.segmentoCredito.segmento.nombre}.pdf`;
      a.click();
      this.spinner.hide()
    });
  }

  convertirServicio(servicio : Servicio) {
    let servicioDTO = new ServicioDTO();
    servicioDTO.noServicio = servicio.idServicio;
    servicioDTO.correlativo = servicio.correlativo;
    servicioDTO.fecha = moment(servicio.fechaHora).format(this.formatoFecha);
    servicioDTO.servicioTipo = servicio.servicioTipo.nombre;
    servicioDTO.placa = servicio.placa.numero;
    servicioDTO.segmento = servicio.segmento.nombre;
    servicioDTO.proximoServicio = servicio.kilometrajeProximoServicio;
    servicioDTO.costoTotal = `Q. ${servicio.costoTotal.toFixed(2)}`;
    servicioDTO.facturado = servicio.facturado;
    servicioDTO.finalizado = servicio.finalizado;
    servicioDTO.idSucursal = servicio.sucursal.idSucursal;

    let costoTrabajo = 0;
    for(let servicioTrabajo of servicio.servicioTrabajo) {
      costoTrabajo += servicioTrabajo.costo;
    }

    let costoRepuesto = 0;
    for(let servicioRepuesto of servicio.servicioRepuesto) {
      costoRepuesto += servicioRepuesto.costoTotal;
    }

    servicioDTO.costoTrabajo = `Q. ${costoTrabajo.toFixed(2)}`;
    servicioDTO.costoRepuesto = `Q. ${costoRepuesto.toFixed(2)}`;

    return servicioDTO;
  }

  abrirDialogoSegmentoCreditoDetalle(servicioDTO : ServicioDTO) {
    this.servicioService.verificarPermisoFacturacion(servicioDTO.noServicio).subscribe(data => {
      if(data==false) {
        let mensaje = "Este servicio tiene facturas de compra pendientes por modificar sus precios de venta";
        this.snackBar.open(mensaje, 'AVISO', {duration : 2000});
      } else {
        if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_CREDITO_DETALLES, PermisoUtil.CREAR)) {
          let dialogRef = this.dialog.open(SegmentoCreditoDetalleDialogoComponent, {
            width : '250px',
            data : servicioDTO.noServicio
          });
      
          dialogRef.afterClosed().subscribe(() => {
            this.segmentos$ = this.segmentoService.getWithCredito();
            this.dataSourceServicio = new MatTableDataSource();
            this.serviciosDTO = [];
            this.servicioService.getByFinalizadoAndFacturado(true, false).subscribe(data => {
              for(let servicio of data) {
                this.serviciosDTO.push(this.convertirServicio(servicio));
              }
              this.filtrarServiciosPorSucursal();
            });
          });
        } else {
          this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
        }
        
      }
    });
  }

  evaluarBotonVerHistorial() {
    if(this.form.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }
}
