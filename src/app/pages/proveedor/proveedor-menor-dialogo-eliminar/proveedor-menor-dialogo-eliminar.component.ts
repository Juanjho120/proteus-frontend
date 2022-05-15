import { switchMap } from 'rxjs/operators';
import { ProveedorMenorService } from './../../../_service/proveedor-menor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorMenor } from './../../../_model/proveedorMenor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-proveedor-menor-dialogo-eliminar',
  templateUrl: './proveedor-menor-dialogo-eliminar.component.html',
  styleUrls: ['./proveedor-menor-dialogo-eliminar.component.css']
})
export class ProveedorMenorDialogoEliminarComponent implements OnInit {

  proveedorMenor : ProveedorMenor;

  constructor(
    private dialogRef : MatDialogRef<ProveedorMenorDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ProveedorMenor,
    private proveedorMenorService : ProveedorMenorService
  ) { }

  ngOnInit(): void {
    this.proveedorMenor = new ProveedorMenor();
    this.proveedorMenor.idProveedorMenor = this.data.idProveedorMenor;
    this.proveedorMenor.nombre = this.data.nombre;
  }

  eliminar() {
    this.proveedorMenorService.deleteMod(this.proveedorMenor.idProveedorMenor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
      return this.proveedorMenorService.getAll();
    })).subscribe(data => {
      this.proveedorMenorService.setObjetoCambio(data);
      this.proveedorMenorService.setMensajeCambio('Proveedor menor eliminado');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
