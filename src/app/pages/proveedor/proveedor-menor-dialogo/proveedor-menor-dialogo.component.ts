import { switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProveedorMenorService } from './../../../_service/proveedor-menor.service';
import { ProveedorMenor } from './../../../_model/proveedorMenor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-proveedor-menor-dialogo',
  templateUrl: './proveedor-menor-dialogo.component.html',
  styleUrls: ['./proveedor-menor-dialogo.component.css']
})
export class ProveedorMenorDialogoComponent implements OnInit {

  proveedorMenor : ProveedorMenor;

  constructor(
    private dialogRef : MatDialogRef<ProveedorMenorDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ProveedorMenor,
    private proveedorMenorService : ProveedorMenorService
  ) { }

  ngOnInit(): void {
    this.proveedorMenor = new ProveedorMenor();
    this.proveedorMenor.idProveedorMenor = this.data.idProveedorMenor;
    this.proveedorMenor.nombre = this.data.nombre;
  }

  editar() {
    if(this.proveedorMenor!=null && this.proveedorMenor.idProveedorMenor>0) {
      this.proveedorMenor.nombre = this.proveedorMenor.nombre.toUpperCase();
      this.proveedorMenorService.updateMod(this.proveedorMenor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
        return this.proveedorMenorService.getAll();
      })).subscribe(data => {
        this.proveedorMenorService.setObjetoCambio(data);
        this.proveedorMenorService.setMensajeCambio('Proveedor menor actualizado');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
