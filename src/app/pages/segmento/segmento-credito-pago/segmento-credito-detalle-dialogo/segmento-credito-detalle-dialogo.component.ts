import { SegmentoCreditoDetalle } from 'src/app/_model/segmentoCreditoDetalle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentoCreditoDetalleService } from './../../../../_service/segmento-credito-detalle.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Servicio } from 'src/app/_model/servicio';

@Component({
  selector: 'app-segmento-credito-detalle-dialogo',
  templateUrl: './segmento-credito-detalle-dialogo.component.html',
  styleUrls: ['./segmento-credito-detalle-dialogo.component.css']
})
export class SegmentoCreditoDetalleDialogoComponent implements OnInit {

  formSegmentoCreditoDetalle : FormGroup;

  constructor(
    private dialogRef : MatDialogRef<SegmentoCreditoDetalleDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : number,
    private segmentoCreditoDetalleService : SegmentoCreditoDetalleService
  ) { }

  ngOnInit(): void {
    this.formSegmentoCreditoDetalle = new FormGroup({
      'numeroFactura' : new FormControl('', Validators.required)
    });
  }

  crearSegmentoCreditoDetalle() {
    let segmentoCreditoDetalle = new SegmentoCreditoDetalle();
    segmentoCreditoDetalle.servicio = new Servicio();
    segmentoCreditoDetalle.servicio.idServicio = this.data;
    segmentoCreditoDetalle.facturaNumero = this.formSegmentoCreditoDetalle.value['numeroFactura'];
    segmentoCreditoDetalle.facturaSerie = '';
    this.segmentoCreditoDetalleService.create(segmentoCreditoDetalle).subscribe(() => {
      this.segmentoCreditoDetalleService.setMensajeCambio('Servicio facturado');
      this.cerrar();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
