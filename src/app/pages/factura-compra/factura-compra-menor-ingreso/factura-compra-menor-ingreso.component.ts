import { Sucursal } from './../../../_model/sucursal';
import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { ServicioService } from './../../../_service/servicio.service';
import { Servicio } from 'src/app/_model/servicio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './../../../_service/data.service';
import { ProveedorMenorService } from './../../../_service/proveedor-menor.service';
import { FacturaCompraMenorService } from './../../../_service/factura-compra-menor.service';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaCompraMenorDetalle } from './../../../_model/facturaCompraMenorDetalle';
import { FacturaCompraMenor } from './../../../_model/facturaCompraMenor';
import { Observable } from 'rxjs';
import { ProveedorMenor } from 'src/app/_model/proveedorMenor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SucursalService } from 'src/app/_service/sucursal.service';

@Component({
  selector: 'app-factura-compra-menor-ingreso',
  templateUrl: './factura-compra-menor-ingreso.component.html',
  styleUrls: ['./factura-compra-menor-ingreso.component.css']
})
export class FacturaCompraMenorIngresoComponent implements OnInit {

  formFacturaCompraMenor : FormGroup;
  formFacturaCompraMenorDetalle : FormGroup;

  idProveedorMenor : number = 0;
  proveedoresMenores$ : Observable<ProveedorMenor[]>;

  formatoFecha : string = 'YYYY-MM-DD';
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();
  fechaFormato : string;

  facturaCompraMenorDetalle : FacturaCompraMenorDetalle[] = [];

  displayedColumns = ['cant', 'descripcion', 'costoCompra', 'accion'];
  dataSourceFacturaCompraDetalle : MatTableDataSource<FacturaCompraMenorDetalle>;

  totalFactura : number = 0;

  idFacturaCompraMenor : number = 0;

  servicios$ : Observable<Servicio[]>;
  idServicio : number = 0;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  idVentana : number = VentanaUtil.FACTURAS_DE_COMPRA;

