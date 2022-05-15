import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { MarcaAutoDialogoEliminarComponent } from './marca-auto-dialogo-eliminar/marca-auto-dialogo-eliminar.component';
import { MarcaAutoDialogoComponent } from './marca-auto-dialogo/marca-auto-dialogo.component';
import { MarcaAutoService } from './../../_service/marca-auto.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarcaAuto } from 'src/app/_model/marcaAuto';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-marca-auto',
  templateUrl: './marca-auto.component.html',
  styleUrls: ['./marca-auto.component.css']
})
export class MarcaAutoComponent implements OnInit {

  displayedColumns = ['nombre', 'acciones'];
  dataSource: MatTableDataSource<MarcaAuto>;
  @ViewChild(MatSort) sort : MatSort;

  marcaAutoNombre : string;
  form: FormGroup;

  idVentana : number = VentanaUtil.SOPORTE;

  constructor(
    private marcaAutoService : MarcaAutoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('', [Validators.minLength(3)])
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_AUTO, PermisoUtil.CONSULTAR)) {
      this.marcaAutoService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });

      this.marcaAutoService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
    }

    this.marcaAutoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

  }

  f() {
    return this.form.controls;
  }

  guardar() {
    let marcaAuto = new MarcaAuto();
    marcaAuto.nombre = this.form.value['nombre'].toUpperCase();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_AUTO, PermisoUtil.CREAR)) {
      this.marcaAutoService.createMod(marcaAuto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
        return this.marcaAutoService.getAll();
      })).subscribe(data => {
        this.marcaAutoService.setObjetoCambio(data);
        this.marcaAutoService.setMensajeCambio('Marca de auto creado');
        this.form.reset();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoEdicion(marcaAuto : MarcaAuto) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_AUTO, PermisoUtil.EDITAR)) {
      this.dialog.open(MarcaAutoDialogoComponent, {
        width: '250px',
        data: marcaAuto
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoEliminar(marcaAuto : MarcaAuto) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_AUTO, PermisoUtil.ELIMINAR)) {
      this.dialog.open(MarcaAutoDialogoEliminarComponent, {
        width: '300px',
        data: marcaAuto
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

}
