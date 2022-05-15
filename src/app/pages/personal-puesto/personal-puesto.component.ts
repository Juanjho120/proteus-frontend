import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { PersonalPuestoDialogoEliminarComponent } from './personal-puesto-dialogo-eliminar/personal-puesto-dialogo-eliminar.component';
import { PersonalPuestoDialogoComponent } from './personal-puesto-dialogo/personal-puesto-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PersonalPuestoService } from './../../_service/personal-puesto.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalPuesto } from './../../_model/personalPuesto';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-personal-puesto',
  templateUrl: './personal-puesto.component.html',
  styleUrls: ['./personal-puesto.component.css']
})
export class PersonalPuestoComponent implements OnInit {

  displayedColumns = ['nombre', 'acciones'];
  dataSource: MatTableDataSource<PersonalPuesto>;
  @ViewChild(MatSort) sort : MatSort;

  personalPuestoNombre : string;
  form : FormGroup;

  idVentana : number = VentanaUtil.SOPORTE;

  constructor(
    private personalPuestoService : PersonalPuestoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl('', [Validators.minLength(3)])
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL_PUESTOS, PermisoUtil.CONSULTAR)) {
      this.personalPuestoService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });

      this.personalPuestoService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
    }
    
    this.personalPuestoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });
    
  }

  f() {
    return this.form.controls;
  }

  guardar() {
    let personalPuesto = new PersonalPuesto();
    personalPuesto.nombre = this.form.value['nombre'].toUpperCase();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL_PUESTOS, PermisoUtil.CREAR)) {
      this.personalPuestoService.createMod(personalPuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
        return this.personalPuestoService.getAll();
      })).subscribe(data => {
        this.personalPuestoService.setObjetoCambio(data);
        this.personalPuestoService.setMensajeCambio('Puesto de personal creado');
        this.form.reset();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoEdicion(personalPuesto : PersonalPuesto) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL_PUESTOS, PermisoUtil.EDITAR)) {
      this.dialog.open(PersonalPuestoDialogoComponent, {
        width: '250px',
        data: personalPuesto
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoEliminar(personalPuesto : PersonalPuesto) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL_PUESTOS, PermisoUtil.ELIMINAR)) {
      this.dialog.open(PersonalPuestoDialogoEliminarComponent, {
        width: '300px',
        data: personalPuesto
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

}
