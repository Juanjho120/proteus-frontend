import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SegmentoCreditoDetalleService } from './../../../_service/segmento-credito-detalle.service';
import { ServicioDTO } from './../../../_model/dto/servicioDTO';
import { Placa } from './../../../_model/placa';
import { MatTableDataSource } from '@angular/material/table';
import { Servicio } from './../../../_model/servicio';
import { ServicioTipoService } from './../../../_service/servicio-tipo.service';
import { PlacaService } from './../../../_service/placa.service';
import { ServicioService } from './../../../_service/servicio.service';
import { SegmentoService } from './../../../_service/segmento.service';
import { Observable } from 'rxjs';
import { Segmento } from './../../../_model/segmento';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ServicioTipo } from 'src/app/_model/servicioTipo';
import { LoaderService } from 'src/app/_service/loader.service';
import { SucursalService } from 'src/app/_service/sucursal.service';
import { Sucursal } from 'src/app/_model/sucursal';

@Component({
  selector: 'app-servicio-busqueda',
  templateUrl: './servicio-busqueda.component.html',
  styleUrls: ['./servicio-busqueda.component.css']
})
export class ServicioBusquedaComponent implements OnInit {

  formBusqueda : FormGroup;

  idSegmento : number = 0;
  segmentos$ : Observable<Segmento[]>;

  idPlaca : number = 0;
  placas$ : Observable<Placa[]>;

  idSucursal : number = 1;
  sucursales$ : Observable<Sucursal[]>;

  idServicioTipo : number = 0;
  servicioTipos$ : Observable<ServicioTipo[]>;
  
