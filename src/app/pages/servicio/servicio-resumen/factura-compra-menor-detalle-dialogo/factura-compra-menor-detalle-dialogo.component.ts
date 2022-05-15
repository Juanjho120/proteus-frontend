import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { FacturaCompraMenorDetalleService } from './../../../../_service/factura-compra-menor-detalle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacturaCompraMenorDetalle } from './../../../../_model/facturaCompraMenorDetalle';
import { Component, OnInit, Inject } from '@angular/core';
import { FacturaCompraMenor } from 'src/app/_model/facturaCompraMenor';

@Component({
  selector: 'app-factura-compra-menor-detalle-dialogo',
  templateUrl: './factura-compra-menor-detalle-dialogo.component.html',
  styleUrls: ['./factura-compra-menor-detalle-dialogo.component.css']
})
export class FacturaCompraMenorDetalleDialogoComponent implements OnInit {

  facturaCompraMenorDetalle : FacturaCompraMenorDetalle;

  constructor(
    private dialogRef : MatDialogRef<FacturaCompraMenorDetalle>,
    @Inject(MAT_DIALOG_DATA) private data : FacturaCompraMenorDetalle,
    private facturaCompraMenorDetalleService : FacturaCompraMenorDetalleService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    
    this.facturaCompraMenorDetalle = new FacturaCompraMenorDetalle();
    this.facturaCompraMenorDetalle.idFacturaCompraMenorDetalle = this.data.idFacturaCompraMenorDetalle;
    this.facturaCompraMenorDetalle.facturaCompraMenor = new FacturaCompraMenor();
    this.facturaCompraMenorDetalle.facturaCompraMenor.idFacturaCompraMenor = this.data.facturaCompraMenor.idFacturaCompraMenor;
    this.facturaCompraMenorDetalle.costoCompra = this.data.costoCompra;
    this.facturaCompraMenorDetalle.costoVenta = this.data.costoVenta;
    this.facturaCompraMenorDetalle.cantidad = this.data.cantidad;
    this.facturaCompraMenorDetalle.descripcion = this.data.descripcion;
  }

  editar() {
    if(this.facturaCompraMenorDetalle != null && this.facturaCompraMenorDetalle.idFacturaCompraMenorDetalle > 0) {
      this.spinner.show()
      this.facturaCompraMenorDetalleService.updateCostoVenta(this.facturaCompraMenorDetalle.idFacturaCompraMenorDetalle, this.facturaCompraMenorDetalle.costoVenta).pipe(switchMap(() => {
        return this.facturaCompraMenorDetalleService.getAll();
      })).subscribe(data => {
        this.facturaCompraMenorDetalleService.setObjetoCambio(data);
        this.spinner.hide()
        this.facturaCompraMenorDetalleService.setMensajeCambio('Costo de venta actualizado');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
