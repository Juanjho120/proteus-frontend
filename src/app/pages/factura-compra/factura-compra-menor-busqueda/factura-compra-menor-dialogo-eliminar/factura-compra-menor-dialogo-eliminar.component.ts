import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../../shared/permisoUtil';
import { TablaUtil } from './../../../../shared/tablaUtil';
import { LoginService } from './../../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { FacturaCompraMenorService } from './../../../../_service/factura-compra-menor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacturaCompraMenor } from './../../../../_model/facturaCompraMenor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-factura-compra-menor-dialogo-eliminar',
  templateUrl: './factura-compra-menor-dialogo-eliminar.component.html',
  styleUrls: ['./factura-compra-menor-dialogo-eliminar.component.css']
})
export class FacturaCompraMenorDialogoEliminarComponent implements OnInit {

  facturaCompraMenor : FacturaCompraMenor;

  idVentana : number = VentanaUtil.FACTURAS_DE_COMPRA;

  constructor(
    private dialogRef : MatDialogRef<FacturaCompraMenorDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : FacturaCompraMenor,
    private facturaCompraMenorService : FacturaCompraMenorService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.facturaCompraMenor = new FacturaCompraMenor();
    this.facturaCompraMenor.idFacturaCompraMenor = this.data.idFacturaCompraMenor;
    this.facturaCompraMenor.codigo = this.data.codigo;
    this.facturaCompraMenor.proveedorMenor = this.data.proveedorMenor;
  }

  eliminar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.ELIMINAR)) {
      this.spinner.show()
      this.facturaCompraMenorService.delete(this.facturaCompraMenor.idFacturaCompraMenor).pipe(switchMap(() =>{
        return this.facturaCompraMenorService.getAll();
      })).subscribe(data => {
        this.facturaCompraMenorService.setObjetoCambio(data);
        this.spinner.hide()
        this.facturaCompraMenorService.setMensajeCambio('Factura eliminada');
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
