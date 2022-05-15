import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { ServicioTipoDialogoEliminarComponent } from './servicio-tipo-dialogo-eliminar/servicio-tipo-dialogo-eliminar.component';
import { ServicioTipoDialogoComponent } from './servicio-tipo-dialogo/servicio-tipo-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServicioTipoService } from './../../_service/servicio-tipo.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioTipo } from 'src/app/_model/servicioTipo';

@Component({
  selector: 'app-servicio-tipo',
  templateUrl: './servicio-tipo.component.html',
  styleUrls: ['./servicio-tipo.component.css']
})
export class ServicioTipoComponent implements OnInit {

  displayedColumns = ['nombre', 'acciones'];
  dataSource: MatTableDataSource<ServicioTipo>;
  @ViewChild(MatSort) sort : MatSort;

  servicioTipoNombre : string;
  form: FormGroup;

  idVentana : number = VentanaUtil.SOPORTE;

  constructor(
    private servicioTipoService : ServicioTipoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('', [Validators.minLength(3)])
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIO_TIPOS, PermisoUtil.CONSULTAR)) {
      this.servicioTipoService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });

      this.servicioTipoService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
    }

    this.servicioTipoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });
    
  }

  f() {
    return this.form.controls;
  }

  guardar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIO_TIPOS, PermisoUtil.CREAR)) {
      let servicioTipo = new ServicioTipo();
      servicioTipo.nombre = this.form.value['nombre'];
      this.servicioTipoService.create(servicioTipo).pipe(switchMap(() => {
      return this.servicioTipoService.getAll();
    })).subscribe(data => {
      this.servicioTipoService.setObjetoCambio(data);
      this.servicioTipoService.setMensajeCambio('Tipo de servicio creado');
    });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirDialogoEdicion(servicioTipo : ServicioTipo) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIO_TIPOS, PermisoUtil.EDITAR)) {
      this.dialog.open(ServicioTipoDialogoComponent, {
        width: '250px',
        data: servicioTipo
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirDialogoEliminar(servicioTipo : ServicioTipo) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIO_TIPOS, PermisoUtil.ELIMINAR)) {
      this.dialog.open(ServicioTipoDialogoEliminarComponent, {
        width: '300px',
        data: servicioTipo
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }
}
