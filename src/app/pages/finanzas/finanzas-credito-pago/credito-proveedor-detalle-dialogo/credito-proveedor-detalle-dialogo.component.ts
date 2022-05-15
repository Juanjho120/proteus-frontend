import { switchMap } from 'rxjs/operators';
import { FacturaCompra } from './../../../../_model/facturaCompra';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreditoProveedorDetalleService } from './../../../../_service/credito-proveedor-detalle.service';
import { CreditoProveedorDetalle } from './../../../../_model/creditoProveedorDetalle';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-credito-proveedor-detalle-dialogo',
  templateUrl: './credito-proveedor-detalle-dialogo.component.html',
  styleUrls: ['./credito-proveedor-detalle-dialogo.component.css']
})
export class CreditoProveedorDetalleDialogoComponent implements OnInit {

  form : FormGroup;

  constructor(
    private dialogRef : MatDialogRef<CreditoProveedorDetalleDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : FacturaCompra,
    private creditoProveedorDetalleService : CreditoProveedorDetalleService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      'facturaCodigo': new FormControl({value : this.data.codigo, disabled : true}),
      'observaciones' : new FormControl('', Validators.required)
    });
  }

  f() {
    return this.form.controls;
  }

  asignar() {
    let creditoProveedorDetalle = new CreditoProveedorDetalle();
    creditoProveedorDetalle.facturaCompra = new FacturaCompra();
    creditoProveedorDetalle.facturaCompra.idFacturaCompra = this.data.idFacturaCompra;
    creditoProveedorDetalle.observaciones = this.form.value['observaciones'].toUpperCase();

    this.creditoProveedorDetalleService.create(creditoProveedorDetalle).pipe(switchMap(() => {
      return this.creditoProveedorDetalleService.getAll();
    })).subscribe(data => {
      this.creditoProveedorDetalleService.setObjetoCambio(data);
      this.creditoProveedorDetalleService.setMensajeCambio('Factura asignada a crédito');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
