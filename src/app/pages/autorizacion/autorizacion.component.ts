import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/_service/login.service';
import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';;
import { VentanaUtil } from './../../shared/ventanaUtil';
import { Usuario } from 'src/app/_model/usuario';
import { Segmento } from 'src/app/_model/segmento';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { SegmentoService } from 'src/app/_service/segmento.service';
import { ServicioService } from 'src/app/_service/servicio.service';
import { Autorizacion } from 'src/app/_model/autorizacion';
import { AutorizacionService } from 'src/app/_service/autorizacion.service';
import { AutorizacionPasswordDialogoComponent } from './autorizacion-password-dialogo/autorizacion-password-dialogo.component';
import { ReporteService } from 'src/app/_service/reporte.service';
import * as moment from 'moment';

@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.css']
})
export class AutorizacionComponent implements OnInit {

  formAutorizacion : FormGroup;
  formBusqueda : FormGroup;

  idVentana : number = VentanaUtil.AUTORIZACIONES;

  usuarios$ : Observable<Usuario[]>;
  idAutorizado : number = 0;

  segmentos$ : Observable<Segmento[]>;
  idSegmento : number = 0;

  idTipoAutorizacion : number = 0;

  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;
  formatoFecha : string = 'YYYY-MM-DD';

  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);

  constructor(
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    private usuarioService : UsuarioService,
    private segmentoService : SegmentoService,
    private servicioService : ServicioService,
    private autorizacionService : AutorizacionService,
    private reporteService : ReporteService
  ) { }

  ngOnInit(): void {
    this.formAutorizacion = new FormGroup({
      'tipoAutorizacion' : new FormControl('', Validators.required),
      'autorizado' : new FormControl('', Validators.required),
      'razon' : new FormControl('', Validators.required),
      'correlativo' : new FormControl(''),
      'numero' : new FormControl(''),
      'segmento' : new FormControl('')
    });

    this.formBusqueda = new FormGroup({
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin
    });

    this.formAutorizacion.get('correlativo').disable();
    this.formAutorizacion.get('numero').disable();
    this.formAutorizacion.get('segmento').disable();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.USUARIOS, PermisoUtil.CONSULTAR)) {
      this.usuarios$ = this.usuarioService.getAllEnable();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getAll();
    }

  }

  tipoAutorizacionChange() {
    this.idSegmento=0;
    this.formAutorizacion.get('correlativo').reset();
    this.formAutorizacion.get('numero').reset()
    this.formAutorizacion.get('segmento').reset();

    if(this.idTipoAutorizacion==1) {
      this.formAutorizacion.get('correlativo').enable();
      this.formAutorizacion.get('numero').disable();
      this.formAutorizacion.get('segmento').disable();
    } else if(this.idTipoAutorizacion==2) {
      this.formAutorizacion.get('correlativo').enable();
      this.formAutorizacion.get('numero').disable();
      this.formAutorizacion.get('segmento').disable();
    } else if(this.idTipoAutorizacion==3) {
      this.formAutorizacion.get('correlativo').enable();
      this.formAutorizacion.get('numero').enable();
      this.formAutorizacion.get('segmento').disable();
    } else if(this.idTipoAutorizacion==4) {
      this.formAutorizacion.get('correlativo').enable();
      this.formAutorizacion.get('numero').disable();
      this.formAutorizacion.get('segmento').enable();
    }
  }

  abrirPasswordDialogo() {
    let autorizacionDialog = this.dialog.open(AutorizacionPasswordDialogoComponent, {
      width: '300px'
    });

    autorizacionDialog.afterClosed().subscribe(data => {
      if(data!=null && data==true) {
        this.procesarAutorizacion();
      } else {
        this.snackBar.open('Password incorrecto', 'AVISO', {duration : 2000});
      }
    })
  }

  procesarAutorizacion() {
    let autorizacion = new Autorizacion();
    autorizacion.autorizado = new Usuario();
    autorizacion.autorizado.idUsuario = this.idAutorizado;
    autorizacion.razon = this.formAutorizacion.value['razon'];

    this.spinner.show();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.AUTORIZACIONES, PermisoUtil.CREAR)) {
      this.servicioService.getByCorrelativo(this.formAutorizacion.value['correlativo']).subscribe(data => {
        if(data!=null) {
          if(this.idTipoAutorizacion==1) {
            this.autorizacionService.enableOrderEdit(autorizacion, data.idServicio).subscribe(dataA => {
              this.snackBar.open('Autorización procesada', 'AVISO', {duration : 2000});
              this.nuevaAutorizacion();
              this.spinner.hide();
            });
          } else if(this.idTipoAutorizacion==2) {
            this.autorizacionService.cancelOrderInvoice(autorizacion, data.idServicio).subscribe(dataA => {
              this.snackBar.open('Autorización procesada', 'AVISO', {duration : 2000});
              this.nuevaAutorizacion();
              this.spinner.hide();
            });
          } else if(this.idTipoAutorizacion==3) {
            this.autorizacionService.editInvoiceNumber(autorizacion, data.idServicio, this.formAutorizacion.value['numero']).subscribe(dataA => {
              this.snackBar.open('Autorización procesada', 'AVISO', {duration : 2000});
              this.nuevaAutorizacion();
              this.spinner.hide();
            });
          } else if(this.idTipoAutorizacion==4) {
            this.autorizacionService.editCustomerOrderAndCredit(autorizacion, data.idServicio, this.idSegmento).subscribe(dataA => {
              this.snackBar.open('Autorización procesada', 'AVISO', {duration : 2000});
              this.nuevaAutorizacion();
              this.spinner.hide();
            });
          }
        }
      })
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      this.spinner.hide();
    }
  }

  nuevaAutorizacion() {
    this.formAutorizacion.reset();
    this.idSegmento = 0;
    this.idTipoAutorizacion = 0;
    this.idAutorizado = 0;
    this.formAutorizacion.get('correlativo').disable();
    this.formAutorizacion.get('numero').disable();
    this.formAutorizacion.get('segmento').disable();
  }

  cambiarFechaInicio(e : any) {
    this.fechaInicioSeleccionada = e.value;
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaFin(e : any) {
    this.fechaFinSeleccionada = e.value;
    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFecha);
  }

  crearReporteAutorizaciones() {
    this.spinner.show();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.reporteService.crearReporteAutorizaciones(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        document.body.appendChild(a);
        a.href = url;
        a.download = `Autorizaciones_${this.fechaInicioFormato}_${this.fechaFinFormato}.pdf`;
        a.click();
        this.spinner.hide();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      this.spinner.hide();
    }
  }

}
