import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../../shared/permisoUtil';
import { TablaUtil } from './../../../../shared/tablaUtil';
import { LoginService } from './../../../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentanaUtil } from './../../../../shared/ventanaUtil';
import { MatDialogRef } from '@angular/material/dialog';
import { Checklist } from './../../../../_model/checklist';
import { MatTableDataSource } from '@angular/material/table';
import { PlacaService } from './../../../../_service/placa.service';
import { ServicioService } from './../../../../_service/servicio.service';
import { ChecklistService } from './../../../../_service/checklist.service';
import { Servicio } from './../../../../_model/servicio';
import { Placa } from './../../../../_model/placa';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-checklist-dialogo-buscar',
  templateUrl: './checklist-dialogo-buscar.component.html',
  styleUrls: ['./checklist-dialogo-buscar.component.css']
})
export class ChecklistDialogoBuscarComponent implements OnInit {

  formBusqueda : FormGroup;
  idBusqueda : number = 0;

  //idServicio : number = 0;
  idPlaca : number = 0;

  //servicios$ : Observable<Servicio[]>;
  placas$ : Observable<Placa[]>;

  dataSource : MatTableDataSource<Checklist>;
  checklists : Checklist[] = [];
  displayedColumns = ['noChecklist', 'checklistServicioTipo', 'noServicio', 'servicioTipo', 'placa', 'fechaIngreso', 'fechaRevision'];

  myControlServicio : FormControl = new FormControl('', Validators.required);
  myControlPlaca : FormControl = new FormControl('', Validators.required);

  formatoFecha : string = 'YYYY-MM-DD';

  idVentana : number = VentanaUtil.CHECKLISTS;

  constructor(
    private checklistService : ChecklistService,
    private servicioService : ServicioService,
    private placaService : PlacaService,
    private dialogRef : MatDialogRef<ChecklistDialogoBuscarComponent>,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    /*if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.servicios$ = this.servicioService.getByFinalizado(false);
    }*/

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CONSULTAR)) {
      this.placas$ = this.placaService.getInService();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHECKLISTS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      this.checklistService.getAllNotFinalizado().subscribe(data => {
        this.checklists = [];
        for(let checklist of data) {
          checklist.fechaHoraIngreso = moment(checklist.fechaHoraIngreso).format(this.formatoFecha);
          checklist.fechaRevision = moment(checklist.fechaRevision).format(this.formatoFecha);
          this.checklists.push(checklist);
        }
        this.dataSource = new MatTableDataSource(this.checklists);
        this.spinner.hide()
      });
    }

    this.initForm(); 
  }

  initForm() {
    this.formBusqueda = new FormGroup({
      'servicio' : this.myControlServicio,
      'placa' : this.myControlPlaca
    });

    this.formBusqueda.get('servicio').disable();
    this.formBusqueda.get('placa').disable();
  }

  setInputs() {
    if(this.idBusqueda == 1) {
      this.setServicioInput(true);
      this.setPlacaInput(false);
    } else if(this.idBusqueda == 2) {
      this.setServicioInput(false);
      this.setPlacaInput(true);
    }
  }

  setServicioInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.checklists = [];
    this.myControlServicio.reset();
    if(e) {
      this.formBusqueda.get('servicio').enable();
    } else {
      this.formBusqueda.get('servicio').disable();
    }
  }

  setPlacaInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.checklists = [];
    this.myControlPlaca.reset();
    if(e) {
      this.formBusqueda.get('placa').enable();
    } else {
      this.formBusqueda.get('placa').disable();
    }
  }

  buscar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHECKLISTS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      if(this.idBusqueda == 1) {
        this.checklistService.getByServicioCorrelativoFinalizado(this.formBusqueda.value['servicio']).subscribe(data => {
          this.checklists = [];
          data.fechaHoraIngreso = moment(data.fechaHoraIngreso).format(this.formatoFecha);
          data.fechaRevision = moment(data.fechaRevision).format(this.formatoFecha);
          this.checklists.push(data);
          this.dataSource = new MatTableDataSource(this.checklists);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 2) {
        this.checklistService.getByPlacaAndServicioFinalizado(this.idPlaca, false).subscribe(data => {
          this.checklists = [];
          for(let checklist of data) {
            checklist.fechaHoraIngreso = moment(checklist.fechaHoraIngreso).format(this.formatoFecha);
            checklist.fechaRevision = moment(checklist.fechaRevision).format(this.formatoFecha);
            this.checklists.push(checklist);
          }
          this.dataSource = new MatTableDataSource(this.checklists);
          this.spinner.hide()
        });
      } else {
        this.spinner.hide()
        return;
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  evaluarBotonBuscar() {
    if(this.formBusqueda.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

  cerrar(checked : boolean, checklist : Checklist) {
    if(checked) {
      this.dialogRef.close(checklist);
    }
  }
}
