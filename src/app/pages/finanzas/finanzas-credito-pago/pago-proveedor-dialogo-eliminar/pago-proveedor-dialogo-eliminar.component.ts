import { PagoProveedorDTO } from './../../../../_model/dto/pagoProveedorDTO';
import { switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PagoProveedorService } from './../../../../_service/pago-proveedor.service';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-pago-proveedor-dialogo-eliminar',
  templateUrl: './pago-proveedor-dialogo-eliminar.component.html',
  styleUrls: ['./pago-proveedor-dialogo-eliminar.component.css']
})
export class PagoProveedorDialogoEliminarComponent implements OnInit {

  pagoProveedor : PagoProveedorDTO;
  formatoFecha : string = 'YYYY-MM-DD';

  constructor(
    private dialogRef : MatDialogRef<PagoProveedorDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : PagoProveedorDTO,
    private pagoProveedorService : PagoProveedorService
  ) { }

  ngOnInit(): void {
    this.pagoProveedor = new PagoProveedorDTO();
    this.pagoProveedor.idPagoProveedor = this.data.idPagoProveedor;
    this.pagoProveedor.fechaPago = moment(this.data.fechaPago).format(this.formatoFecha);
    this.pagoProveedor.monto = this.data.monto;
  }

  eliminar() {
    this.pagoProveedorService.delete(this.pagoProveedor.idPagoProveedor).pipe(switchMap(() => {
      return this.pagoProveedorService.getAll();
    })).subscribe(data => {
      this.pagoProveedorService.setObjetoCambio(data);
      this.pagoProveedorService.setMensajeCambio('Pago eliminado');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
