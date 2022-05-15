import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { CotizacionClienteInformacionDialogoComponent } from './cotizacion-cliente-informacion-dialogo/cotizacion-cliente-informacion-dialogo.component';
import { CotizacionDialogoEliminarComponent } from './cotizacion-dialogo-eliminar/cotizacion-dialogo-eliminar.component';
import { CotizacionDialogoBuscarComponent } from './cotizacion-dialogo-buscar/cotizacion-dialogo-buscar.component';
import { MatDialog } from '@angular/material/dialog';
import { CotizacionService } from './../../_service/cotizacion.service';
import { CotizacionRepuesto } from './../../_model/cotizacionRepuesto';
import { Cotizacion } from './../../_model/cotizacion';
import { CotizacionTrabajo } from './../../_model/cotizacionTrabajo';
import { RepuestoService } from './../../_service/repuesto.service';
import { map, switchMap } from 'rxjs/operators';
import { Repuesto } from './../../_model/repuesto';
import { UsuarioService } from './../../_service/usuario.service';
import { Usuario } from './../../_model/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SegmentoService } from './../../_service/segmento.service';
import { Segmento } from './../../_model/segmento';
import { Observable } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  idSelector : number = 0;
  idBusqueda : number = 0;
  controlsGroup : boolean = true;

  formCotizacion : FormGroup;
  formCotizacionTrabajo : FormGroup;
  formCotizacionRepuesto : FormGroup;

  segmentos$ : Observable<Segmento[]>;
  idSegmento : number;

  usuario : Usuario = new Usuario();

  totalCotizacion : number = 0;

  myControlRepuesto : FormControl = new FormControl('', Validators.required);
  repuestosFiltrados$ : Observable<Repuesto[]>;
  repuestos : Repuesto[];
  repuestoSeleccionado : Repuesto;

  cotizacionTrabajos : CotizacionTrabajo[] = [];
  cotizacionRepuestos : CotizacionRepuesto[] = [];
  cotizacion : Cotizacion;

  totalTrabajo : number = 0;
  totalRepuesto : number = 0;

  formatoFecha : string = 'YYYY-MM-DD';
  formatoFechaHora : string = 'YYYY-MM-DD HH:mm:ss';

  idVentana : number = VentanaUtil.COTIZACIONES;

  constructor(
    private segmentoService : SegmentoService,
    private usuarioService : UsuarioService,
    private repuestoService : RepuestoService,
    private cotizacionService : CotizacionService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.cotizacion = new Cotizacion();
    this.cotizacion.fechaHora = moment(new Date()).format(this.formatoFecha);
    this.initFormCotizacion();

    this.initFormCotizacionTrabajo();

    this.initFormCotizacionRepuesto();

    this.cotizacionService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.USUARIOS, PermisoUtil.CONSULTAR)) {
      this.usuarioService.getById(parseInt(sessionStorage.getItem('idUsuario'))).subscribe(data => {
        this.usuario = data;
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getAll().subscribe(data => {
        this.repuestos = data;
      });
    }

    this.repuestosFiltrados$ = this.myControlRepuesto.valueChanges.pipe(map(val => this.filtrarRepuestos(val)))
  }

  initFormCotizacion() {
    this.formCotizacion = new FormGroup({
      'segmento' : new FormControl('', Validators.required)
    })
  }

  initFormCotizacionTrabajo() {
    this.formCotizacionTrabajo = new FormGroup({
      'descripcion' : new FormControl('', Validators.required),
      'costo' : new FormControl('', Validators.required)
    })
  }

  initFormCotizacionRepuesto() {
    this.formCotizacionRepuesto = new FormGroup({
      'cantidad' : new FormControl('', Validators.required),
      'repuesto' : this.myControlRepuesto,
      'costoUnitario' : new FormControl('', Validators.required)
    })
  }

  setControls() {
    if(this.idSelector == 1) {
      this.controlsGroup = true;
    } else if(this.idSelector == 2) {
      this.controlsGroup = false;
    }
  }

  filtrarRepuestos(val : any) {
    if(val != null && val.idRepuesto > 0) {
      return this.repuestos.filter(el => 
        el.descripcion.toLowerCase().includes(val.descripcion.toLowerCase()) || el.codigo.toLowerCase().includes(val.codigo.toLowerCase())
      );
    }
    return this.repuestos.filter(el =>
      el.descripcion.toLowerCase().includes(val?.toLowerCase()) || el.codigo.toLowerCase().includes(val?.toLowerCase())
    );
  }

  mostrarRepuesto(repuesto : Repuesto) {
    return repuesto ? `${repuesto.descripcion}` : repuesto;
  }

  seleccionarRepuesto(e: any) {
    this.repuestoSeleccionado = e.option.value;
    this.formCotizacionRepuesto.patchValue({
      costoUnitario : this.repuestoSeleccionado.precio
    });
  }

  agregarCotizacionTrabajo() {
    let cotizacionTrabajo = new CotizacionTrabajo();
    cotizacionTrabajo.descripcionTrabajo = this.formCotizacionTrabajo.value['descripcion'];
    cotizacionTrabajo.costo = this.formCotizacionTrabajo.value['costo'];
    this.cotizacionTrabajos.push(cotizacionTrabajo);

    this.totalTrabajo += cotizacionTrabajo.costo;
    this.totalCotizacion += cotizacionTrabajo.costo;
    this.totalCotizacion = parseFloat(this.totalCotizacion.toFixed(2));
    this.limpiarControlCotizacionTrabajo();
  }

  removerCotizacionTrabajo(index : number) {
    this.totalTrabajo -= this.cotizacionTrabajos[index].costo;
    this.totalCotizacion -= this.cotizacionTrabajos[index].costo;
    this.cotizacionTrabajos.splice(index, 1);
  }

  agregarCotizacionRepuesto() {
    let cont = 0;
    for(let i = 0; i < this.cotizacionRepuestos.length; i++) {
      let cotizacionRepuestoAux = this.cotizacionRepuestos[i];
      if((cotizacionRepuestoAux.repuesto.idRepuesto === this.repuestoSeleccionado.idRepuesto)) {
        cont++;
        break;
      }
    }

    if(cont > 0) {
      let mensaje = 'Este repuesto ya se encuentra agregado'
      this.snackBar.open(mensaje, "AVISO", { duration : 2000});
    } else {
      let cotizacionRepuesto = new CotizacionRepuesto();
      cotizacionRepuesto.repuesto = this.repuestoSeleccionado;
      cotizacionRepuesto.cantidad = this.formCotizacionRepuesto.value['cantidad'];
      cotizacionRepuesto.costoUnitario = this.formCotizacionRepuesto.value['costoUnitario'];
      cotizacionRepuesto.costoTotal = cotizacionRepuesto.cantidad * cotizacionRepuesto.costoUnitario;

      cotizacionRepuesto.costoTotal = parseFloat(cotizacionRepuesto.costoTotal.toFixed(2));
      
      this.cotizacionRepuestos.push(cotizacionRepuesto);
      this.totalRepuesto += cotizacionRepuesto.costoTotal;
      this.totalCotizacion += cotizacionRepuesto.costoTotal;

      this.totalCotizacion = parseFloat(this.totalCotizacion.toFixed(2));

      this.limpiarControlCotizacionRepuesto();
    }
  }

  removerCotizacionRepuesto(index : number) {
    this.totalRepuesto -= this.cotizacionRepuestos[index].costoTotal;
    this.totalCotizacion -= this.cotizacionRepuestos[index].costoTotal;
    this.cotizacionRepuestos.splice(index, 1);
  }

  limpiarControlCotizacionRepuesto() {
    this.repuestoSeleccionado = null;
    this.myControlRepuesto.reset();
    this.formCotizacionRepuesto.reset();
  }

  limpiarControlCotizacionTrabajo() {
    this.formCotizacionTrabajo.reset();
  }

  limpiarControlCotizacion() {
    this.limpiarControlCotizacionRepuesto();
    this.limpiarControlCotizacionTrabajo();
    this.formCotizacion.reset();
    this.totalCotizacion = 0;
    this.totalTrabajo = 0;
    this.totalRepuesto = 0;
    this.idSegmento = 0;
    this.repuestoSeleccionado = null;
    this.cotizacion = new Cotizacion();
    this.cotizacion.fechaHora = moment(new Date()).format(this.formatoFecha);
    this.cotizacionRepuestos = [];
    this.cotizacionTrabajos = [];
  }

  evaluarBotonCrear() {
    if(!this.formCotizacion.invalid && (this.cotizacionRepuestos.length > 0 || this.cotizacionTrabajos.length > 0)
      && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  abrirCotizacionDialogoBuscar() {
    let dialogRef = this.dialog.open(CotizacionDialogoBuscarComponent, {
      width: 'auto',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data != undefined) {
        this.limpiarControlCotizacion();
        this.cotizacion = data;
        this.cargarCotizacionBusqueda();
      }
    });
  }

  cargarCotizacionBusqueda() {
    this.cotizacion.fechaHora = moment(this.cotizacion.fechaHora).format(this.formatoFechaHora);
    this.totalCotizacion = this.cotizacion.total;
    this.usuario = this.cotizacion.usuario;
    this.cotizacionRepuestos = this.cotizacion.cotizacionRepuesto;
    this.cotizacionTrabajos = this.cotizacion.cotizacionTrabajo;
    this.idSegmento = this.cotizacion.segmento.idSegmento;

    this.formCotizacion.setValue({segmento : this.idSegmento});

    for(let i = 0; i < this.cotizacionTrabajos.length; i++) {
      this.cotizacionTrabajos[i].idCotizacionTrabajo = null;
      this.totalTrabajo += this.cotizacionTrabajos[i].costo; 
    }

    for(let i = 0; i < this.cotizacionRepuestos.length; i++) {
      this.cotizacionRepuestos[i].idCotizacionRepuesto = null;
      this.totalRepuesto += this.cotizacionRepuestos[i].costoTotal;
    }
  }

  abrirCotizacionDialogoEliminar() {
    let dialogRef = this.dialog.open(CotizacionDialogoEliminarComponent, {
      width: 'auto',
      height: 'auto',
      data: this.cotizacion
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.limpiarControlCotizacion();
      }
    });
  }

  evaluarBotonEliminar() {
    if(this.cotizacion!=null && this.cotizacion.idCotizacion>0 && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  operar() {
    if(this.cotizacion.idCotizacion > 0) {
      this.cotizacion.segmento = new Segmento();
      this.cotizacion.segmento.idSegmento = this.idSegmento;
      this.cotizacion.usuario = new Usuario();
      this.cotizacion.usuario = this.usuario;
      this.cotizacion.fechaHora = null;
      this.cotizacion.cotizacionRepuesto = this.cotizacionRepuestos;
      this.cotizacion.cotizacionTrabajo = this.cotizacionTrabajos;
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.COTIZACIONES, PermisoUtil.EDITAR)) {
        this.cotizacionService.update(this.cotizacion).pipe(switchMap(() => {
          return this.cotizacionService.getAll();
        })).subscribe(data => {
          this.cotizacionService.setObjetoCambio(data);
          this.cotizacionService.setMensajeCambio('Cotizacion actualizada');
          this.limpiarControlCotizacion();
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    } else {
      this.cotizacion = new Cotizacion();
      this.cotizacion.segmento = new Segmento();
      this.cotizacion.segmento.idSegmento = this.idSegmento;
      this.cotizacion.usuario = this.usuario;
      this.cotizacion.fechaHora = null;
      this.cotizacion.cotizacionRepuesto = this.cotizacionRepuestos;
      this.cotizacion.cotizacionTrabajo = this.cotizacionTrabajos;

      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.COTIZACIONES, PermisoUtil.CREAR)) {
        this.cotizacionService.create(this.cotizacion).pipe(switchMap(() => {
          return this.cotizacionService.getAll();
        })).subscribe(data => {
          this.cotizacionService.setObjetoCambio(data);
          this.cotizacionService.setMensajeCambio('Cotizacion creada');
          this.limpiarControlCotizacion();
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    }
  }

  verBotonReporte() {
    if(this.cotizacion==null || this.cotizacion.idCotizacion==null || this.cotizacion.idCotizacion==0 && !this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

  crearReporteCotizacion() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.dialog.open(CotizacionClienteInformacionDialogoComponent, {
        width: 'auto',
        height: 'auto',
        data: this.cotizacion
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

}
