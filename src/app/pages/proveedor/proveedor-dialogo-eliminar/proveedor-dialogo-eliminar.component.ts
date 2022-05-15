import { switchMap } from 'rxjs/operators';
import { ProveedorService } from './../../../_service/proveedor.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Proveedor } from './../../../_model/proveedor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-proveedor-dialogo-eliminar',
  templateUrl: './proveedor-dialogo-eliminar.component.html',
  styleUrls: ['./proveedor-dialogo-eliminar.component.css']
})
export class ProveedorDialogoEliminarComponent implements OnInit {

  proveedor : Proveedor;

  constructor(
    private dialogRef : MatDialogRef<ProveedorDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Proveedor,
    private proveedorService : ProveedorService
  ) { }

  ngOnInit(): void {
    this.proveedor = new Proveedor();
    this.proveedor.idProveedor = this.data.idProveedor;
    this.proveedor.nombre = this.data.nombre;
  }

  eliminar() {
    this.proveedorService.deleteMod(this.proveedor.idProveedor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
      return this.proveedorService.getAll();
    })).subscribe(data => {
      this.proveedorService.setObjetoCambio(data);
      this.proveedorService.setMensajeCambio('Proveedor eliminado');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
