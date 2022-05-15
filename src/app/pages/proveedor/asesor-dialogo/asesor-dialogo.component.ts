import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorAsesorService } from './../../../_service/proveedor-asesor.service';
import { ProveedorAsesor } from './../../../_model/proveedorAsesor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-asesor-dialogo',
  templateUrl: './asesor-dialogo.component.html',
  styleUrls: ['./asesor-dialogo.component.css']
})
export class AsesorDialogoComponent implements OnInit {

  form: FormGroup;
  proveedorAsesor : ProveedorAsesor;

  idVentana : number = VentanaUtil.PROVEEDORES;

  constructor(
    private dialogRef : MatDialogRef<AsesorDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ProveedorAsesor,
    private proveedorAsesorService : ProveedorAsesorService,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.proveedorAsesor = new ProveedorAsesor();
    this.proveedorAsesor.idProveedorAsesor = this.data.idProveedorAsesor;
    this.proveedorAsesor.proveedor = this.data.proveedor;
    this.proveedorAsesor.nombre = this.data.nombre;
    this.proveedorAsesor.telefono = this.data.telefono;

    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      'id' : new FormControl(this.proveedorAsesor.idProveedorAsesor),
      'proveedor' : new FormControl(this.proveedorAsesor.proveedor),
      'nombre' : new FormControl(this.proveedorAsesor.nombre, Validators.required),
      'telefono' : new FormControl(this.proveedorAsesor.telefono, Validators.required)
    });
  }

  f() {
    return this.form.controls;
  }

  operar() {
    if(this.form.invalid) {return; }
    this.proveedorAsesor.nombre = this.form.value['nombre'].toUpperCase();
    this.proveedorAsesor.telefono = this.form.value['telefono'];

    if(this.proveedorAsesor.idProveedorAsesor > 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDOR_ASESORES, PermisoUtil.EDITAR)) {
        this.proveedorAsesorService.updateMod(this.proveedorAsesor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.proveedorAsesorService.getAll();
        })).subscribe(data => {
          this.proveedorAsesorService.setObjetoCambio(data);
          this.proveedorAsesorService.setMensajeCambio('Asesor actualizado');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDOR_ASESORES, PermisoUtil.CREAR)) {
        this.proveedorAsesorService.createMod(this.proveedorAsesor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.proveedorAsesorService.getAll();
        })).subscribe(data => {
          this.proveedorAsesorService.setObjetoCambio(data);
          this.proveedorAsesorService.setMensajeCambio('Asesor creado');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
