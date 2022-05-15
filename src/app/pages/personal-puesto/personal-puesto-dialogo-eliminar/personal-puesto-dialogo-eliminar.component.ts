import { switchMap } from 'rxjs/operators';
import { PersonalPuestoService } from './../../../_service/personal-puesto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalPuesto } from './../../../_model/personalPuesto';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-personal-puesto-dialogo-eliminar',
  templateUrl: './personal-puesto-dialogo-eliminar.component.html',
  styleUrls: ['./personal-puesto-dialogo-eliminar.component.css']
})
export class PersonalPuestoDialogoEliminarComponent implements OnInit {

  personalPuesto : PersonalPuesto;

  constructor(
    private dialogRef : MatDialogRef<PersonalPuestoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : PersonalPuesto,
    private personalPuestoService : PersonalPuestoService
  ) { }

  ngOnInit(): void {
    this.personalPuesto = new PersonalPuesto();
    this.personalPuesto.idPersonalPuesto = this.data.idPersonalPuesto;
    this.personalPuesto.nombre = this.data.nombre;
  }

  eliminar() {
    this.personalPuestoService.deleteMod(this.personalPuesto.idPersonalPuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
      return this.personalPuestoService.getAll();
    })).subscribe(data => {
      this.personalPuestoService.setObjetoCambio(data);
      this.personalPuestoService.setMensajeCambio('Puesto de personal eliminado');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
