import { Personal } from './../../../../_model/personal';
import { PersonalService } from './../../../../_service/personal.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CajaChicaService } from './../../../../_service/caja-chica.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CajaChica } from './../../../../_model/cajaChica';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-caja-chica-dialogo-editar',
  templateUrl: './caja-chica-dialogo-editar.component.html',
  styleUrls: ['./caja-chica-dialogo-editar.component.css']
})
export class CajaChicaDialogoEditarComponent implements OnInit {

  formCajaChica : FormGroup;
  cajaChica : CajaChica;

  personal$ : Observable<Personal[]>;
  idAutoriza : number = 0;
  idRecibe : number = 0;

  maxFecha : Date = new Date();
  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  formatoFecha : string = 'YYYY-MM-DD';

  constructor(
    private dialogRef : MatDialogRef<CajaChicaDialogoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CajaChica,
    private cajaChicaService : CajaChicaService,
    private personalService : PersonalService
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.personal$ = this.personalService.getAll();
    
    this.cajaChica = new CajaChica();
    this.cajaChica.idCajaChica = this.data.idCajaChica;
    this.cajaChica.fechaIngreso = this.data.fechaIngreso;
    this.cajaChica.descripcion = this.data.descripcion;
    this.cajaChica.monto = this.data.monto;
    this.cajaChica.autoriza = this.data.autoriza;
    this.cajaChica.recibe = this.data.recibe;
    this.cajaChica.concepto = this.data.concepto;
    this.cajaChica.comprobanteTipo = this.data.comprobanteTipo;
    this.cajaChica.numeroComprobante = this.data.numeroComprobante;
    this.cajaChica.facturaCompraMenor = this.data.facturaCompraMenor;

    this.initForm();
  }

  private initForm() {
    this.formCajaChica = new FormGroup({
      'fechaIngreso' : new FormControl(this.cajaChica.fechaIngreso),
      'concepto' : new FormControl(this.cajaChica.concepto.nombre, Validators.required),
      'autoriza' : new FormControl(this.cajaChica.autoriza.idPersonal, Validators.required),
      'recibe' : new FormControl(this.cajaChica.recibe.idPersonal, Validators.required),
      'descripcion' : new FormControl(this.cajaChica.descripcion, Validators.required),
      'comprobanteTipo' : new FormControl(this.cajaChica.comprobanteTipo.nombre, Validators.required),
      'facturaCompra' : new FormControl('', Validators.required),
      'numeroComprobante' : new FormControl(''),
      'monto' : new FormControl(this.cajaChica.monto, Validators.required),
    });

    this.formCajaChica.get('fechaIngreso').disable();
    this.formCajaChica.get('concepto').disable();
    this.formCajaChica.get('facturaCompra').disable();
    this.formCajaChica.get('comprobanteTipo').disable();
    
    if(this.cajaChica.numeroComprobante==null) {
      this.formCajaChica.get('numeroComprobante').disable();
    } else {
      this.formCajaChica.get('numeroComprobante').enable();
      this.formCajaChica.patchValue({
        numeroComprobante : this.cajaChica.numeroComprobante
      });
    }

    if(this.cajaChica.facturaCompraMenor == null) {
      this.formCajaChica.get('facturaCompra').disable();
    } else {
      this.formCajaChica.patchValue({
        facturaCompra : `${this.cajaChica.facturaCompraMenor.codigo} - ${this.cajaChica.facturaCompraMenor.proveedorMenor.nombre}`
      });
      this.formCajaChica.get('descripcion').disable();
      this.formCajaChica.get('numeroComprobante').disable();
      this.formCajaChica.get('monto').disable();
    }
    
    this.idAutoriza = this.cajaChica.autoriza.idPersonal;
    this.idRecibe = this.cajaChica.recibe.idPersonal;
  }

  operar() {
    if(this.formCajaChica.invalid) {return; }

    this.cajaChica.descripcion = this.formCajaChica.value['descripcion'];
    this.cajaChica.monto = this.formCajaChica.value['monto'];
    this.cajaChica.numeroComprobante = this.formCajaChica.value['numeroComprobante'];
    this.cajaChica.autoriza = new Personal();
    this.cajaChica.recibe = new Personal();
    this.cajaChica.autoriza.idPersonal = this.idAutoriza;
    this.cajaChica.recibe.idPersonal = this.idRecibe;

    if(this.cajaChica.facturaCompraMenor!=null) {
      this.cajaChica.monto = this.data.monto;
      this.cajaChica.numeroComprobante = this.data.numeroComprobante;
      this.cajaChica.descripcion = this.data.descripcion;
    }
    //ACTUALIZAR
    if(this.cajaChica != null && this.cajaChica.idCajaChica > 0) {
      this.cajaChicaService.update(this.cajaChica).pipe(switchMap(() => {
        return this.cajaChicaService.getByFechaIngreso(moment(this.maxFecha).format(this.formatoFecha), 
        moment(this.maxFecha).format(this.formatoFecha));
      })).subscribe(data => {
        this.cajaChicaService.setObjetoCambio(data);
        this.cajaChicaService.setMensajeCambio('Caja chica actualizada');
      })
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }
  
}
