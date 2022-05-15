import { NgxSpinnerService } from 'ngx-spinner';
import { TablaUtil } from './../../../shared/tablaUtil';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { LoginService } from './../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { RepuestoService } from './../../../_service/repuesto.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Repuesto } from './../../../_model/repuesto';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-cardex-dialogo-eliminar',
  templateUrl: './cardex-dialogo-eliminar.component.html',
  styleUrls: ['./cardex-dialogo-eliminar.component.css']
})
export class CardexDialogoEliminarComponent implements OnInit {

  repuesto : Repuesto;
  idVentana : number = VentanaUtil.CARDEX;

  constructor(
    private dialogRef : MatDialogRef<CardexDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Repuesto,
    private repuestoService : RepuestoService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.repuesto = new Repuesto();
    this.repuesto.idRepuesto = this.data.idRepuesto;
    this.repuesto.descripcion = this.data.descripcion;
    this.repuesto.codigo = this.data.codigo;
    this.repuesto.codigoBarra = this.data.codigoBarra;
    this.repuesto.existencia = this.data.existencia;
  }

  eliminar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.ELIMINAR)) {
      this.spinner.show()
      this.repuestoService.deleteMod(this.repuesto.idRepuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
        return this.repuestoService.getAll();
      })).subscribe(data => {
        this.repuestoService.setObjetoCambio(data);
        this.spinner.hide()
        this.repuestoService.setMensajeCambio('Repuesto eliminado');
      }, (error:any)=> this.spinner.hide());
      this.cerrar();
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  cerrar() {
    this.dialogRef.close();
  }

}
