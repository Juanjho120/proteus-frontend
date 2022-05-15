import { switchMap } from 'rxjs/operators';
import { ServicioTipoService } from './../../../_service/servicio-tipo.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioTipo } from './../../../_model/servicioTipo';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-servicio-tipo-dialogo',
  templateUrl: './servicio-tipo-dialogo.component.html',
  styleUrls: ['./servicio-tipo-dialogo.component.css']
})
export class ServicioTipoDialogoComponent implements OnInit {

  servicioTipo : ServicioTipo;

  constructor(
    private dialogRef : MatDialogRef<ServicioTipoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ServicioTipo,
    private servicioTipoService : ServicioTipoService
  ) { }

  ngOnInit(): void {
    this.servicioTipo = new ServicioTipo();
    this.servicioTipo.idServicioTipo = this.data.idServicioTipo;
    this.servicioTipo.nombre = this.data.nombre;
  }

  editar() {
    if(this.servicioTipo != null && this.servicioTipo.idServicioTipo > 0) {
      this.servicioTipoService.update(this.servicioTipo).pipe(switchMap(() => {
        return this.servicioTipoService.getAll();
      })).subscribe(data => {
        this.servicioTipoService.setObjetoCambio(data);
        this.servicioTipoService.setMensajeCambio('Tipo de servicio actualizado');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
  
}
