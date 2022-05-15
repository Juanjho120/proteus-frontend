import { BoletaService } from './../../../../_service/boleta.service';
import { Boleta } from './../../../../_model/boleta';
import { TransaccionService } from './../../../../_service/transaccion.service';
import { ChequeService } from './../../../../_service/cheque.service';
import { Transaccion } from './../../../../_model/transaccion';
import { Cheque } from './../../../../_model/cheque';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PagoProveedorService } from './../../../../_service/pago-proveedor.service';
import { PagoProveedor } from './../../../../_model/pagoProveedor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-pago-proveedor-detalle-dialogo',
  templateUrl: './pago-proveedor-detalle-dialogo.component.html',
  styleUrls: ['./pago-proveedor-detalle-dialogo.component.css']
})
export class PagoProveedorDetalleDialogoComponent implements OnInit {

  pagoProveedor : PagoProveedor;
  cheque : Cheque;
  transaccion : Transaccion;
  boleta : Boleta;

  constructor(
    private dialogRef : MatDialogRef<PagoProveedorDetalleDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : number,
    private pagoProveedorService : PagoProveedorService,
    private chequeService : ChequeService,
    private transaccionService : TransaccionService,
    private boletaService : BoletaService
  ) { }

  ngOnInit(): void {
    this.boleta = new Boleta();
    this.boleta.numero = "----------";

    this.pagoProveedorService.getById(this.data).subscribe(result => {
      this.pagoProveedor = result;

      if(this.pagoProveedor.pagoTipo.nombre === "CHEQUE") {
        this.chequeService.getById(this.pagoProveedor.idItem).subscribe(dataCheque => {
          this.cheque = dataCheque;
          document.getElementById("div-cheque-container").style.display = "block";

          this.boletaService.getByCheque(this.cheque.idCheque).subscribe(dataBoleta => {
            if(dataBoleta.length > 0) {
              this.boleta = dataBoleta[0];
            }
          });
        });
      } else if(this.pagoProveedor.pagoTipo.nombre === "TRANSACCION") {
        this.transaccionService.getById(this.pagoProveedor.idItem).subscribe(dataTransaccion => {
          this.transaccion = dataTransaccion;
          document.getElementById("div-transaccion-container").style.display = "block";
        });
      }
    });
  }

}
