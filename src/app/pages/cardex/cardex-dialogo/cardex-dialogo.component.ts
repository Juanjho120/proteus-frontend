import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { RepuestoService } from './../../../_service/repuesto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Repuesto } from './../../../_model/repuesto';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cardex-dialogo',
  templateUrl: './cardex-dialogo.component.html',
  styleUrls: ['./cardex-dialogo.component.css']
})
export class CardexDialogoComponent implements OnInit {

  repuesto : Repuesto;
  form: FormGroup;

  idVentana : number = VentanaUtil.CARDEX;

  constructor(
    private dialogRef : MatDialogRef<CardexDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private repuestoService : RepuestoService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.repuesto = new Repuesto();
    this.repuesto.idRepuesto = this.data.repuesto.idRepuesto;
    this.repuesto.codigo = this.data.repuesto.codigo;
    this.repuesto.codigoBarra = this.data.repuesto.codigoBarra;
    this.repuesto.descripcion = this.data.repuesto.descripcion;
    this.repuesto.existencia = this.data.repuesto.existencia;
    this.repuesto.existenciaCcdd = this.data.repuesto.existenciaCcdd;
    this.repuesto.existenciaIidd = this.data.repuesto.existenciaIidd;
    this.repuesto.precio = this.data.repuesto.precio;

    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      'id': new FormControl(this.repuesto.idRepuesto),
      'codigo': new FormControl(this.repuesto.codigo, Validators.required),
      'codigoBarra' : new FormControl(this.repuesto.codigoBarra),
      'descripcion' : new FormControl(this.repuesto.descripcion, [Validators.required, Validators.minLength(3)]),
      'existencia' : new FormControl(this.data.idSucursal == 1 ? this.repuesto.existenciaCcdd 
          : this.data.idSucursal == 2 ? this.repuesto.existenciaIidd 
            : this.repuesto.existencia, Validators.required),
      'precio' : new FormControl(this.repuesto.precio, Validators.required)
    });

    this.form.get('existencia').disable();
    this.form.get('codigoBarra').disable();
    this.form.get('codigo').disable();
    this.form.get('precio').disable();
    if(sessionStorage.getItem('idUsuario')!=null && sessionStorage.getItem('idUsuario')=='5') {
      this.form.get('precio').enable();
      this.form.get('codigo').enable();
    }
  }

  f() {
    return this.form.controls;
  }
  
  operar() {
    if(this.form.invalid) {return; }

    this.repuesto.descripcion = this.form.value['descripcion'];
    this.repuesto.precio = this.form.value['precio'];

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.EDITAR)) {
      //ACTUALIZAR
    if(this.repuesto != null && this.repuesto.idRepuesto > 0) {
      this.spinner.show()
      this.repuestoService.updateMod(this.repuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
        return this.repuestoService.getAll();
      })).subscribe(data => {
        this.repuestoService.setObjetoCambio(data);
        this.spinner.hide()
        this.repuestoService.setMensajeCambio('El repuesto se ha actualizado');
      }, (error:any)=> this.spinner.hide());
    }
    this.cerrar();
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  cerrar() {
    this.dialogRef.close();
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

}
