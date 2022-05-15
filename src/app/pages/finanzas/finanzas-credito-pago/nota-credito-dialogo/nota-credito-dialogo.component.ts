import { switchMap } from 'rxjs/operators';
import { NotaCredito } from './../../../../_model/notaCredito';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotaCreditoService } from './../../../../_service/nota-credito.service';
import { CreditoProveedorDetalle } from './../../../../_model/creditoProveedorDetalle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-nota-credito-dialogo',
  templateUrl: './nota-credito-dialogo.component.html',
  styleUrls: ['./nota-credito-dialogo.component.css']
})
export class NotaCreditoDialogoComponent implements OnInit {

  formNotaCredito : FormGroup;

  maxFecha : Date = new Date();
  fechaAplicacionSeleccionada : Date = new Date();
  fechaAplicacionFormato : string;
  formatoFecha : string = 'YYYY-MM-DD';

  constructor(
    private dialogRef : MatDialogRef<NotaCreditoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CreditoProveedorDetalle,
    private notaCreditoService : NotaCreditoService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formNotaCredito = new FormGroup({
      'facturaCodigo': new FormControl({value : this.data.facturaCompra.codigo, disabled : true}),
      'codigo' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required),
      'descripcion' : new FormControl('', Validators.required),
      'fechaAplicacion' : new FormControl('', Validators.required)
    });
  }

  cambiarFechaAplicacion(e : any) {
    this.fechaAplicacionSeleccionada = e.value;
    this.fechaAplicacionFormato = moment(this.fechaAplicacionSeleccionada).format(this.formatoFecha);
  }

  crearNotaCredito() {
    let notaCredito = new NotaCredito();
    notaCredito.facturaCompra = this.data.facturaCompra;
    notaCredito.codigo = this.formNotaCredito.value['codigo'].toUpperCase();
    notaCredito.monto = this.formNotaCredito.value['monto'];
    notaCredito.descripcion = this.formNotaCredito.value['descripcion'].toUpperCase();
    notaCredito.fechaAplicacion = this.fechaAplicacionFormato;

    this.notaCreditoService.create(notaCredito).pipe(switchMap(() => {
      return this.notaCreditoService.getAll();
    })).subscribe(data => {
      this.notaCreditoService.setObjetoCambio(data);
      this.notaCreditoService.setMensajeCambio('Nota de crédito creada');
      this.cerrar();
    })
  }

  cerrar() {
    this.dialogRef.close();
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }
  
}
