import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { RecursoHumanoDialogoEliminarComponent } from './recurso-humano-dialogo-eliminar/recurso-humano-dialogo-eliminar.component';
import { switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Personal } from 'src/app/_model/personal';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PersonalPuesto } from './../../_model/personalPuesto';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PersonalPuestoService } from './../../_service/personal-puesto.service';
import { PersonalService } from './../../_service/personal.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos-humanos.component.html',
  styleUrls: ['./recursos-humanos.component.css']
})
export class RecursosHumanosComponent implements OnInit {

  personalPuestos$ : Observable<PersonalPuesto[]>;
  idPersonalPuesto : number = 0;

  @ViewChild(MatSort) sort : MatSort;
  dataSource : MatTableDataSource<Personal>;
  displayedColumns = ['nombre', 'telefono', 'puesto', 'acciones'];

  formPersonal : FormGroup;

  personal : Personal = new Personal();

  idVentana : number = VentanaUtil.RECURSOS_HUMANOS;

  constructor(
    private personalService : PersonalService,
    private personalPuestoService : PersonalPuestoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL_PUESTOS, PermisoUtil.CONSULTAR)) {
      this.personalPuestos$ = this.personalPuestoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL, PermisoUtil.CONSULTAR)) {
      this.personalService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
  
      this.personalService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
    }

    this.personalService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.initFormPersonal();
  }

  initFormPersonal() {
    this.formPersonal = new FormGroup({
      'id' : new FormControl(''),
      'nombre' : new FormControl('', Validators.required),
      'telefono' : new FormControl(''),
      'puesto' : new FormControl('', Validators.required)
    });
  }

  filter(value : string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  operar() {
    this.personal = new Personal();
    this.personal.idPersonal = this.formPersonal.value['id'];
    this.personal.nombre = this.formPersonal.value['nombre'].toUpperCase();
    this.personal.telefono = this.formPersonal.value['telefono'];
    this.personal.personalPuesto = new PersonalPuesto
    this.personal.personalPuesto.idPersonalPuesto = this.idPersonalPuesto;

    if(this.personal.idPersonal != null && this.personal.idPersonal>0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL, PermisoUtil.EDITAR)) {
        this.personalService.updateMod(this.personal, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.personalService.getAll();
        })).subscribe(data => {
          this.personalService.setObjetoCambio(data);
          this.personalService.setMensajeCambio('Personal actualizado');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL, PermisoUtil.CREAR)) {
        this.personalService.createMod(this.personal, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.personalService.getAll();
        })).subscribe(data => {
          this.personalService.setObjetoCambio(data);
          this.personalService.setMensajeCambio('Personal creado');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    }
    
    this.formPersonal.reset();
    this.idPersonalPuesto = 0;
  }

  formularioEdicion(personal : Personal) {
    this.idPersonalPuesto = personal.personalPuesto.idPersonalPuesto;
    this.formPersonal.patchValue({
      id : personal.idPersonal,
      nombre : personal.nombre,
      telefono : personal.telefono,
      puesto : personal.personalPuesto.nombre
    });
  }

  nuevoPersonal() {
    this.formPersonal.reset();
    this.idPersonalPuesto = 0;
  }

  abrirDialogoEliminar(personal : Personal) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL, PermisoUtil.ELIMINAR)) {
      this.dialog.open(RecursoHumanoDialogoEliminarComponent, {
        width: '300px',
        data: personal
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

}
