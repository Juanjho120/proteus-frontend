import { PermisoUtil } from './../../../../shared/permisoUtil';
import { TablaUtil } from './../../../../shared/tablaUtil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from './../../../../_service/login.service';
import { VentanaUtil } from './../../../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { SegmentoService } from './../../../../_service/segmento.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Segmento } from './../../../../_model/segmento';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-segmento-ingreso-busqueda-dialogo',
  templateUrl: './segmento-ingreso-busqueda-dialogo.component.html',
  styleUrls: ['./segmento-ingreso-busqueda-dialogo.component.css']
})
export class SegmentoIngresoBusquedaDialogoComponent implements OnInit {

  segmento : Segmento;
  form: FormGroup;

  idVentana : number = VentanaUtil.SEGMENTOS;

  constructor(
    private dialogRef : MatDialogRef<SegmentoIngresoBusquedaDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Segmento,
    private segmentoService : SegmentoService,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.segmento = new Segmento();
    this.segmento.idSegmento = this.data.idSegmento;
    this.segmento.nombre = this.data.nombre;
    this.segmento.nit = this.data.nit;
    this.segmento.direccionFiscal = this.data.direccionFiscal;
    this.segmento.codigo = this.data.codigo;

    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      'id' : new FormControl(this.segmento.idSegmento),
      'nombre' : new FormControl(this.segmento.nombre),
      'nit' : new FormControl(this.segmento.nit),
      'direccionFiscal' : new FormControl(this.segmento.direccionFiscal),
      'codigo' : new FormControl(this.segmento.codigo)
    })
  }

  f() {
    return this.form.controls;
  }

  operar() {
    if(this.form.invalid) {return; }

    this.segmento.idSegmento = this.form.value['id'];
    this.segmento.nombre = this.form.value['nombre'].toUpperCase();
    this.segmento.nit = this.form.value['nit'].toUpperCase();
    this.segmento.direccionFiscal = this.form.value['direccionFiscal'].toUpperCase();
    this.segmento.codigo = this.form.value['codigo'].toUpperCase();

    //ACTUALIZAR
    if(this.segmento != null && this.segmento.idSegmento > 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.EDITAR)) {
        this.segmentoService.updateMod(this.segmento, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.segmentoService.getAll();
        })).subscribe(data => {
          this.segmentoService.setObjetoCambio(data);
          this.segmentoService.setMensajeCambio('El segmento se ha actualizado');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CREAR)) {
        this.segmentoService.createMod(this.segmento, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.segmentoService.getAll();
        })).subscribe(data => {
          this.segmentoService.setObjetoCambio(data);
          this.segmentoService.setMensajeCambio('Segmento creado');
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
