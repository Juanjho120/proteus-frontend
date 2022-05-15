import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../../shared/permisoUtil';
import { TablaUtil } from './../../../../shared/tablaUtil';
import { LoginService } from './../../../../_service/login.service';
import { VentanaUtil } from './../../../../shared/ventanaUtil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Servicio } from './../../../../_model/servicio';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Segmento } from './../../../../_model/segmento';
import { ServicioService } from './../../../../_service/servicio.service';
import { SegmentoService } from './../../../../_service/segmento.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Cotizacion } from 'src/app/_model/cotizacion';
import { SucursalService } from 'src/app/_service/sucursal.service';
import { Sucursal } from 'src/app/_model/sucursal';

@Component({
  selector: 'app-servicio-dialogo-buscar',
  templateUrl: './servicio-dialogo-buscar.component.html',
  styleUrls: ['./servicio-dialogo-buscar.component.css']
})
export class ServicioDialogoBuscarComponent implements OnInit {

  formBusqueda : FormGroup;

  idSegmento : number = 0;
  segmentos$ : Observable<Segmento[]>;

  idSucursal : number = 1;
  sucursales$ : Observable<Sucursal[]>;

  dataSource : MatTableDataSource<Servicio>;
  servicioFormato : Servicio[] = [];
  displayedColumns = ['correlativo', 'fecha', 'servicioTipo', 'sucursal', 'segmento', 'placa', 'costo'];

  formatoFecha : string = 'YYYY-MM-DD';
  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  formatoFechaHoraB : string = 'YYYY-MM-DD HH:mm:ss';

  myControlSegmento : FormControl = new FormControl(this.idSegmento, Validators.required);
  myControlSucursal : FormControl = new FormControl(this.idSucursal, Validators.required);

  idVentana : number = VentanaUtil.SERVICIOS;

  constructor(
    private segmentoService : SegmentoService,
    private sucursalService : SucursalService,
    private servicioService : ServicioService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    private dialogRef : MatDialogRef<ServicioDialogoBuscarComponent>
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getAll();
    }

    this.sucursales$ = this.sucursalService.getAll();
    
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      this.servicioService.getByFinalizadoAndFacturado(false, false).subscribe(data => {
        this.servicioFormato = [];
        for(let servicio of data) {
          servicio.fechaHora = moment(servicio.fechaHora).format(this.formatoFecha);
          if(servicio.cotizacion == null) {
            servicio.cotizacion = new Cotizacion();
            servicio.cotizacion.idCotizacion = 0;
          }
          if(servicio.sucursal.idSucursal == this.idSucursal) {
            this.servicioFormato.push(servicio);
          }
        }
        this.dataSource = new MatTableDataSource(this.servicioFormato);
        this.spinner.hide()
      }, (error:any) => this.spinner.hide());
    }

    this.servicioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.initForm();
  }

  initForm() {
    this.formBusqueda = new FormGroup({
      'sucursal' : this.myControlSucursal,
      'segmento' : this.myControlSegmento
    });
  }

  buscar() {
    if(this.idSegmento == 0 && this.idSucursal == 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
        this.spinner.show()
        this.servicioService.getByFinalizadoAndFacturado(false, false).subscribe(data => {
          this.servicioFormato = [];
          for(let servicio of data) {
            servicio.fechaHora = moment(servicio.fechaHora).format(this.formatoFecha);
            if(servicio.cotizacion == null) {
              servicio.cotizacion = new Cotizacion();
              servicio.cotizacion.idCotizacion = 0;
            }
            this.servicioFormato.push(servicio);
          }
          this.dataSource = new MatTableDataSource(this.servicioFormato);
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else if(this.idSucursal == 0 && this.idSegmento > 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
        this.spinner.show()
        this.servicioService.getBySegmentoAndFinalizadoAndFacturado(this.idSegmento, false, false).subscribe(data => {
          this.servicioFormato = [];
          for(let servicio of data) {
            servicio.fechaHora = moment(servicio.fechaHora).format(this.formatoFecha);
            if(servicio.cotizacion==null) {
              servicio.cotizacion = new Cotizacion();
              servicio.cotizacion.idCotizacion = 0;
            }
            this.servicioFormato.push(servicio);
          }
          this.dataSource = new MatTableDataSource(this.servicioFormato);
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
    else if(this.idSucursal > 0 && this.idSegmento == 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
        this.spinner.show()
        this.servicioService.getBySucursalAndFinalizadoAndFacturado(this.idSucursal, false, false).subscribe(data => {
          this.servicioFormato = [];
          for(let servicio of data) {
            servicio.fechaHora = moment(servicio.fechaHora).format(this.formatoFecha);
            if(servicio.cotizacion==null) {
              servicio.cotizacion = new Cotizacion();
              servicio.cotizacion.idCotizacion = 0;
            }
            this.servicioFormato.push(servicio);
          }
          this.dataSource = new MatTableDataSource(this.servicioFormato);
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else if(this.idSucursal > 0 && this.idSegmento > 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
        this.spinner.show()
        this.servicioService.getBySegmentoAndSucursalAndFinalizadoAndFacturado(this.idSegmento, this.idSucursal, false, false).subscribe(data => {
          this.servicioFormato = [];
          for(let servicio of data) {
            servicio.fechaHora = moment(servicio.fechaHora).format(this.formatoFecha);
            if(servicio.cotizacion==null) {
              servicio.cotizacion = new Cotizacion();
              servicio.cotizacion.idCotizacion = 0;
            }
            this.servicioFormato.push(servicio);
          }
          this.dataSource = new MatTableDataSource(this.servicioFormato);
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
  }

  cerrar(checked : boolean, servicio : Servicio) {
    if(checked) {
      this.dialogRef.close(servicio);
    }
  }

}
