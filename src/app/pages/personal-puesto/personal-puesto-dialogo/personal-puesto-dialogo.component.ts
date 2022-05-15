import { switchMap } from 'rxjs/operators';
import { PersonalPuestoService } from './../../../_service/personal-puesto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalPuesto } from './../../../_model/personalPuesto';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-personal-puesto-dialogo',
  templateUrl: './personal-puesto-dialogo.component.html',
  styleUrls: ['./personal-puesto-dialogo.component.css']
})
export class PersonalPuestoDialogoComponent implements OnInit {

  personalPuesto : PersonalPuesto;

  constructor(
    private dialogRef : MatDialogRef<PersonalPuestoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : PersonalPuesto,
    private personalPuestoService : PersonalPuestoService
  ) { }

  ngOnInit(): void {
    this.personalPuesto = new PersonalPuesto();
    this.personalPuesto.idPersonalPuesto = this.data.idPersonalPuesto;
    this.personalPuesto.nombre = this.data.nombre;
  }

  editar() {
    this.personalPuesto.nombre = this.personalPuesto.nombre.toUpperCase();
    if(this.personalPuesto != null && this.personalPuesto.idPersonalPuesto > 0) {
      this.personalPuestoService.updateMod(this.personalPuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
        return this.personalPuestoService.getAll();
      })).subscribe(data => {
        this.personalPuestoService.setObjetoCambio(data);
        this.personalPuestoService.setMensajeCambio('Puesto de personal actualizado');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
