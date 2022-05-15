import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { ReporteService } from './../../../_service/reporte.service';
import { Segmento } from './../../../_model/segmento';
import { Proveedor } from './../../../_model/proveedor';
import { Observable } from 'rxjs';
import { FacturaProveedorDTO } from './../../../_model/dto/facturaProveedorDTO';
import { FacturaSegmentoDTO } from './../../../_model/dto/facturaSegmentoDTO';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedorService } from './../../../_service/proveedor.service';
import { SegmentoService } from './../../../_service/segmento.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreditoProveedorDetalleService } from './../../../_service/credito-proveedor-detalle.service';
import { SegmentoCreditoDetalleService } from './../../../_service/segmento-credito-detalle.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  idBusquedaFacturaCliente : number = 0;
  idBusquedaFacturaProveedor : number = 0;

  formBusquedaFacturaCliente : FormGroup;
  formBusquedaFacturaProveedor : FormGroup;

  maxFecha : Date = new Date();
  formatoFecha : string = 'YYYY-MM-DD';
  fechaInicioClienteSeleccionada: Date = new Date();
  fechaFinClienteSeleccionada: Date = new Date();
  fechaInicioProveedorSeleccionada: Date = new Date();
  fechaFinProveedorSeleccionada: Date = new Date();
  fechaInicioClienteFormato : string;
  fechaFinClienteFormato : string;
  fechaInicioProveedorFormato : string;
  fechaFinProveedorFormato : string;

  idSegmento : number = 0;
  idProveedor : number = 0;


  myControlFechaInicioCliente : FormControl = new FormControl('', Validators.required);
  myControlFechaFinCliente : FormControl = new FormControl('', Validators.required);
  myControlFechaInicioProveedor : FormControl = new FormControl('', Validators.required);
  myControlFechaFinProveedor : FormControl = new FormControl('', Validators.required);
  myControlProveedor : FormControl = new FormControl('', Validators.required);
  myControlSegmento : FormControl = new FormControl('', Validators.required);

  dataSourceFacturaCliente : MatTableDataSource<FacturaSegmentoDTO>;
  dataSourceFacturaProveedor : MatTableDataSource<FacturaProveedorDTO>;

  proveedores$ : Observable<Proveedor[]>;
  segmentos$ : Observable<Segmento[]>;

  displayedColumnsCliente = ['facturaNumero', 'fecha', 'segmento', 'placa', 'total', 'pagada', 'fechaPago', 'tipoPago', 'imprimir'];
  displayedColumnsProveedor = ['facturaNumero', 'fecha', 'proveedor', 'total', 'vencida', 'pagada', 'fechaPago', 'tipoPago'];
  
  idVentana : number = VentanaUtil.FINANZAS;

  constructor(
    private segmentoCreditoDetalleService : SegmentoCreditoDetalleService,
    private creditoProveedorDetalleService : CreditoProveedorDetalleService,
    private segmentoService : SegmentoService,
    private proveedorService : ProveedorService,
    private reporteService : ReporteService,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.initFormBusquedaFacturaCliente();

    this.initFormBusquedaFacturaProveedor();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.CONSULTAR)) {
      this.proveedores$ = this.proveedorService.getAll();
    }
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getAll();
    }
  }

  initFormBusquedaFacturaCliente() {
    this.formBusquedaFacturaCliente = new FormGroup({
      'segmento' : this.myControlSegmento,
      'fechaInicio' : this.myControlFechaInicioCliente,
      'fechaFin' : this.myControlFechaFinCliente
    });

    this.formBusquedaFacturaCliente.get('segmento').disable();
    this.formBusquedaFacturaCliente.get('fechaInicio').disable();
    this.formBusquedaFacturaCliente.get('fechaFin').disable();
  }

  initFormBusquedaFacturaProveedor() {
    this.formBusquedaFacturaProveedor = new FormGroup({
      'proveedor' : this.myControlProveedor,
      'fechaInicio' : this.myControlFechaInicioProveedor,
      'fechaFin' : this.myControlFechaFinProveedor
    });

    this.formBusquedaFacturaProveedor.get('proveedor').disable();
    this.formBusquedaFacturaProveedor.get('fechaInicio').disable();
    this.formBusquedaFacturaProveedor.get('fechaFin').disable();
  }

  cambiarFechaInicioCliente(e : any) {
    this.fechaInicioClienteSeleccionada = e.value;
    this.fechaInicioClienteFormato = moment(this.fechaInicioClienteSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaFinCliente(e : any) {
    this.fechaFinClienteSeleccionada = e.value;
    this.fechaFinClienteFormato = moment(this.fechaFinClienteSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaInicioProveedor(e : any) {
    this.fechaInicioProveedorSeleccionada = e.value;
    this.fechaInicioProveedorFormato = moment(this.fechaInicioProveedorSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaFinProveedor(e : any) {
    this.fechaFinProveedorSeleccionada = e.value;
    this.fechaFinProveedorFormato = moment(this.fechaFinProveedorSeleccionada).format(this.formatoFecha);
  }

  setInputsFacturaCliente() {
    if(this.idBusquedaFacturaCliente == 1) {
      this.setSegmentoInput(true);
      this.setFechaClienteInput(false);
    } else if(this.idBusquedaFacturaCliente == 2) {
      this.setSegmentoInput(false);
      this.setFechaClienteInput(true);
    }
  }

  setInputsFacturaProveedor() {
    if(this.idBusquedaFacturaProveedor == 1) {
      this.setProveedorInput(true);
      this.setFechaProveedorInput(false);
    } else if(this.idBusquedaFacturaProveedor == 2) {
      this.setProveedorInput(false);
      this.setFechaProveedorInput(true);
    }
  }

  setFechaClienteInput(e : boolean) {
    this.dataSourceFacturaCliente = new MatTableDataSource();
    this.myControlFechaInicioCliente.reset();
    this.myControlFechaFinCliente.reset();
    if(e) {
      this.formBusquedaFacturaCliente.get('fechaInicio').enable();
      this.formBusquedaFacturaCliente.get('fechaFin').enable();
    } else {
      this.formBusquedaFacturaCliente.get('fechaInicio').disable();
      this.formBusquedaFacturaCliente.get('fechaFin').disable();
    }
  }

  setFechaProveedorInput(e : boolean) {
    this.dataSourceFacturaProveedor = new MatTableDataSource();
    this.myControlFechaInicioProveedor.reset();
    this.myControlFechaFinProveedor.reset();
    if(e) {
      this.formBusquedaFacturaProveedor.get('fechaInicio').enable();
      this.formBusquedaFacturaProveedor.get('fechaFin').enable();
    } else {
      this.formBusquedaFacturaProveedor.get('fechaInicio').disable();
      this.formBusquedaFacturaProveedor.get('fechaFin').disable();
    }
  }

  setSegmentoInput(e : boolean) {
    this.dataSourceFacturaCliente = new MatTableDataSource();
    this.myControlSegmento.reset();
    if(e) {
      this.formBusquedaFacturaCliente.get('segmento').enable();
    } else {
      this.formBusquedaFacturaCliente.get('segmento').disable();
    }
  }

  setProveedorInput(e : boolean) {
    this.dataSourceFacturaProveedor = new MatTableDataSource();
    this.myControlProveedor.reset();
    if(e) {
      this.formBusquedaFacturaProveedor.get('proveedor').enable();
    } else {
      this.formBusquedaFacturaProveedor.get('proveedor').disable();
    }
  }

  buscarFacturasCliente() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTO_CREDITO_DETALLES, PermisoUtil.CONSULTAR)) {
      if(this.idBusquedaFacturaCliente==1) {
        this.segmentoCreditoDetalleService.getFacturaBySegmento(this.idSegmento).subscribe(data => {
          this.dataSourceFacturaCliente = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaFacturaCliente==2) {
        this.segmentoCreditoDetalleService.getFacturaByFechaEmision(this.fechaInicioClienteFormato, this.fechaFinClienteFormato).subscribe(data => {
          this.dataSourceFacturaCliente = new MatTableDataSource(data);
        });
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  buscarFacturasProveedor() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CREDITO_PROVEEDOR_DETALLES, PermisoUtil.CONSULTAR)) {
      if(this.idBusquedaFacturaProveedor==1) {
        this.creditoProveedorDetalleService.getFacturaByProveedor(this.idProveedor).subscribe(data => {
          this.dataSourceFacturaProveedor = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaFacturaProveedor==2) {
        this.creditoProveedorDetalleService.getFacturaByFecha(this.fechaInicioProveedorFormato, this.fechaFinProveedorFormato).subscribe(data => {
          this.dataSourceFacturaProveedor = new MatTableDataSource(data);
        });
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  verBotonReporte(factura : FacturaSegmentoDTO) {
    if(factura.facturaNumero!=null && factura.facturaNumero!="") {
      return false;
    }
    return true;
  }

  crearReporteFacturaCliente(factura : FacturaSegmentoDTO) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.reporteService.crearReporteFacturaSegmentoSinPrecio(factura.idSegmentoCreditoDetalle).subscribe(data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        document.body.appendChild(a);
        a.href = url;
        a.download = `Factura${factura.facturaNumero}_${factura.placa}.pdf`;
        a.click();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }


}
