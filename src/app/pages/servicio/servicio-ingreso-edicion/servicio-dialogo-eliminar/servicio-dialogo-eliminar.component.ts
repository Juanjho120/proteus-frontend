import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { ServicioService } from './../../../../_service/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Servicio } from './../../../../_model/servicio';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-servicio-dialogo-eliminar',
  templateUrl: './servicio-dialogo-eliminar.component.html',
  styleUrls: ['./servicio-dialogo-eliminar.component.css']
})
export class ServicioDialogoEliminarComponent implements OnInit {

  servicio : Servicio;

  constructor(
    private dialogRef : MatDialogRef<ServicioDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Servicio,
    private servicioService : ServicioService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.servicio = new Servicio();
    this.servicio.idServicio = this.data.idServicio;
    this.servicio.placa = this.data.placa;
    this.servicio.segmento = this.data.segmento;
    this.servicio.servicioTipo = this.data.servicioTipo;
  }

  eliminar() {
    this.spinner.show()
    this.servicioService.delete(this.servicio.idServicio).pipe(switchMap(() =>{
      return this.servicioService.getAll();
    })).subscribe(data => {
      this.servicioService.setObjetoCambio(data);
      this.spinner.hide()
      this.servicioService.setMensajeCambio('Servicio eliminado');
    }, (error:any) => this.spinner.hide());
    this.cerrar(true);
  }

  cerrar(opcion : boolean) {
    this.dialogRef.close(opcion);
  }

}
