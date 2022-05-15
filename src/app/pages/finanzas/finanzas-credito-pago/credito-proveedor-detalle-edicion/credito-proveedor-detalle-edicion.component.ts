import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreditoProveedorDetalle } from './../../../../_model/creditoProveedorDetalle';
import { CreditoProveedorDetalleService } from './../../../../_service/credito-proveedor-detalle.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-credito-proveedor-detalle-edicion',
  templateUrl: './credito-proveedor-detalle-edicion.component.html',
  styleUrls: ['./credito-proveedor-detalle-edicion.component.css']
})
export class CreditoProveedorDetalleEdicionComponent implements OnInit {

  form : FormGroup;

  constructor(
    private dialogRef : MatDialogRef<CreditoProveedorDetalleEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CreditoProveedorDetalle,
    private creditoProveedorDetalleService : CreditoProveedorDetalleService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      'facturaCodigo': new FormControl({value : this.data.facturaCompra.codigo, disabled : true}),
      'observaciones' : new FormControl(this.data.observaciones, Validators.required)
    });
  }

  editar() {
    this.data.observaciones = this.form.value['observaciones'].toUpperCase();
    this.creditoProveedorDetalleService.update(this.data).pipe(switchMap(() => {
      return this.creditoProveedorDetalleService.getAll();
    })).subscribe(data => {
      this.creditoProveedorDetalleService.setObjetoCambio(data);
      this.creditoProveedorDetalleService.setMensajeCambio('Detalle de credito actualizado');
      this.cerrar();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
