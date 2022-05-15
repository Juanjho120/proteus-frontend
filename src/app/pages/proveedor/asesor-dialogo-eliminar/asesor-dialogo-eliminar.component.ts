import { switchMap } from 'rxjs/operators';
import { ProveedorAsesorService } from './../../../_service/proveedor-asesor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorAsesor } from './../../../_model/proveedorAsesor';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-asesor-dialogo-eliminar',
  templateUrl: './asesor-dialogo-eliminar.component.html',
  styleUrls: ['./asesor-dialogo-eliminar.component.css']
})
export class AsesorDialogoEliminarComponent implements OnInit {

  proveedorAsesor : ProveedorAsesor;

  constructor(
    private dialogRef : MatDialogRef<AsesorDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ProveedorAsesor,
    private proveedorAsesorService : ProveedorAsesorService
  ) { }

  ngOnInit(): void {
    this.proveedorAsesor = new ProveedorAsesor();
    this.proveedorAsesor.idProveedorAsesor = this.data.idProveedorAsesor;
    this.proveedorAsesor.nombre = this.data.nombre;
  }

  eliminar() {
    this.proveedorAsesorService.deleteMod(this.proveedorAsesor.idProveedorAsesor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
      return this.proveedorAsesorService.getAll();
    })).subscribe(data => {
      this.proveedorAsesorService.setObjetoCambio(data);
      this.proveedorAsesorService.setMensajeCambio('Asesor eliminado');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
