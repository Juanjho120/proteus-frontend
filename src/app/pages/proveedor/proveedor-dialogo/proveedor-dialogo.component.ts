import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { ProveedorService } from './../../../_service/proveedor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Proveedor } from './../../../_model/proveedor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-proveedor-dialogo',
  templateUrl: './proveedor-dialogo.component.html',
  styleUrls: ['./proveedor-dialogo.component.css']
})
export class ProveedorDialogoComponent implements OnInit {

  form: FormGroup;
  proveedor : Proveedor;

  idVentana : number = VentanaUtil.PROVEEDORES;

  constructor(
    private dialogRef : MatDialogRef<ProveedorDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Proveedor,
    private proveedorService : ProveedorService,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.proveedor = new Proveedor();
    this.proveedor.idProveedor = this.data.idProveedor;
    this.proveedor.nombre = this.data.nombre;
    this.proveedor.direccionFiscal = this.data.direccionFiscal;
    this.proveedor.telefono = this.data.telefono;
    this.proveedor.nit = this.data.nit;

    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      'id' : new FormControl(this.proveedor.idProveedor),
      'nombre' : new FormControl(this.proveedor.nombre, Validators.required),
      'telefono' : new FormControl(this.proveedor.telefono, Validators.required),
      'direccion' : new FormControl(this.proveedor.direccionFiscal, Validators.required),
      'nit' : new FormControl(this.proveedor.nit)
    })
  }

  f() {
    return this.form.controls;
  }

  operar() {
    if(this.form.invalid) {return; }

    this.proveedor.nombre = this.form.value['nombre'].toUpperCase();
    this.proveedor.telefono = this.form.value['telefono'];
    this.proveedor.direccionFiscal = this.form.value['direccion'].toUpperCase();
    this.proveedor.nit = this.form.value['nit'].toUpperCase();

    if(this.proveedor.idProveedor > 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.EDITAR)) {
        this.proveedorService.updateMod(this.proveedor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.proveedorService.getAll();
        })).subscribe(data => {
          this.proveedorService.setObjetoCambio(data);
          this.proveedorService.setMensajeCambio('Proveedor actualizado');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.CREAR)) {
        this.proveedorService.createMod(this.proveedor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.proveedorService.getAll();
        })).subscribe(data => {
          this.proveedorService.setObjetoCambio(data);
          this.proveedorService.setMensajeCambio('Proveedor creado');
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
