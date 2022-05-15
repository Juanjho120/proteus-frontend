import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { ServicioService } from './../../../_service/servicio.service';
import { Servicio } from 'src/app/_model/servicio';
import { FacturaCompraMenorDialogoEliminarComponent } from './factura-compra-menor-dialogo-eliminar/factura-compra-menor-dialogo-eliminar.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './../../../_service/data.service';
import { FacturaCompraMenorService } from './../../../_service/factura-compra-menor.service';
import { ProveedorMenorService } from './../../../_service/proveedor-menor.service';
import { FacturaCompraMenor } from './../../../_model/facturaCompraMenor';
import { Observable } from 'rxjs';
import { ProveedorMenor } from 'src/app/_model/proveedorMenor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-factura-compra-menor-busqueda',
  templateUrl: './factura-compra-menor-busqueda.component.html',
  styleUrls: ['./factura-compra-menor-busqueda.component.css']
})
export class FacturaCompraMenorBusquedaComponent implements OnInit {

  form : FormGroup;

  proveedoresMenores$ : Observable<ProveedorMenor[]>;

  servicios$ : Observable<Servicio[]>;

  myControlProveedorMenor : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);
  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlServicio : FormControl = new FormControl('', Validators.required);

  idBusqueda : number = 0;
  idServicio : number = 0;
  idProveedorMenor : number = 0;

  formatoFecha : string = 'YYYY-MM-DD';
  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  facturasCompra : FacturaCompraMenor[] = [];

  idVentana : number = VentanaUtil.FACTURAS_DE_COMPRA;

  constructor(
    private proveedorMenorService : ProveedorMenorService,
    private servicioService : ServicioService,
    private facturaCompraMenorService : FacturaCompraMenorService,
    private dataService : DataService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'proveedorMenor' : this.myControlProveedorMenor,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin,
      'servicio' : this.myControlServicio
    });

    this.form.get('proveedorMenor').disable();
    this.form.get('fechaInicio').disable();
    this.form.get('fechaFin').disable();
    this.form.get('servicio').disable();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES_MENORES, PermisoUtil.CONSULTAR)) {
      this.proveedoresMenores$ = this.proveedorMenorService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.servicios$ = this.servicioService.getByFacturado(false);
    }
  }

  setInputs() {
    if(this.idBusqueda == 1) {
      this.setProveedorMenorInput(true);
      this.setFechaInput(false);
      this.setServicioInput(false);
    } else if(this.idBusqueda == 2) {
      this.setProveedorMenorInput(false);
      this.setFechaInput(true);
      this.setServicioInput(false);
    } else if(this.idBusqueda == 3) {
      this.setProveedorMenorInput(false);
      this.setFechaInput(false);
      this.setServicioInput(true);
    }
  }

  setProveedorMenorInput(e : boolean) {
    this.facturasCompra = [];
    this.idProveedorMenor = 0;
    this.myControlProveedorMenor.reset();
    if(e) {
      this.form.get('proveedorMenor').enable();
    } else {
      this.form.get('proveedorMenor').disable();
    }
  }

  setFechaInput(e : boolean) {
    this.facturasCompra = [];
    this.myControlFechaInicio.reset();
    this.myControlFechaFin.reset();
    if(e) {
      this.form.get('fechaInicio').enable();
      this.form.get('fechaFin').enable();
    } else {
      this.form.get('fechaInicio').disable();
      this.form.get('fechaFin').disable();
    }
  }

  setServicioInput(e : boolean) {
    this.facturasCompra = [];
    this.idServicio = 0;
    this.myControlServicio.reset();
    if(e) {
      this.form.get('servicio').enable();
    } else {
      this.form.get('servicio').disable();
    }
  }

  cambiarFechaInicio(e : any) {
    this.fechaInicioSeleccionada = e.value;
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaFin(e : any) {
    this.fechaFinSeleccionada = e.value;
    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFecha);
  }

  buscar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      if(this.idBusqueda == 0) {
        this.spinner.hide()
        let mensaje = 'Debe elegir algún parámetro de búsqueda';
        this.snackBar.open(mensaje, "AVISO", { duration : 2000});
        return;
      } else if(this.idBusqueda == 1) {
        this.facturaCompraMenorService.getByProveedorMenor(this.idProveedorMenor).subscribe(data => {
          this.facturasCompra = data;
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 2) {
        this.facturaCompraMenorService.getByFecha(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.facturasCompra = data;
          this.spinner.hide()
        });;
      } else if(this.idBusqueda == 3) {
        this.facturaCompraMenorService.getByServicio(this.idServicio).subscribe(data => {
          this.facturasCompra = data;
          this.spinner.hide()
        });;
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirFacturaCompraDialogoEliminar(facturaCompraMenor : FacturaCompraMenor) {
    this.dialog.open(FacturaCompraMenorDialogoEliminarComponent, {
      width: '300px',
      data: facturaCompraMenor
    });
  }

  enviarFacturaEdicion(facturaCompraMenor : FacturaCompraMenor) {
    this.dataService.setFacturaCompraMenorCambio(facturaCompraMenor);
  }

}
