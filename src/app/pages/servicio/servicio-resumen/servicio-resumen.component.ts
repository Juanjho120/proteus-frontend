import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { FacturaCompraMenorDetalleService } from './../../../_service/factura-compra-menor-detalle.service';
import { FacturaCompraMenorDetalleDialogoComponent } from './factura-compra-menor-detalle-dialogo/factura-compra-menor-detalle-dialogo.component';
import { FacturaCompraMenorDetalle } from './../../../_model/facturaCompraMenorDetalle';
import { FacturaCompraMenorService } from './../../../_service/factura-compra-menor.service';
import { FacturaCompraMenor } from './../../../_model/facturaCompraMenor';
import { ReporteService } from './../../../_service/reporte.service';
import { ChecklistServicioDialogoComponent } from './checklist-servicio-dialogo/checklist-servicio-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { ChecklistService } from './../../../_service/checklist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioService } from './../../../_service/servicio.service';
import { Servicio } from './../../../_model/servicio';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Placa } from 'src/app/_model/placa';
import { Segmento } from 'src/app/_model/segmento';
import { ServicioTipo } from 'src/app/_model/servicioTipo';
import { LoaderService } from 'src/app/_service/loader.service';
import { Sucursal } from 'src/app/_model/sucursal';

@Component({
  selector: 'app-servicio-resumen',
  templateUrl: './servicio-resumen.component.html',
  styleUrls: ['./servicio-resumen.component.css']
})
export class ServicioResumenComponent implements OnInit {

  formBusqueda : FormGroup;

  servicio : Servicio;
  totalTrabajo : number = 0;
  totalRepuesto : number = 0;
  totalRepuestoMenor : number = 0;

  facturaCompraMenor : FacturaCompraMenor[] = [];
  facturaCompraMenorDetalle : FacturaCompraMenorDetalle[] = [];

  formatoFecha : string = 'YYYY-MM-DD';

  idVentana : number = VentanaUtil.SERVICIOS;

  constructor(
    private servicioService : ServicioService,
    private facturaCompraMenorService : FacturaCompraMenorService,
    private facturaCompraMenorDetalleService : FacturaCompraMenorDetalleService,
    private checklistService : ChecklistService,
    private reporteService : ReporteService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.servicioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.facturaCompraMenorDetalleService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.cargarServicio(0);

    this.formBusqueda = new FormGroup({
      'noServicio' : new FormControl('', Validators.required)
    });
  }

  cargarServicio(correlativo : number) {
    this.totalTrabajo = 0;
    this.totalRepuesto = 0;
    this.totalRepuestoMenor = 0;
    this.servicio = new Servicio();
    this.servicio.placa = new Placa();
    this.servicio.segmento = new Segmento();
    this.servicio.servicioTipo = new ServicioTipo();
    this.servicio.sucursal = new Sucursal();
    this.servicio.costoTotal = 0;
    if(correlativo!==0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
        this.spinner.show()
        this.servicioService.getByCorrelativo(correlativo).subscribe(data => {
          if(data!=null) {
            this.totalTrabajo = 0;
            this.totalRepuesto = 0;
            this.totalRepuestoMenor = 0;
            this.servicio = data;
            if(!(this.servicio.servicioTipo.nombre == "REPARACION")) {
              this.servicio.servicioTipo.nombre = `SERVICIO ${this.servicio.servicioTipo.nombre}`;
            }
    
            document.getElementById("div-servicio").style.display = "block";
            for(let servicioTrabajo of this.servicio.servicioTrabajo) {
              this.totalTrabajo += servicioTrabajo.costo;
            };
    
            for(let servicioRepuesto of this.servicio.servicioRepuesto) {
              this.totalRepuesto += servicioRepuesto.costoTotal;
            };
    
            this.servicio.fechaHora = moment(this.servicio.fechaHora).format(this.formatoFecha);
    
            this.facturaCompraMenor = [];
            if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.CONSULTAR)) {
              this.facturaCompraMenorService.getByServicio(this.servicio.idServicio).subscribe(data => {
                this.facturaCompraMenor = data;
                for(let facturaCompraMenor of this.facturaCompraMenor) {
                  for(let facturaCompraMenorDetalle of facturaCompraMenor.facturaCompraMenorDetalle) {
                    facturaCompraMenorDetalle.facturaCompraMenor = new FacturaCompraMenor();
                    facturaCompraMenorDetalle.facturaCompraMenor.idFacturaCompraMenor = facturaCompraMenor.idFacturaCompraMenor;
                    this.totalRepuestoMenor += facturaCompraMenorDetalle.costoVenta;
                    this.facturaCompraMenorDetalle.push(facturaCompraMenorDetalle);
                  }
                }
                this.spinner.hide()
              });
            } else {
              this.spinner.hide()
              this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
            }
            
          }
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
  }

  buscar() {
    this.servicio = new Servicio();
    this.facturaCompraMenorDetalle = [];
    document.getElementById("div-servicio").style.display = "none";
    this.cargarServicio(this.formBusqueda.value['noServicio']);
  }

  abrirChecklistDialogo() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHECKLISTS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      this.checklistService.getByServicio(this.servicio.idServicio).subscribe(dataChecklist => {
        this.spinner.hide()
        if(dataChecklist!=null) {
          this.dialog.open(ChecklistServicioDialogoComponent, {
            width: '1300px',
            data: dataChecklist
          });
        } else {
          this.snackBar.open('El servicio no posee checklist', 'AVISO', {duration : 2000});
        }
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirFacturaCompraMenorDetalleDialogoEditar(facturaCompraMenorDetalle : FacturaCompraMenorDetalle) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURA_COMPRA_MENOR_DETALLES, PermisoUtil.EDITAR)) {
      let dialogRef = this.dialog.open(FacturaCompraMenorDetalleDialogoComponent, {
        width: '250px',
        data: facturaCompraMenorDetalle
      });
  
      dialogRef.afterClosed().subscribe(data => {
        this.buscar();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  imprimirReporte() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      this.reporteService.crearReporteServicio(this.servicio.idServicio).subscribe(data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        document.body.appendChild(a);
        a.href = url;
        a.download = `Servicio${this.servicio.correlativo}.pdf`;
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


}