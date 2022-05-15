import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { Usuario } from './../../../_model/usuario';
import { SegmentoService } from './../../../_service/segmento.service';
import { UsuarioService } from './../../../_service/usuario.service';
import { Segmento } from './../../../_model/segmento';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Cotizacion } from './../../../_model/cotizacion';
import { MatDialogRef } from '@angular/material/dialog';
import { CotizacionService } from './../../../_service/cotizacion.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-cotizacion-dialogo-buscar',
  templateUrl: './cotizacion-dialogo-buscar.component.html',
  styleUrls: ['./cotizacion-dialogo-buscar.component.css']
})
export class CotizacionDialogoBuscarComponent implements OnInit {

  formBusqueda : FormGroup;

  idSegmento : number = 0;
  segmentos$ : Observable<Segmento[]>;

  idUsuario : number = 0;
  usuarios$ : Observable<Usuario[]>;

  idBusqueda : number = 0;
  dataSource : MatTableDataSource<Cotizacion>;
  cotizacionFormato : Cotizacion[] = [];
  displayedColumns = ['segmento', 'fechaHora', 'total', 'usuario'];

  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  formatoFechaHoraB : string = 'YYYY-MM-DD HH:mm:ss';
  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  myControlSegmento : FormControl = new FormControl('', Validators.required);
  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);
  myControlUsuario : FormControl = new FormControl('', Validators.required);

  idVentana : number = VentanaUtil.COTIZACIONES;

  constructor(
    private cotizacionService : CotizacionService,
    private segmentoService : SegmentoService,
    private usuarioService : UsuarioService,
    private dialogRef : MatDialogRef<CotizacionDialogoBuscarComponent>,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.segmentos$ = this.segmentoService.getAll();

    this.usuarios$ = this.usuarioService.getAll();

    this.initForm();
  }

  initForm() {
    this.formBusqueda = new FormGroup({
      'segmento' : this.myControlSegmento,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin,
      'usuario' : this.myControlUsuario
    });

    this.formBusqueda.get('segmento').disable();
    this.formBusqueda.get('usuario').disable();
    this.formBusqueda.get('fechaInicio').disable();
    this.formBusqueda.get('fechaFin').disable();
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
      this.setSegmentoInput(true);
      this.setFechaInput(false);
      this.setUsuarioInput(false);
    } else if(this.idBusqueda == 2) {
      this.setSegmentoInput(false);
      this.setFechaInput(true);
      this.setUsuarioInput(false);
    } else if(this.idBusqueda == 3) {
      this.setSegmentoInput(false);
      this.setFechaInput(false);
      this.setUsuarioInput(true);
    }
  }

  setSegmentoInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.cotizacionFormato = [];
    this.myControlSegmento.reset();
    if(e) {
      this.formBusqueda.get('segmento').enable();
    } else {
      this.formBusqueda.get('segmento').disable();
    }
  }

  setUsuarioInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.cotizacionFormato = [];
    this.myControlUsuario.reset();
    if(e) {
      this.formBusqueda.get('usuario').enable();
    } else {
      this.formBusqueda.get('usuario').disable();
    }
  }

  setFechaInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.cotizacionFormato = [];
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

  buscar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.COTIZACIONES, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      if(this.idBusqueda == 0) {
        this.spinner.hide()
        return;
      } else if(this.idBusqueda == 1) {
        this.cotizacionService.getBySegmento(this.idSegmento).subscribe(data => {
          this.cotizacionFormato = [];
          for(let cotizacion of data) {
            cotizacion.fechaHora = moment(cotizacion.fechaHora).format(this.formatoFechaHoraB);
            this.cotizacionFormato.push(cotizacion);
          }
          this.dataSource = new MatTableDataSource(this.cotizacionFormato);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 2) {
        this.cotizacionService.getByFecha(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.cotizacionFormato = [];
          for(let cotizacion of data) {
            cotizacion.fechaHora = moment(cotizacion.fechaHora).format(this.formatoFechaHoraB);
            this.cotizacionFormato.push(cotizacion);
          }
          this.dataSource = new MatTableDataSource(this.cotizacionFormato);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 3) {
        this.cotizacionService.getByUsuario(this.idUsuario).subscribe(data => {
          this.cotizacionFormato = [];
          for(let cotizacion of data) {
            cotizacion.fechaHora = moment(cotizacion.fechaHora).format(this.formatoFechaHoraB);
            this.cotizacionFormato.push(cotizacion);
          }
          this.dataSource = new MatTableDataSource(this.cotizacionFormato);
          this.spinner.hide()
        });
      }
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  cerrar(cotizacion : Cotizacion) {
    this.dialogRef.close(cotizacion);
  }

  evaluarBotonBuscar() {
    if(this.formBusqueda.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }
  
}
