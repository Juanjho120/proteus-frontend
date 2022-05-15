import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { DataService } from './../../../_service/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FacturaCompraDialogoEliminarComponent } from './factura-compra-dialogo-eliminar/factura-compra-dialogo-eliminar.component';
import { Proveedor } from './../../../_model/proveedor';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Repuesto } from './../../../_model/repuesto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepuestoService } from './../../../_service/repuesto.service';
import { FacturaCompraService } from './../../../_service/factura-compra.service';
import { ProveedorService } from './../../../_service/proveedor.service';
import { FacturaCompra } from './../../../_model/facturaCompra';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Sucursal } from 'src/app/_model/sucursal';
import { SucursalService } from 'src/app/_service/sucursal.service';

@Component({
  selector: 'app-factura-compra-busqueda',
  templateUrl: './factura-compra-busqueda.component.html',
  styleUrls: ['./factura-compra-busqueda.component.css']
})
export class FacturaCompraBusquedaComponent implements OnInit {

  form : FormGroup;

  idBusqueda : number = 0;
  idVencimiento : number = 0;

  repuesto : Repuesto;
  repuestos : Repuesto[];
  repuestosFiltrados$ : Observable<Repuesto[]>;

  proveedor : Proveedor;
  proveedores$ : Observable<Proveedor[]>;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  myControlProveedor : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);
  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlRepuesto : FormControl = new FormControl('', Validators.required);
  myControlVencimiento : FormControl = new FormControl('', Validators.required);

  porProveedor : boolean = false;
  porFecha : boolean = false;
  porRepuesto : boolean = false;
  porVencimiento : boolean = false;

  formatoFecha : string = 'YYYY-MM-DD';
  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  facturasCompra : FacturaCompra[] = [];
  facturasCompraTemp : FacturaCompra[] = [];

  idVentana : number = VentanaUtil.FACTURAS_DE_COMPRA;

  constructor(
    private proveedorService : ProveedorService,
    private facturaCompraService : FacturaCompraService,
    private repuestoService : RepuestoService,
    private sucursalService : SucursalService,
    private dataService : DataService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.sucursales$ = this.sucursalService.getAll();

    this.form = new FormGroup({
      'proveedor' : this.myControlProveedor,
      'repuesto' : this.myControlRepuesto,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin,
      'vencimiento' : this.myControlVencimiento
    });

    this.form.get('proveedor').disable();
    this.form.get('repuesto').disable();
    this.form.get('fechaInicio').disable();
    this.form.get('fechaFin').disable();
    this.form.get('vencimiento').disable();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.CONSULTAR)) {
      this.proveedores$ = this.proveedorService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getAll().subscribe(data => {
        this.repuestos = data;
      });
    }

    this.repuestosFiltrados$ = this.myControlRepuesto.valueChanges.pipe(map(val => this.filtrarRepuestos(val)))

  }

  filtrarPorSucursal() {
    this.facturasCompraTemp = this.facturasCompra.filter((facturaCompra) => this.idSucursal > 0 ? facturaCompra.sucursal.idSucursal == this.idSucursal : facturaCompra)
  }

  filtrarRepuestos(val : any) {
    if(val != null && val.idRepuesto > 0) {
      return this.repuestos.filter(el => 
        el.descripcion.toLowerCase().includes(val.descripcion.toLowerCase()) || el.codigo.toLowerCase().includes(val.codigo.toLowerCase())
      );
    }
    return this.repuestos.filter(el =>
      el.descripcion.toLowerCase().includes(val?.toLowerCase()) || el.codigo.toLowerCase().includes(val?.toLowerCase())
    );
  }

  mostrarRepuesto(repuesto : Repuesto) {
    return repuesto ? `${repuesto.codigo} - ${repuesto.descripcion}` : repuesto;
  }

  seleccionarRepuesto(e: any) {
    this.repuesto = e.option.value;
  }

  setInputs() {
    if(this.idBusqueda == 1) {
      this.setProveedorInput(true);
      this.setFechaInput(false);
      this.setRepuestoInput(false);
      this.setVencimientoInput(false);
    } else if(this.idBusqueda == 2) {
      this.setProveedorInput(false);
      this.setFechaInput(true);
      this.setRepuestoInput(false);
      this.setVencimientoInput(false);
    } else if(this.idBusqueda == 3) {
      this.setProveedorInput(false);
      this.setFechaInput(false);
      this.setRepuestoInput(true);
      this.setVencimientoInput(false);
    } else if(this.idBusqueda == 4) {
      this.setProveedorInput(false);
      this.setFechaInput(false);
      this.setRepuestoInput(false);
      this.setVencimientoInput(true);
    }
  }

  setRepuestoInput(e : boolean) {
    this.facturasCompra = [];
    this.myControlRepuesto.reset();
    if(e) {
      this.form.get('repuesto').enable();
    } else {
      this.form.get('repuesto').disable();
    }
  }

  setProveedorInput(e : boolean) {
    this.facturasCompra = [];
    this.myControlProveedor.reset();
    if(e) {
      this.form.get('proveedor').enable();
    } else {
      this.form.get('proveedor').disable();
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

  setVencimientoInput(e : boolean) {
    this.facturasCompra = [];
    this.idVencimiento = 0;
    this.myControlVencimiento.reset();
    if(e) {
      this.form.get('vencimiento').enable();
    } else {
      this.form.get('vencimiento').disable();
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
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS, PermisoUtil.CONSULTAR)) {
      this.facturasCompra = [];
      this.spinner.show()
      if(this.idBusqueda == 0) {
        this.spinner.hide()
        let mensaje = 'Debe elegir algún parámetro de búsqueda';
        this.snackBar.open(mensaje, "AVISO", { duration : 2000});
        return;
      } else if(this.idBusqueda == 1) {
        this.facturaCompraService.getByProveedor(this.proveedor.idProveedor).subscribe(data => {
          this.facturasCompra = data;
          this.filtrarPorSucursal();
          this.spinner.hide()
        });
      } else if(this.idBusqueda == 2) {
        this.facturaCompraService.getByFecha(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.facturasCompra = data;
          this.filtrarPorSucursal();
          this.spinner.hide()
        });;
      } else if(this.idBusqueda == 3) {
        this.facturaCompraService.getByRepuesto(this.repuesto.idRepuesto).subscribe(data => {
          this.facturasCompra = data;
          this.filtrarPorSucursal();
          this.spinner.hide()
        });;
      } else if(this.idBusqueda == 4) {
        if(this.idVencimiento == 1) {
          this.facturaCompraService.getByVencimiento(true).subscribe(data => {
            this.facturasCompra = data;
            this.filtrarPorSucursal();
            this.spinner.hide()
          });;
        } else if (this.idVencimiento == 2) {
          this.facturaCompraService.getByVencimiento(false).subscribe(data => {
            this.facturasCompra = data;
            this.filtrarPorSucursal();
            this.spinner.hide()
          });;
        }
      }
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirFacturaCompraDialogoEliminar(facturaCompra : FacturaCompra) {
    let dialogRef = this.dialog.open(FacturaCompraDialogoEliminarComponent, {
      width: '300px',
      data: facturaCompra
    });

    dialogRef.afterClosed().subscribe(data => {
      this.buscar();
    });
  }

  enviarFacturaEdicion(facturaCompra : FacturaCompra) {
    this.dataService.setFacturaCompraCambio(facturaCompra);
  }
}
