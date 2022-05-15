import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { MarcaRepuestoDialogoComponent } from './marca-repuesto-dialogo/marca-repuesto-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MarcaRepuestoService } from './../../_service/marca-repuesto.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MarcaRepuesto } from 'src/app/_model/marcaRepuesto';
import { MarcaRepuestoDialogoEliminarComponent } from './../marca-repuesto/marca-repuesto-dialogo-eliminar/marca-repuesto-dialogo-eliminar.component';

@Component({
  selector: 'app-marca-repuesto',
  templateUrl: './marca-repuesto.component.html',
  styleUrls: ['./marca-repuesto.component.css']
})
export class MarcaRepuestoComponent implements OnInit {

  displayedColumns = ['nombre', 'acciones'];
  dataSource: MatTableDataSource<MarcaRepuesto>;
  @ViewChild(MatSort) sort: MatSort;

  marcaRepuestoNombre : string;
  form: FormGroup;

  idVentana : number = VentanaUtil.SOPORTE;

  constructor(
    private marcaRepuestoService : MarcaRepuestoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('', [Validators.minLength(3)])
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_REPUESTO, PermisoUtil.CONSULTAR)) {
      this.marcaRepuestoService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });

      this.marcaRepuestoService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
    }

    this.marcaRepuestoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

  }

  f() {
    return this.form.controls;
  }

  guardar() {
    let marcaRepuesto = new MarcaRepuesto();
    marcaRepuesto.nombre = this.form.value['nombre'].toUpperCase();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_REPUESTO, PermisoUtil.CREAR)) {

    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    this.marcaRepuestoService.createMod(marcaRepuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
      return this.marcaRepuestoService.getAll();
    })).subscribe(data => {
      this.marcaRepuestoService.setObjetoCambio(data);
      this.marcaRepuestoService.setMensajeCambio('Marca de repuesto creado');
      this.form.reset();
    });
  }

  abrirDialogoEdicion(marcaRepuesto : MarcaRepuesto) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_REPUESTO, PermisoUtil.EDITAR)) {
      this.dialog.open(MarcaRepuestoDialogoComponent, {
        width: '250px',
        data: marcaRepuesto
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoEliminar(marcaRepuesto : MarcaRepuesto) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_REPUESTO, PermisoUtil.ELIMINAR)) {
      this.dialog.open(MarcaRepuestoDialogoEliminarComponent, {
        width: '300px',
        data: marcaRepuesto
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

}
