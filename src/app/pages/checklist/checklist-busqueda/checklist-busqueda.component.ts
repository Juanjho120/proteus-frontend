import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { ReporteService } from './../../../_service/reporte.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChecklistServicioTipoService } from './../../../_service/checklist-servicio-tipo.service';
import { ChecklistService } from './../../../_service/checklist.service';
import { PersonalService } from './../../../_service/personal.service';
import { PlacaService } from './../../../_service/placa.service';
import { ChecklistServicioTipo } from './../../../_model/checklistServicioTipo';
import { Checklist } from './../../../_model/checklist';
import { Personal } from './../../../_model/personal';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Placa } from 'src/app/_model/placa';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-checklist-busqueda',
  templateUrl: './checklist-busqueda.component.html',
  styleUrls: ['./checklist-busqueda.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ChecklistBusquedaComponent implements OnInit {

  idBusqueda : number = 0;
  idPlaca : number = 0;
  idMecanico : number = 0;
  idSupervisor : number = 0;
  idChecklistServicioTipo : number = 0;

  placas$ : Observable<Placa[]>;
  mecanicos$ : Observable<Personal[]>;
  supervisores$ : Observable<Personal[]>;
  checklistServicioTipos$ : Observable<ChecklistServicioTipo[]>;

  formatoFecha : string = 'YYYY-MM-DD';
  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  formBusqueda : FormGroup;
  myControlPlaca : FormControl = new FormControl('', Validators.required);
  myControlChecklistServicioTipo : FormControl = new FormControl('', Validators.required);
  myControlMecanico : FormControl = new FormControl('', Validators.required);
  myControlSupervisor : FormControl = new FormControl('', Validators.required);
  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);

  checklists : Checklist[] = [];
  dataSource : MatTableDataSource<Checklist>;
  displayedColumns = ['noChecklist', 'checklistServicioTipo', 'noServicio', 'servicioTipo', 'placa', 'fechaIngreso', 'fechaRevision', 'mecanico', 'supervisor', 'imprimir'];
  expandedElement : any;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  idVentana : number = VentanaUtil.CHECKLISTS;

  constructor(
    private placaService : PlacaService,
    private personalService : PersonalService,
    private checklistService : ChecklistService,
    private checklistServicioTipoService : ChecklistServicioTipoService,
    private reporteService : ReporteService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CONSULTAR)) {
      this.placas$ = this.placaService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL, PermisoUtil.CONSULTAR)) {
      this.mecanicos$ = this.personalService.getByPersonalPuesto(1);
      this.supervisores$ = this.personalService.getByPersonalPuesto(2);
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHECKLIST_SERVICIO_TIPOS, PermisoUtil.CONSULTAR)) {
      this.checklistServicioTipos$ = this.checklistServicioTipoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHECKLISTS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      this.checklistService.getByFechaIngreso(moment(this.maxFecha).format(this.formatoFechaHora), 
          moment(this.maxFecha).format(this.formatoFechaHora)).subscribe(data => {
      this.procesarData(data);
      this.spinner.hide()
    });
    }

    this.checklistService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.initForm();
  }

  initForm() {
    this.formBusqueda = new FormGroup({
      'placa' : this.myControlPlaca,
      'mecanico' : this.myControlMecanico,
      'supervisor' : this.myControlSupervisor,
      'checklistServicioTipo' : this.myControlChecklistServicioTipo,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin,
    });

    this.formBusqueda.get('placa').disable();
    this.formBusqueda.get('mecanico').disable();
    this.formBusqueda.get('supervisor').disable();
    this.formBusqueda.get('checklistServicioTipo').disable();
    this.formBusqueda.get('fechaInicio').disable();
    this.formBusqueda.get('fechaFin').disable();
    
  }

  cambiarFechaInicio(e : any) {
    this.fechaInicioSeleccionada = e.value;
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFechaHora);
  }

  cambiarFechaFin(e : any) {
    this.fechaFinSeleccionada = e.value;
    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFechaHora);
  }

  setInputs() {
    if(this.idBusqueda == 1) {
      this.setPlacaInput(true);
      this.setMecanicoInput(false);
      this.setSupervisorInput(false);
      this.setChecklistServicioTipoInput(false);
      this.setFechaInput(false);
    } else if(this.idBusqueda == 2) {
      this.setPlacaInput(false);
      this.setMecanicoInput(false);
      this.setSupervisorInput(false);
      this.setChecklistServicioTipoInput(true);
      this.setFechaInput(false);
    } else if(this.idBusqueda == 3) {
      this.setPlacaInput(false);
      this.setMecanicoInput(true);
      this.setSupervisorInput(false);
      this.setChecklistServicioTipoInput(false);
      this.setFechaInput(false);
    } else if(this.idBusqueda == 4) {
      this.setPlacaInput(false);
      this.setMecanicoInput(false);
      this.setSupervisorInput(true);
      this.setChecklistServicioTipoInput(false);
      this.setFechaInput(false);
    } else if(this.idBusqueda == 5 || this.idBusqueda == 6) {
      this.setPlacaInput(false);
      this.setMecanicoInput(false);
      this.setSupervisorInput(false);
      this.setChecklistServicioTipoInput(false);
      this.setFechaInput(true);
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

  setMecanicoInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.checklists = [];
    this.myControlMecanico.reset();
    if(e) {
      this.formBusqueda.get('mecanico').enable();
    } else {
      this.formBusqueda.get('mecanico').disable();
    }
  }

  setSupervisorInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.checklists = [];
    this.myControlSupervisor.reset();
    if(e) {
      this.formBusqueda.get('supervisor').enable();
    } else {
      this.formBusqueda.get('supervisor').disable();
    }
  }

  setChecklistServicioTipoInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.checklists = [];
    this.myControlChecklistServicioTipo.reset();
    if(e) {
      this.formBusqueda.get('checklistServicioTipo').enable();
    } else {
      this.formBusqueda.get('checklistServicioTipo').disable();
    }
  }

  setFechaInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.checklists = [];
    this.myControlFechaInicio.reset();
    this.myControlFechaFin.reset();
    if(e) {
      this.formBusqueda.get('fechaInicio').enable();
      this.formBusqueda.get('fechaFin').enable();
    } else {
      this.formBusqueda.get('fechaInicio').disable();
      this.formBusqueda.get('fechaFin').disable();
    }
  }

  imprimirChecklist(checklist : Checklist) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      this.reporteService.crearReporteChecklist(checklist.idChecklist).subscribe(data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        document.body.appendChild(a);
        a.href = url;
        a.download = `Checklist${checklist.idChecklist}_Servicio${checklist.servicio.idServicio}_${checklist.servicio.placa.numero}.pdf`;
        a.click();
        this.spinner.hide()
      });
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

  buscar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHECKLISTS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      if(this.idBusqueda == 0) {
        this.spinner.hide()
        return;
      } else if(this.idBusqueda == 1) {
        this.checklistService.getByPlaca(this.idPlaca).subscribe(data => {
          this.procesarData(data);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 2) {
        this.checklistService.getByChecklistServicioTipo(this.idChecklistServicioTipo).subscribe(data => {
          this.procesarData(data);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 3) {
        this.checklistService.getByMecanico(this.idMecanico).subscribe(data => {
          this.procesarData(data);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 4) {
        this.checklistService.getBySupervisor(this.idSupervisor).subscribe(data => {
          this.procesarData(data);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 5) {
        this.checklistService.getByFechaIngreso(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.procesarData(data);
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 6) {
        this.checklistService.getByFechaRevision(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.procesarData(data);
          this.spinner.hide()
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
    
  }

  procesarData(data : any) {
    this.checklists = [];
    for(let checklist of data) {
      checklist.fechaHoraIngreso = moment(checklist.fechaHoraIngreso).format(this.formatoFecha);
      checklist.fechaRevision = moment(checklist.fechaRevision).format(this.formatoFecha);

      checklist = this.bubbleSort(checklist);

      this.checklists.push(checklist);
    }
    const rows = [];
    this.checklists.forEach(element => rows.push(element, {detailRow : true, element}));
    this.dataSource = new MatTableDataSource(rows);
  }

  bubbleSort(checklist : Checklist) {
    //BUBBLE SORT
    for(let i = 0; i < checklist.checklistDetalle.length; i++) {
      for(let j = 0; j < checklist.checklistDetalle.length - 1 - i; j++) {
        if(checklist.checklistDetalle[j].idChecklistDetalle > checklist.checklistDetalle[j+1].idChecklistDetalle) {
          [checklist.checklistDetalle[j], checklist.checklistDetalle[j+1]] = [checklist.checklistDetalle[j+1], checklist.checklistDetalle[j]];
        }
      }
    }
    return checklist;
  }

}