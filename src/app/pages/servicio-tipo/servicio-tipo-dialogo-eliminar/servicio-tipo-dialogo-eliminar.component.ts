import { switchMap } from 'rxjs/operators';
import { ServicioTipoService } from './../../../_service/servicio-tipo.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioTipo } from './../../../_model/servicioTipo';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicio-tipo-dialogo-eliminar',
  templateUrl: './servicio-tipo-dialogo-eliminar.component.html',
  styleUrls: ['./servicio-tipo-dialogo-eliminar.component.css']
})
export class ServicioTipoDialogoEliminarComponent implements OnInit {

  servicioTipo : ServicioTipo;

  constructor(
    private dialogRef : MatDialogRef<ServicioTipoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ServicioTipo,
    private servicioTipoService : ServicioTipoService
  ) { }

  ngOnInit(): void {
    this.servicioTipo = new ServicioTipo();
    this.servicioTipo.idServicioTipo = this.data.idServicioTipo;
    this.servicioTipo.nombre = this.data.nombre;
  }

  eliminar() {
    this.servicioTipoService.delete(this.servicioTipo.idServicioTipo).pipe(switchMap(() =>{
      return this.servicioTipoService.getAll();
    })).subscribe(data => {
      this.servicioTipoService.setObjetoCambio(data);
      this.servicioTipoService.setMensajeCambio('Tipo de servicio eliminado');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
  
}
