import { CuentaBancaria } from './../../../../_model/cuentaBancaria';
import { BoletaService } from './../../../../_service/boleta.service';
import { TransaccionService } from './../../../../_service/transaccion.service';
import { ChequeService } from './../../../../_service/cheque.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentoPagoService } from './../../../../_service/segmento-pago.service';
import { SegmentoPago } from './../../../../_model/segmentoPago';
import { Boleta } from './../../../../_model/boleta';
import { Transaccion } from './../../../../_model/transaccion';
import { Cheque } from './../../../../_model/cheque';
import { Component, OnInit, Inject } from '@angular/core';
import { Banco } from 'src/app/_model/banco';
import { TransaccionEstado } from 'src/app/_model/transaccionEstado';

@Component({
  selector: 'app-segmento-pago-detalle-dialogo',
  templateUrl: './segmento-pago-detalle-dialogo.component.html',
  styleUrls: ['./segmento-pago-detalle-dialogo.component.css']
})
export class SegmentoPagoDetalleDialogoComponent implements OnInit {

  segmentoPago : SegmentoPago;
  cheque : Cheque;
  transaccion : Transaccion;
  boleta : Boleta;

  totalTrabajos : number[] = [];
  totalRepuestos : number[] = [];

  constructor(
    private dialogRef : MatDialogRef<SegmentoPagoDetalleDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : number,
    private segmentoPagoService : SegmentoPagoService,
    private chequeService : ChequeService,
    private transaccionService : TransaccionService,
    private boletaService : BoletaService,
  ) { }

  ngOnInit(): void {
    let cuentaBancaria = new CuentaBancaria();
    cuentaBancaria.banco = new Banco();
    this.cheque = new Cheque();
    this.cheque.cuentaBancaria = cuentaBancaria;
    this.cheque.monto = 0;
    this.transaccion = new Transaccion();
    this.transaccion.cuentaBancariaDestino = cuentaBancaria;
    this.transaccion.monto = 0;
    this.transaccion.transaccionEstado = new TransaccionEstado();
    this.boleta = new Boleta();
    this.boleta.numero = "----------";

    this.segmentoPago = new SegmentoPago();
    this.segmentoPago.monto = 0;
    
    this.segmentoPagoService.getById(this.data).subscribe(result => {
      this.segmentoPago = result;

      for(let segmentoPagoDetalle of this.segmentoPago.segmentoPagoDetalle) {
        let totalTrabajo = 0;
        let totalRepuesto = 0;

        for(let servicioTrabajo of segmentoPagoDetalle.segmentoCreditoDetalle.servicio.servicioTrabajo) {
          totalTrabajo += servicioTrabajo.costo;
        };
  
        for(let servicioRepuesto of segmentoPagoDetalle.segmentoCreditoDetalle.servicio.servicioRepuesto) {
          totalRepuesto += servicioRepuesto.costoTotal;
        };

        this.totalTrabajos.push(totalTrabajo);
        this.totalRepuestos.push(totalRepuesto);
      }

      if(this.segmentoPago.pagoTipo.nombre === "CHEQUE") {
        this.chequeService.getById(this.segmentoPago.idItem).subscribe(dataCheque => {
          this.cheque = dataCheque;
          document.getElementById("div-cheque-container").style.display = "block";

          this.boletaService.getByCheque(this.cheque.idCheque).subscribe(dataBoleta => {
            if(dataBoleta.length > 0) {
              this.boleta = dataBoleta[0];
            }
          });
        });
      } else if(this.segmentoPago.pagoTipo.nombre === "TRANSACCION") {
        this.transaccionService.getById(this.segmentoPago.idItem).subscribe(dataTransaccion => {
          this.transaccion = dataTransaccion;
          document.getElementById("div-transaccion-container").style.display = "block";
        });
      } else if(this.segmentoPago.pagoTipo.nombre === "EFECTIVO") {
        document.getElementById("div-efectivo-container").style.display = "block";
      }
    });
  }

}
