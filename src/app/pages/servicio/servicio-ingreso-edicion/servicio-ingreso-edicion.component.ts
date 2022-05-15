import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { ServicioDialogoBuscarComponent } from './servicio-dialogo-buscar/servicio-dialogo-buscar.component';
import { ServicioDialogoEliminarComponent } from './servicio-dialogo-eliminar/servicio-dialogo-eliminar.component';
import { map, switchMap } from 'rxjs/operators';
import { Repuesto } from './../../../_model/repuesto';
import { ServicioRepuesto } from './../../../_model/servicioRepuesto';
import { ServicioTrabajo } from './../../../_model/servicioTrabajo';
import { ServicioTipo } from './../../../_model/servicioTipo';
import { ServicioTipoService } from './../../../_service/servicio-tipo.service';
import { Placa } from './../../../_model/placa';
import { Servicio } from './../../../_model/servicio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SegmentoService } from './../../../_service/segmento.service';
import { RepuestoService } from './../../../_service/repuesto.service';
import { PlacaService } from './../../../_service/placa.service';
import { ServicioService } from './../../../_service/servicio.service';
import { Segmento } from './../../../_model/segmento';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';
import { SucursalService } from 'src/app/_service/sucursal.service';
import { Sucursal } from 'src/app/_model/sucursal';

@Component({
  selector: 'app-servicio-ingreso-edicion',
  templateUrl: './servicio-ingreso-edicion.component.html',
  styleUrls: ['./servicio-ingreso-edicion.component.css']
})
export class ServicioIngresoEdicionComponent implements OnInit {

  formServicio : FormGroup;
  formServicioTrabajo : FormGroup;
  formServicioRepuesto : FormGroup;

  servicioTrabajos : ServicioTrabajo[] = [];
  servicioRepuestos : ServicioRepuesto[] = [];
  servicio : Servicio;
  
  segmentos$ : Observable<Segmento[]>;
  idSegmento : number = 0;

  placas$ : Observable<Placa[]>;
  idPlaca : number = 0;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  servicioTipos$ : Observable<ServicioTipo[]>;
  idServicioTipo : number = 0;

  totalServicio : number = 0;
  totalTrabajo : number = 0;
  totalRepuesto : number = 0;

  myControlRepuesto : FormControl = new FormControl('', Validators.required);
  repuestosFiltrados$ : Observable<Repuesto[]>;
  repuestos : Repuesto[];
  repuestoSeleccionado : Repuesto;

  formatoFecha : string = 'YYYY-MM-DD';
  formatoFechaHora : string = 'YYYY-MM-DD HH:mm:ss';

  idVentana : number = VentanaUtil.SERVICIOS;

