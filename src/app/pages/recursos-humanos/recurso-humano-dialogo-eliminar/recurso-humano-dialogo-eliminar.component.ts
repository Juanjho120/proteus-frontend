import { switchMap } from 'rxjs/operators';
import { PersonalService } from './../../../_service/personal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Personal } from './../../../_model/personal';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-recurso-humano-dialogo-eliminar',
  templateUrl: './recurso-humano-dialogo-eliminar.component.html',
  styleUrls: ['./recurso-humano-dialogo-eliminar.component.css']
})
export class RecursoHumanoDialogoEliminarComponent implements OnInit {

  personal : Personal;

  constructor(
    private dialogRef : MatDialogRef<RecursoHumanoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Personal,
    private personalService : PersonalService
  ) { }

  ngOnInit(): void {
    this.personal = new Personal();
    this.personal.idPersonal = this.data.idPersonal;
    this.personal.nombre = this.data.nombre;
  }

  eliminar() {
    this.personalService.deleteMod(this.personal.idPersonal, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
      return this.personalService.getAll();
    })).subscribe(data => {
      this.personalService.setObjetoCambio(data);
      this.personalService.setMensajeCambio('Personal eliminado');
    });
    this.cerrar();
  }
  
  cerrar() {
    this.dialogRef.close();
  }
}
