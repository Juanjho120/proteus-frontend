import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../../shared/permisoUtil';
import { TablaUtil } from './../../../../shared/tablaUtil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from './../../../../_service/login.service';
import { VentanaUtil } from './../../../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacturaCompraService } from './../../../../_service/factura-compra.service';
import { FacturaCompra } from './../../../../_model/facturaCompra';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-factura-compra-dialogo-eliminar',
  templateUrl: './factura-compra-dialogo-eliminar.component.html',
  styleUrls: ['./factura-compra-dialogo-eliminar.component.css']
})
export class FacturaCompraDialogoEliminarComponent implements OnInit {

  facturaCompra : FacturaCompra;

  idVentana : number = VentanaUtil.FACTURAS_DE_COMPRA;

  constructor(
    private dialogRef : MatDialogRef<FacturaCompraDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : FacturaCompra,
    private facturaCompraService : FacturaCompraService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.facturaCompra = new FacturaCompra();
    this.facturaCompra.idFacturaCompra = this.data.idFacturaCompra;
    this.facturaCompra.codigo = this.data.codigo;
    this.facturaCompra.proveedor = this.data.proveedor;
  }

  eliminar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS, PermisoUtil.ELIMINAR)) {
      this.spinner.show()
      this.facturaCompraService.delete(this.facturaCompra.idFacturaCompra).pipe(switchMap(() =>{
        return this.facturaCompraService.getAll();
      })).subscribe(data => {
        this.facturaCompraService.setObjetoCambio(data);
        this.spinner.hide()
        this.facturaCompraService.setMensajeCambio('Factura eliminada');
      });
      this.cerrar();
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