  constructor(
    private facturaCompraMenorService : FacturaCompraMenorService,
    private proveedorMenorService : ProveedorMenorService,
    private servicioService : ServicioService,
    private sucursalService : SucursalService,
    private dataService : DataService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.sucursales$ = this.sucursalService.getAll();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES_MENORES, PermisoUtil.CONSULTAR)) {
      this.proveedoresMenores$ = this.proveedorMenorService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.servicios$ = this.servicioService.getBySucursalAndFacturado(this.idSucursal, false);
    }
    
    this.initFormFacturaCompraMenor();

    this.initFormFacturaCompraMenorDetalle();

    this.dataService.getFacturaCompraMenorCambio().subscribe(data => {
      if(data!=null) {
        this.cargarCamposFacturaCompraMenor(data);
      }
    });
  }

  filtrarPorSucursal() {
    this.servicios$ = this.servicioService.getBySucursalAndFacturado(this.idSucursal, false);
  }

  cargarCamposFacturaCompraMenor(facturaCompraMenor : FacturaCompraMenor) {
    this.idFacturaCompraMenor = facturaCompraMenor.idFacturaCompraMenor;
    this.fechaFormato = facturaCompraMenor.fecha;
    this.idServicio = 0;
    if(facturaCompraMenor.servicio!=null) {
      this.idServicio = facturaCompraMenor.servicio.idServicio;
    }
    this.formFacturaCompraMenor.patchValue({
      proveedorMenor : facturaCompraMenor.proveedorMenor.idProveedorMenor,
      codigo : facturaCompraMenor.codigo,
      fecha : this.fechaFormato,
      servicio : this.idServicio,
    });
    this.idProveedorMenor = facturaCompraMenor.proveedorMenor.idProveedorMenor;
    this.totalFactura = facturaCompraMenor.total;
    this.facturaCompraMenorDetalle = facturaCompraMenor.facturaCompraMenorDetalle;
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraMenorDetalle);
  }

  initFormFacturaCompraMenor() {
    this.formFacturaCompraMenor = new FormGroup({
      'proveedorMenor' : new FormControl('', Validators.required),
      'codigo' : new FormControl('', Validators.required),
      'fecha' : new FormControl('', Validators.required),
      'servicio' : new FormControl('')
    });
  }

  initFormFacturaCompraMenorDetalle() {
    this.formFacturaCompraMenorDetalle = new FormGroup({
      'cantidad' : new FormControl('', Validators.required),
      'descripcion' : new FormControl('', Validators.required),
      'costoCompra' : new FormControl('', Validators.required)
    });
  }

  cambiarFecha(e : any) {
    this.fechaSeleccionada = e.value;
    this.fechaFormato = moment(this.fechaSeleccionada).format(this.formatoFecha);
  }

  evaluarAgregarFactura() {
    if(this.formFacturaCompraMenor.valid && this.facturaCompraMenorDetalle.length > 0) {
      return false;
    }
    return true;
  }

  removerFacturaCompraMenorDetalle(index : number) {
    this.totalFactura = this.totalFactura - this.facturaCompraMenorDetalle[index].costoCompra;
    this.facturaCompraMenorDetalle.splice(index, 1);
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraMenorDetalle);
  }

  agregarFacturaCompraDetalle() {
    let facturaCompraMenorDetalle = new FacturaCompraMenorDetalle();
    facturaCompraMenorDetalle.cantidad = this.formFacturaCompraMenorDetalle.value['cantidad'];
    facturaCompraMenorDetalle.descripcion = this.formFacturaCompraMenorDetalle.value['descripcion'];
    facturaCompraMenorDetalle.costoCompra = this.formFacturaCompraMenorDetalle.value['costoCompra'];
    facturaCompraMenorDetalle.costoVenta = 0;
    
    this.totalFactura += facturaCompraMenorDetalle.costoCompra;

    this.facturaCompraMenorDetalle.push(facturaCompraMenorDetalle);
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraMenorDetalle);

    this.formFacturaCompraMenorDetalle.reset();
  }

  limpiarControlGeneral() {
    this.servicios$ = this.servicioService.getByFacturado(false);
    this.formFacturaCompraMenorDetalle.reset();
    this.totalFactura = 0;
    this.idFacturaCompraMenor = 0;
    this.fechaFormato = "";
    this.facturaCompraMenorDetalle = [];
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraMenorDetalle);
    this.idProveedorMenor = 0;
    this.idServicio = 0;
    this.formFacturaCompraMenor.reset();
  }

  agregarFacturaCompra() {
    let facturaCompraMenor = new FacturaCompraMenor();
    facturaCompraMenor.codigo = this.formFacturaCompraMenor.value['codigo'];
    facturaCompraMenor.fecha = this.fechaFormato;
    facturaCompraMenor.proveedorMenor = new ProveedorMenor();
    facturaCompraMenor.proveedorMenor.idProveedorMenor = this.idProveedorMenor;
    facturaCompraMenor.facturaCompraMenorDetalle = this.facturaCompraMenorDetalle;
    if(this.idServicio>0) {
      facturaCompraMenor.servicio = new Servicio();
      facturaCompraMenor.servicio.idServicio = this.idServicio;
    }

    if(this.idFacturaCompraMenor>0) {
      facturaCompraMenor.idFacturaCompraMenor = this.idFacturaCompraMenor;
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.EDITAR)) {
        this.spinner.show()
        this.facturaCompraMenorService.update(facturaCompraMenor).subscribe(() => {
          let mensaje = 'Factura de compra actualizada'
          this.snackBar.open(mensaje, "AVISO", { duration : 2000});
          this.limpiarControlGeneral();
          this.spinner.hide()
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.CREAR)) {
        this.spinner.show()
        this.facturaCompraMenorService.create(facturaCompraMenor).subscribe(() => {
          let mensaje = 'Factura de compra creada'
          this.snackBar.open(mensaje, "AVISO", { duration : 2000});
          this.limpiarControlGeneral();
          this.spinner.hide()
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
    
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }


}
