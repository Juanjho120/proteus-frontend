import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { DetalleEliminacionDialogoComponent } from './detalle-eliminacion-dialogo/detalle-eliminacion-dialogo.component';
import { DetalleActualizacionDialogoComponent } from './detalle-actualizacion-dialogo/detalle-actualizacion-dialogo.component';
import { DetalleCreacionDialogoComponent } from './detalle-creacion-dialogo/detalle-creacion-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { ModificacionDTO } from './../../_model/dto/modificacionDTO';
import { Modificacion } from './../../_model/modificacion';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from './../../_service/usuario.service';
import { Usuario } from './../../_model/usuario';
import { Observable } from 'rxjs';
import { ModificacionService } from './../../_service/modificacion.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-modificacion',
  templateUrl: './modificacion.component.html',
  styleUrls: ['./modificacion.component.css']
})
export class ModificacionComponent implements OnInit {

  formModificacionBusqueda : FormGroup;

  usuarios$ : Observable<Usuario[]>;
  idUsuario : number = 0;

  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  formatoFechaHoraBusqueda : string = 'YYYY-MM-DD HH:mm:ss';
  maxFecha: Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  dataSourceCreacion : MatTableDataSource<any>;
  dataSourceActualizacion : MatTableDataSource<any>;
  dataSourceEliminacion : MatTableDataSource<any>;

  modificaciones : Modificacion[] = [];

  displayedColumnsModificacion = ['fechaHora', 'detalle', 'accion'];

  idVentana : number = VentanaUtil.MODIFICACIONES;

  constructor(
    private modificacionService : ModificacionService,
    private usuarioService : UsuarioService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFechaHora);

    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFechaHora);

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MODIFICACIONES, PermisoUtil.CONSULTAR)) {
      this.modificacionService.getByFechaHora(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
        this.modificaciones = data;
        this.clasificarModificaciones(this.modificaciones);
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.USUARIOS, PermisoUtil.CONSULTAR)) {
      this.usuarios$ = this.usuarioService.getAll();
    }
    
    this.formModificacionBusqueda = new FormGroup({
      'fechaInicio' : new FormControl('', Validators.required),
      'fechaFin' : new FormControl('', Validators.required),
      'usuario' : new FormControl('')
    });
  }

  cambiarFechaInicio(e : any) {
    this.fechaInicioSeleccionada = e.value;
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFechaHora);
  }

  cambiarFechaFin(e : any) {
    this.fechaFinSeleccionada = e.value;
    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFechaHora);
  }

  clasificarModificaciones(modificaciones : Modificacion[]) {
    let modificacionesCreacion : ModificacionDTO[] = [];
    let modificacionesActualizacion : ModificacionDTO[] = [];
    let modificacionesEliminacion : ModificacionDTO[] = [];
    for(let modificacion of modificaciones) {
      if(modificacion.concepto.nombre==='CREACION') {
        let modificacionDTO = new ModificacionDTO();
        modificacionDTO.idModificacion = modificacion.idModificacion;
        modificacionDTO.idItem = modificacion.idItem;
        modificacionDTO.valorAnterior = modificacion.valorAnterior;
        modificacionDTO.valorActual = modificacion.valorActual;
        modificacionDTO.tabla = modificacion.tabla;
        modificacionDTO.columna = modificacion.columna;
        modificacionDTO.fechaHora = moment(modificacion.fechaHora).format(this.formatoFechaHoraBusqueda);
        modificacionDTO.detalle = `El usuario ${modificacion.usuario.nombre} ${modificacion.usuario.apellido} ha creado el registro ${modificacion.idItem} en ${modificacion.tabla}`
        modificacionesCreacion.push(modificacionDTO);
      } else if(modificacion.concepto.nombre==='ACTUALIZACION') {
        let modificacionDTO = new ModificacionDTO();
        modificacionDTO.idModificacion = modificacion.idModificacion;
        modificacionDTO.idItem = modificacion.idItem;
        modificacionDTO.valorAnterior = modificacion.valorAnterior;
        modificacionDTO.valorActual = modificacion.valorActual;
        modificacionDTO.tabla = modificacion.tabla;
        modificacionDTO.columna = modificacion.columna;
        modificacionDTO.fechaHora = moment(modificacion.fechaHora).format(this.formatoFechaHoraBusqueda);
        modificacionDTO.detalle = `El usuario ${modificacion.usuario.nombre} ${modificacion.usuario.apellido} ha modificado el campo ${modificacion.columna} del registro ${modificacion.idItem} en ${modificacion.tabla}`
        modificacionesActualizacion.push(modificacionDTO);
      } else if(modificacion.concepto.nombre==='ELIMINACION') {
        let modificacionDTO = new ModificacionDTO();
        modificacionDTO.idModificacion = modificacion.idModificacion;
        modificacionDTO.idItem = modificacion.idItem;
        modificacionDTO.valorAnterior = modificacion.valorAnterior;
        modificacionDTO.valorActual = modificacion.valorActual;
        modificacionDTO.tabla = modificacion.tabla;
        modificacionDTO.columna = modificacion.columna;
        modificacionDTO.fechaHora = moment(modificacion.fechaHora).format(this.formatoFechaHoraBusqueda);
        modificacionDTO.detalle = `El usuario ${modificacion.usuario.nombre} ${modificacion.usuario.apellido} ha eliminado el campo ${modificacion.columna} del registro ${modificacion.idItem} en ${modificacion.tabla}`
        modificacionesEliminacion.push(modificacionDTO);
      }
    }

    this.dataSourceCreacion = new MatTableDataSource(modificacionesCreacion);
    this.dataSourceActualizacion = new MatTableDataSource(modificacionesActualizacion);
    this.dataSourceEliminacion = new MatTableDataSource(modificacionesEliminacion);
  }

  buscarModificacion() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MODIFICACIONES, PermisoUtil.CONSULTAR)) {
      this.dataSourceCreacion = new MatTableDataSource();
      this.dataSourceActualizacion = new MatTableDataSource();
      this.dataSourceEliminacion = new MatTableDataSource();

      if(this.idUsuario==0) {
        this.modificacionService.getByFechaHora(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.modificaciones = data;
          this.clasificarModificaciones(this.modificaciones);
        });
      } else {
        this.modificacionService.getByFechaHoraAndUsuario(this.fechaInicioFormato, this.fechaFinFormato, this.idUsuario).subscribe(data => {
          this.modificaciones = data;
          this.clasificarModificaciones(this.modificaciones);
        });
      }
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  verCreacionDetalle(modificacionDTO : ModificacionDTO) {
    this.dialog.open(DetalleCreacionDialogoComponent, {
      width: '400px',
      data: modificacionDTO
    });
  }

  verActualizacionDetalle(modificacionDTO : ModificacionDTO) {
    this.dialog.open(DetalleActualizacionDialogoComponent, {
      width: '400px',
      data: modificacionDTO
    });
  }

  verEliminacionDetalle(modificacionDTO : ModificacionDTO) {
    this.dialog.open(DetalleEliminacionDialogoComponent, {
      width: '400px',
      data: modificacionDTO
    });
  }

}