  constructor(
    private segmentoService : SegmentoService,
    private repuestoService : RepuestoService,
    private servicioTipoService : ServicioTipoService,
    private servicioService : ServicioService,
    private sucursalService : SucursalService,
    private placaService : PlacaService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.servicio = new Servicio();
    this.servicio.fechaHora = moment(new Date()).format(this.formatoFecha);

    this.initFormServicio();

    this.initFormServicioTrabajo();

    this.initFormServicioRepuesto();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CONSULTAR)) {
      this.placas$ = this.placaService.getNotInService();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIO_TIPOS, PermisoUtil.CONSULTAR)) {
      this.servicioTipos$ = this.servicioTipoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getAll().subscribe(data => {
        this.repuestos = data;
      });
    }

    this.sucursales$ = this.sucursalService.getAll();

    this.servicioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.repuestosFiltrados$ = this.myControlRepuesto.valueChanges.pipe(map(val => this.filtrarRepuestos(val)))
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

  seleccionarRepuesto(e: any) {
    this.repuestoSeleccionado = e.option.value;
    this.formServicioRepuesto.patchValue({
      costoUnitario : this.repuestoSeleccionado.precio
    });
  }

  mostrarRepuesto(repuesto : Repuesto) {
    return repuesto ? `${repuesto.descripcion}` : repuesto;
  }

  initFormServicio() {
    this.formServicio = new FormGroup({
      'segmento' : new FormControl('', Validators.required),
      'placa' : new FormControl('', Validators.required),
      'servicioTipo' : new FormControl('', Validators.required),
      'kilometrajeActual' : new FormControl('', Validators.required),
      'kilometrajeProximo' : new FormControl('', Validators.required),
      'sucursal' : new FormControl(this.idSucursal, Validators.required)
    });
  }

  initFormServicioTrabajo() {
    this.formServicioTrabajo = new FormGroup({
      'descripcion' : new FormControl('', Validators.required),
      'costo' : new FormControl('', Validators.required)
    })
  }

  initFormServicioRepuesto() {
    this.formServicioRepuesto = new FormGroup({
      'cantidad' : new FormControl('', Validators.required),
      'repuesto' : this.myControlRepuesto,
      'costoUnitario' : new FormControl('', Validators.required)
    })
  }

  limpiarControlServicioRepuesto() {
    this.repuestoSeleccionado = null;
    this.myControlRepuesto.reset();
    this.formServicioRepuesto.reset();
  }

  limpiarControlServicioTrabajo() {
    this.formServicioTrabajo.reset();
  }

  limpiarControlServicio() {
    this.limpiarControlServicioRepuesto();
    this.limpiarControlServicioTrabajo();
    this.formServicio.reset();
    this.placas$ = this.placaService.getNotInService();
    this.totalServicio = 0;
    this.totalTrabajo = 0;
    this.totalRepuesto = 0;
    this.idSegmento = 0;
    this.idSucursal = 1;
    this.repuestoSeleccionado = null;
    this.servicio = new Servicio();
    this.servicio.fechaHora = moment(new Date()).format(this.formatoFecha);
    this.servicioRepuestos = [];
    this.servicioTrabajos = [];
    this.formServicio.patchValue({
      sucursal: this.idSucursal
    })
  }

  agregarServicioTrabajo() {
    let servicioTrabajo = new ServicioTrabajo();
    servicioTrabajo.descripcionTrabajo = this.formServicioTrabajo.value['descripcion'];
    servicioTrabajo.costo = this.formServicioTrabajo.value['costo'];
    this.servicioTrabajos.push(servicioTrabajo);

    this.totalTrabajo += servicioTrabajo.costo;
    this.totalServicio += servicioTrabajo.costo;
    this.totalServicio = parseFloat(this.totalServicio.toFixed(2));
    this.limpiarControlServicioTrabajo();
  }

  removerServicioTrabajo(index : number) {
    this.totalTrabajo -= this.servicioTrabajos[index].costo;
    this.totalServicio -= this.servicioTrabajos[index].costo;
    this.servicioTrabajos.splice(index, 1);
  }

  agregarServicioRepuesto() {
    let cont = 0;
    for(let i = 0; i < this.servicioRepuestos.length; i++) {
      let cotizacionRepuestoAux = this.servicioRepuestos[i];
      if((cotizacionRepuestoAux.repuesto.idRepuesto === this.repuestoSeleccionado.idRepuesto)) {
        cont++;
        break;
      }
    }

    if(cont > 0) {
      let mensaje = 'Este repuesto ya se encuentra agregado'
      this.snackBar.open(mensaje, "AVISO", { duration : 2000});
    } else {
      let servicioRepuesto = new ServicioRepuesto();
      servicioRepuesto.repuesto = this.repuestoSeleccionado;
      servicioRepuesto.cantidad = this.formServicioRepuesto.value['cantidad'];
      servicioRepuesto.costoUnitario = this.formServicioRepuesto.value['costoUnitario'];
      servicioRepuesto.costoTotal = servicioRepuesto.cantidad * servicioRepuesto.costoUnitario;

      servicioRepuesto.costoTotal = parseFloat(servicioRepuesto.costoTotal.toFixed(2));
      
      this.servicioRepuestos.push(servicioRepuesto);
      this.totalRepuesto += servicioRepuesto.costoTotal;
      this.totalServicio += servicioRepuesto.costoTotal;

      this.totalServicio = parseFloat(this.totalServicio.toFixed(2));

      this.limpiarControlServicioRepuesto();
    }
  }

  removerServicioRepuesto(index : number) {
    this.totalRepuesto -= this.servicioRepuestos[index].costoTotal;
    this.totalServicio -= this.servicioRepuestos[index].costoTotal;
    this.servicioRepuestos.splice(index, 1);
  }

  evaluarBotonCrear() {
    if(!this.formServicio.invalid && (this.servicioRepuestos.length > 0 || this.servicioTrabajos.length > 0) 
    && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  evaluarBotonEliminar() {
    if(this.servicio!=null && this.servicio.idServicio>0 && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  evaluarBotonAniadirTrabajo() {
    if(!this.formServicioTrabajo.invalid && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  evaluarBotonAniadirRepuesto() {
    if(!this.formServicioRepuesto.invalid && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  abrirServicioDialogoBuscar() {
    let dialogRef = this.dialog.open(ServicioDialogoBuscarComponent, {
      width: 'auto',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data != undefined) {
        this.limpiarControlServicio();
        this.servicio = data;
        this.placas$ = this.placaService.getAll();
        this.cargarServicioBusqueda();
      }
    });
  }

  cargarServicioBusqueda() {
    this.servicio.fechaHora = moment(this.servicio.fechaHora).format(this.formatoFechaHora);
    this.totalServicio = this.servicio.costoTotal;
    this.servicioRepuestos = this.servicio.servicioRepuesto;
    this.servicioTrabajos = this.servicio.servicioTrabajo;
    this.idSegmento = this.servicio.segmento.idSegmento;
    this.idSucursal = this.servicio.sucursal.idSucursal;
    this.idPlaca = this.servicio.placa.idPlaca;
    this.idServicioTipo = this.servicio.servicioTipo.idServicioTipo;

    this.formServicio = new FormGroup({
      'segmento' : new FormControl(this.idSegmento, Validators.required),
      'sucursal' : new FormControl(this.idSucursal, Validators.required),
      'placa' : new FormControl(this.idPlaca, Validators.required),
      'servicioTipo' : new FormControl(this.idServicioTipo, Validators.required),
      'kilometrajeActual' : new FormControl(this.servicio.kilometrajeRecorrido, Validators.required),
      'kilometrajeProximo' : new FormControl(this.servicio.kilometrajeProximoServicio, Validators.required)
    });

    for(let i = 0; i < this.servicioTrabajos.length; i++) {
      this.servicioTrabajos[i].idServicioTrabajo = null;
      this.totalTrabajo += this.servicioTrabajos[i].costo; 
    }

    for(let i = 0; i < this.servicioRepuestos.length; i++) {
      this.servicioRepuestos[i].idServicioRepuesto = null;
      this.totalRepuesto += this.servicioRepuestos[i].costoTotal;
    }

    this.formServicio.get('segmento').disable();
    this.formServicio.get('placa').disable();
    this.formServicio.get('servicioTipo').disable();
  }

  abrirServicioDialogoEliminar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(ServicioDialogoEliminarComponent, {
        width: 'auto',
        height: 'auto',
        data: this.servicio
      });
  
      dialogRef.afterClosed().subscribe(data => {
        if(data) {
          this.limpiarControlServicio();
          this.placas$ = this.placaService.getNotInService();
        }
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }
  
  operar() {
    if(this.servicio.idServicio > 0) {
      this.servicio.segmento = new Segmento();
      this.servicio.segmento.idSegmento = this.idSegmento;
      this.servicio.placa = new Placa();
      this.servicio.placa.idPlaca = this.idPlaca;
      this.servicio.servicioTipo = new ServicioTipo();
      this.servicio.servicioTipo.idServicioTipo = this.idServicioTipo;
      this.servicio.kilometrajeRecorrido = this.formServicio.value['kilometrajeActual'];
      this.servicio.kilometrajeProximoServicio = this.formServicio.value['kilometrajeProximo'];
      this.servicio.fechaHora = null;
      this.servicio.servicioRepuesto = this.servicioRepuestos;
      this.servicio.servicioTrabajo = this.servicioTrabajos;
      this.servicio.sucursal = new Sucursal();
      this.servicio.sucursal.idSucursal = this.idSucursal;

      if(this.servicio.cotizacion!=null && this.servicio.cotizacion.idCotizacion==0) {
        this.servicio.cotizacion = null;
      }
      
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.EDITAR)) {
        this.spinner.show()
        this.servicioService.updateMod(this.servicio, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          this.placas$ = this.placaService.getNotInService();
          this.formServicio.get('segmento').enable();
          this.formServicio.get('placa').enable();
          this.formServicio.get('servicioTipo').enable();
          return this.servicioService.getAll();
        })).subscribe(data => {
          this.servicioService.setObjetoCambio(data);
          this.spinner.hide()
          this.servicioService.setMensajeCambio('Servicio actualizado');
          this.limpiarControlServicio();
        }, (error:any) => this.spinner.hide());
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    } else {
      this.servicio = new Servicio();
      this.servicio.segmento = new Segmento();
      this.servicio.segmento.idSegmento = this.idSegmento;
      this.servicio.placa = new Placa();
      this.servicio.placa.idPlaca = this.idPlaca;
      this.servicio.servicioTipo = new ServicioTipo();
      this.servicio.servicioTipo.idServicioTipo = this.idServicioTipo;
      this.servicio.kilometrajeRecorrido = this.formServicio.value['kilometrajeActual'];
      this.servicio.kilometrajeProximoServicio = this.formServicio.value['kilometrajeProximo'];
      this.servicio.fechaHora = null;
      this.servicio.servicioRepuesto = this.servicioRepuestos;
      this.servicio.servicioTrabajo = this.servicioTrabajos;
      this.servicio.sucursal = new Sucursal();
      this.servicio.sucursal.idSucursal = this.idSucursal;

      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CREAR)) {
        this.spinner.show()
        this.servicioService.createMod(this.servicio, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          this.placas$ = this.placaService.getNotInService();
          return this.servicioService.getAll();
        })).subscribe(data => {
          this.servicioService.setObjetoCambio(data);
          this.spinner.hide()
          this.servicioService.setMensajeCambio('Servicio creado');
          this.limpiarControlServicio();
        }, (error:any) => this.spinner.hide());
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    }
  }

}
