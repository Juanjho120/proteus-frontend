import { SegmentoPago } from './../../../../_model/segmentoPago';
import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentoPagoService } from './../../../../_service/segmento-pago.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-segmento-pago-dialogo-eliminar',
  templateUrl: './segmento-pago-dialogo-eliminar.component.html',
  styleUrls: ['./segmento-pago-dialogo-eliminar.component.css']
})
export class SegmentoPagoDialogoEliminarComponent implements OnInit {

  segmentoPago : SegmentoPago;

  constructor(
    private dialogRef : MatDialogRef<SegmentoPagoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : SegmentoPago,
    private segmentoPagoService : SegmentoPagoService
  ) { }

  ngOnInit(): void {
    this.segmentoPago = new SegmentoPago();
    this.segmentoPago.idSegmentoPago = this.data.idSegmentoPago;
    this.segmentoPago.pagoTipo = this.data.pagoTipo;
    this.segmentoPago.monto = this.data.monto;
    this.segmentoPago.facturas = this.data.facturas;
    this.segmentoPago.fechaHoraPago = this.data.fechaHoraPago;
  }

  eliminar() {
    this.segmentoPagoService.delete(this.segmentoPago.idSegmentoPago).pipe(switchMap(() => {
      return this.segmentoPagoService.getAll();
    })).subscribe(data => {
      this.segmentoPagoService.setObjetoCambio(data);
      this.segmentoPagoService.setMensajeCambio('El pago del segmento se ha eliminado');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
