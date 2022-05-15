import { ChecklistDetalle } from './../../../../_model/checklistDetalle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChecklistService } from './../../../../_service/checklist.service';
import { Checklist } from './../../../../_model/checklist';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-checklist-servicio-dialogo',
  templateUrl: './checklist-servicio-dialogo.component.html',
  styleUrls: ['./checklist-servicio-dialogo.component.css']
})
export class ChecklistServicioDialogoComponent implements OnInit {

  checklist : Checklist;

  checklistDetalleMecanico : ChecklistDetalle[] = [];
  checklistDetalleElectrico : ChecklistDetalle[] = [];

  constructor(
    private dialogRef : MatDialogRef<ChecklistServicioDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Checklist,
    private checklistService : ChecklistService
  ) { }

  ngOnInit(): void {
    this.checklist = this.data;
    for(let checklistDetalle of this.checklist.checklistDetalle) {
      if(checklistDetalle.electrico) {
        this.checklistDetalleElectrico.push(checklistDetalle);
      } else {
        this.checklistDetalleMecanico.push(checklistDetalle);
      }
    }
  }

}