  formatoFecha : string = 'YYYY-MM-DD';
  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  myControlSegmento : FormControl = new FormControl('', Validators.required);
  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);
  myControlPlaca : FormControl = new FormControl('', Validators.required);
  myControlServicioTipo : FormControl = new FormControl('', Validators.required);

  porFinalizado : boolean = false;
  porFacturado : boolean = false;
  idBusqueda : number = 0;

  dataSource : MatTableDataSource<ServicioDTO>;
  servicioFormato : Servicio[] = [];

  displayedColumns = ['noServicio', 'fecha', 'servicioTipo', 'placa', 'segmento', 'proximoServicio', 'costoTrabajo', 'costoRepuesto', 'costoTotal', 'facturar', 'finalizar'];
  servicios : Servicio[] = [];
  serviciosDTO : ServicioDTO[] = [];

  idVentana : number = VentanaUtil.SERVICIOS;

  constructor(  
    private servicioService : ServicioService,
    private sucursalService : SucursalService,
    private segmentoService : SegmentoService,
    private placaService : PlacaService,
    private servicioTipoService : ServicioTipoService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentos$ = this.segmentoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CONSULTAR)) {
      this.placas$ = this.placaService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIO_TIPOS, PermisoUtil.CONSULTAR)) {
      this.servicioTipos$ = this.servicioTipoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.servicioService.getByFinalizado(false).subscribe(data => {
        for(let servicio of data) {
          this.serviciosDTO.push(this.convertirServicio(servicio));
        }
        this.filtrarPorSucursal();
      });
    }

    this.servicioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.sucursales$ = this.sucursalService.getAll();

    this.initForm();
  }

  filtrarPorSucursal() {
    this.dataSource = new MatTableDataSource(this.serviciosDTO.filter((servicio) => this.idSucursal > 0 ? servicio.idSucursal == this.idSucursal : servicio));
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

  initForm() {
    this.formBusqueda = new FormGroup({
      'segmento' : this.myControlSegmento,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin,
      'placa' : this.myControlPlaca,
      'servicioTipo' : this.myControlServicioTipo,
    });

    this.formBusqueda.get('segmento').disable();
    this.formBusqueda.get('fechaInicio').disable();
    this.formBusqueda.get('fechaFin').disable();
    this.formBusqueda.get('placa').disable();
    this.formBusqueda.get('servicioTipo').disable();
  }

  cambiarFechaInicio(e : any) {
    this.fechaInicioSeleccionada = e.value;
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFechaHora);
  }

  cambiarFechaFin(e : any) {
    this.fechaFinSeleccionada = e.value;
    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFechaHora);
  }

  setInputs() {
    if(this.idBusqueda == 1) {
      this.porFacturado = false;
      this.porFinalizado = false;
      this.setSegmentoInput(true);
      this.setFechaInput(false);
      this.setServicioTipoInput(false);
      this.setPlacaInput(false);
    } else if(this.idBusqueda == 2) {
      this.porFacturado = false;
      this.porFinalizado = false;
      this.setSegmentoInput(false);
      this.setFechaInput(true);
      this.setServicioTipoInput(false);
      this.setPlacaInput(false);
    } else if(this.idBusqueda == 3) {
      this.porFacturado = false;
      this.porFinalizado = false;
      this.setSegmentoInput(false);
      this.setFechaInput(false);
      this.setServicioTipoInput(true);
      this.setPlacaInput(false);
    } else if(this.idBusqueda == 4) {
      this.porFacturado = false;
      this.porFinalizado = false;
      this.setSegmentoInput(false);
      this.setFechaInput(false);
      this.setServicioTipoInput(false);
      this.setPlacaInput(true);
    } else if(this.idBusqueda == 0) {
      this.setSegmentoInput(false);
      this.setFechaInput(false);
      this.setServicioTipoInput(false);
      this.setPlacaInput(false);
    }
  }

  setSegmentoInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.servicioFormato = [];
    this.myControlSegmento.reset();
    if(e) {
      this.formBusqueda.get('segmento').enable();
    } else {
      this.formBusqueda.get('segmento').disable();
    }
  }

  setPlacaInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.servicioFormato = [];
    this.myControlPlaca.reset();
    if(e) {
      this.formBusqueda.get('placa').enable();
    } else {
      this.formBusqueda.get('placa').disable();
    }
  }

  setServicioTipoInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.servicioFormato = [];
    this.myControlServicioTipo.reset();
    if(e) {
      this.formBusqueda.get('servicioTipo').enable();
    } else {
      this.formBusqueda.get('servicioTipo').disable();
    }
  }

  setFechaInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.servicioFormato = [];
    this.myControlFechaInicio.reset();
    this.myControlFechaFin.reset();
    if(e) {
      this.formBusqueda.get('fechaInicio').enable();
      this.formBusqueda.get('fechaFin').enable();
    } else {
      this.formBusqueda.get('fechaInicio').disable();
      this.formBusqueda.get('fechaFin').disable();
    }
  }

  setFinalizar(idServicio : number ){
    let servicio = new Servicio();
    servicio.idServicio = idServicio;
    servicio.finalizado = true;
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.EDITAR)) {
      this.spinner.show()
      this.servicioService.updateFinalizado(servicio).subscribe(() => {
        this.servicioService.setMensajeCambio(`Servicio ${idServicio} finalizado`);
        this.spinner.hide()
        //ACTUALIZAR LA TABLA SEGUN PARAMETROS DE BUSQUEDA
        this.buscar();
      }, (error:any) => this.spinner.hide());
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  checkboxChange() {
    this.formBusqueda.reset();
    this.idBusqueda = 0;
    this.setInputs();
  }

  buscar() {
    this.serviciosDTO = [];
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      if(this.idBusqueda == 0 && this.porFacturado == false && this.porFinalizado == false) {
        this.servicioService.getByFinalizado(false).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 0 && this.porFacturado == true && this.porFinalizado == false) {
        this.servicioService.getByFacturado(this.porFacturado).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 0 && this.porFacturado == true && this.porFinalizado == true) {
        this.servicioService.getByFinalizadoAndFacturado(this.porFinalizado, this.porFacturado).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 0 && this.porFacturado == false && this.porFinalizado == true) {
        this.servicioService.getByFinalizado(this.porFinalizado).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 1) {
        this.servicioService.getBySegmento(this.idSegmento).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 2) {
        this.servicioService.getByFecha(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 3) {
        this.servicioService.getByServicioTipo(this.idServicioTipo).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      } else if(this.idBusqueda == 4) {
        this.servicioService.getByPlaca(this.idPlaca).subscribe(data => {
          for(let servicio of data) {
            this.serviciosDTO.push(this.convertirServicio(servicio));
          }
          this.filtrarPorSucursal();
          this.spinner.hide()
        }, (error:any) => this.spinner.hide());
      }
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  evaluarBotonBuscar() {
    if(this.formBusqueda.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

}
