import { NgxSpinnerService } from 'ngx-spinner';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { DataService } from './../../../_service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MarcaRepuestoService } from './../../../_service/marca-repuesto.service';
import { MarcaRepuesto } from './../../../_model/marcaRepuesto';
import { map } from 'rxjs/operators';
import { RepuestoService } from './../../../_service/repuesto.service';
import { FacturaCompraDetalle } from './../../../_model/facturaCompraDetalle';
import { FacturaCompra } from './../../../_model/facturaCompra';
import { Repuesto } from './../../../_model/repuesto';
import { Proveedor } from './../../../_model/proveedor';
import { Observable } from 'rxjs';
import { ProveedorService } from './../../../_service/proveedor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaCompraService } from './../../../_service/factura-compra.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';
import { Sucursal } from 'src/app/_model/sucursal';
import { SucursalService } from 'src/app/_service/sucursal.service';

@Component({
  selector: 'app-factura-compra-ingreso',
  templateUrl: './factura-compra-ingreso.component.html',
  styleUrls: ['./factura-compra-ingreso.component.css']
})
export class FacturaCompraIngresoComponent implements OnInit {

  formFacturaCompra : FormGroup;
  formFacturaCompraDetalle : FormGroup;

  idProveedor : number = 0;
  proveedores$ : Observable<Proveedor[]>;

  formatoFecha : string = 'YYYY-MM-DD';
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();
  fechaFormato : string;

  facturaCompraDetalle : FacturaCompraDetalle[] = [];

  repuestosFiltrados$ : Observable<Repuesto[]>;
  myControlRepuesto : FormControl = new FormControl('', Validators.required);
  repuestoSeleccionado : Repuesto;
  repuestos : Repuesto[];

  marcaRepuestoSeleccionado : MarcaRepuesto;
  marcas$ : Observable<MarcaRepuesto[]>;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  displayedColumns = ['repuesto', 'marca', 'cantidad', 'costoUnitario', 'costoTotal', 'accion'];
  dataSourceFacturaCompraDetalle : MatTableDataSource<FacturaCompraDetalle>;

  totalFactura : number = 0;

  idFacturaCompra : number = 0;

  idVentana : number = VentanaUtil.FACTURAS_DE_COMPRA;

  constructor(
    private facturaCompraService : FacturaCompraService,
    private sucursalService : SucursalService,
    private repuestoService : RepuestoService,
    private marcaRepuestoService : MarcaRepuestoService,
    private proveedorService : ProveedorService,
    private dataService : DataService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.CONSULTAR)) {
      this.proveedores$ = this.proveedorService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getAll().subscribe(data => {
        this.repuestos = data;
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_REPUESTO, PermisoUtil.CONSULTAR)) {
      this.marcas$ = this.marcaRepuestoService.getAll();
    }

    this.sucursales$ = this.sucursalService.getAll();

    this.initFormFacturaCompra();

    this.initFormFacturaCompraDetalle();

    this.repuestosFiltrados$ = this.myControlRepuesto.valueChanges.pipe(map(val => this.filtrarRepuestos(val)));

    this.dataService.getFacturaCompraCambio().subscribe(data => {
      if(data!=null) {
        this.cargarCamposFacturaCompra(data);
      }
    });
  }

  cargarCamposFacturaCompra(facturaCompra : FacturaCompra) {
    this.idFacturaCompra = facturaCompra.idFacturaCompra;
    this.fechaFormato = facturaCompra.fecha;
    this.formFacturaCompra.patchValue({
      proveedor : facturaCompra.proveedor.idProveedor,
      codigo : facturaCompra.codigo,
      fecha : this.fechaFormato
    });
    this.idProveedor = facturaCompra.proveedor.idProveedor;
    this.totalFactura = facturaCompra.total;
    this.facturaCompraDetalle = facturaCompra.facturaCompraDetalle;
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraDetalle);
  }

  initFormFacturaCompra() {
    this.formFacturaCompra = new FormGroup({
      'proveedor' : new FormControl('', Validators.required),
      'codigo' : new FormControl('', Validators.required),
      'fecha' : new FormControl('', Validators.required),
      'sucursal' : new FormControl(this.idSucursal, Validators.required),
    });
  }

  initFormFacturaCompraDetalle() {
    this.formFacturaCompraDetalle = new FormGroup({
      'marca' : new FormControl('', Validators.required),
      'repuesto' : this.myControlRepuesto,
      'cantidad' : new FormControl('', Validators.required),
      'costoUnitario' : new FormControl('', Validators.required)
    });
  }

  cambiarFecha(e : any) {
    this.fechaSeleccionada = e.value;
    this.fechaFormato = moment(this.fechaSeleccionada).format(this.formatoFecha);
  }

  evaluarAgregarFactura() {
    if(this.formFacturaCompra.valid && this.facturaCompraDetalle.length > 0) {
      return false;
    }
    return true;
  }

  mostrarRepuesto(repuesto : Repuesto) {
    return repuesto ? `${repuesto.codigo} - ${repuesto.descripcion}` : repuesto;
  }

  seleccionarRepuesto(e: any) {
    this.repuestoSeleccionado = e.option.value;
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
  
  removerFacturaCompraDetalle(index : number) {
    this.totalFactura = this.totalFactura - this.facturaCompraDetalle[index].costoTotal;
    this.facturaCompraDetalle.splice(index, 1);
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraDetalle);
  }

  agregarFacturaCompraDetalle() {
    if(this.repuestoSeleccionado) {
      let cont = 0;
      for(let i = 0; i < this.facturaCompraDetalle.length; i++) {
        let facturaCompraDetalleAux = this.facturaCompraDetalle[i];
        if((facturaCompraDetalleAux.repuesto.idRepuesto === this.repuestoSeleccionado.idRepuesto) 
            && (facturaCompraDetalleAux.marcaRepuesto.idMarcaRepuesto === this.marcaRepuestoSeleccionado.idMarcaRepuesto)) {
          cont++;
          break;
        }
      }

      if(cont > 0) {
        let mensaje = 'Este repuesto ya se encuentra agregado'
        this.snackBar.open(mensaje, "AVISO", { duration : 2000});
      } else {
        let facturaCompraDetalle = new FacturaCompraDetalle();
        facturaCompraDetalle.cantidad = this.formFacturaCompraDetalle.value['cantidad'];
        facturaCompraDetalle.repuesto = this.repuestoSeleccionado;
        facturaCompraDetalle.marcaRepuesto = this.marcaRepuestoSeleccionado;
        facturaCompraDetalle.costoUnitario = this.formFacturaCompraDetalle.value['costoUnitario'];
        facturaCompraDetalle.costoTotal = facturaCompraDetalle.cantidad * facturaCompraDetalle.costoUnitario;

        facturaCompraDetalle.costoTotal = parseFloat(facturaCompraDetalle.costoTotal.toFixed(2));
        
        this.totalFactura += facturaCompraDetalle.costoTotal;

        this.facturaCompraDetalle.push(facturaCompraDetalle);
        this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraDetalle);

        this.limpiarControlDetalle();
      }

    }
    
  }

  limpiarControlDetalle() {
    this.repuestoSeleccionado = null;
    this.myControlRepuesto.reset();
    this.formFacturaCompraDetalle.reset();
  }

  limpiarControlGeneral() {
    this.limpiarControlDetalle();
    this.totalFactura = 0;
    this.idFacturaCompra = 0;
    this.fechaFormato = "";
    this.facturaCompraDetalle = [];
    this.dataSourceFacturaCompraDetalle = new MatTableDataSource(this.facturaCompraDetalle);
    this.idProveedor = 0;
    this.marcaRepuestoSeleccionado = new MarcaRepuesto();
    this.formFacturaCompra.reset();
    this.idSucursal = 1;
    this.formFacturaCompra.patchValue({
      sucursal: this.idSucursal
    })
  }

  agregarFacturaCompra() {
    let facturaCompra = new FacturaCompra();
    facturaCompra.codigo = this.formFacturaCompra.value['codigo'];
    facturaCompra.fecha = this.fechaFormato;
    facturaCompra.proveedor = new Proveedor();
    facturaCompra.proveedor.idProveedor = this.idProveedor;
    facturaCompra.facturaCompraDetalle = this.facturaCompraDetalle;
    facturaCompra.sucursal = new Sucursal();
    facturaCompra.sucursal.idSucursal = this.idSucursal;

    if(this.idFacturaCompra>0) {
      facturaCompra.idFacturaCompra = this.idFacturaCompra;
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS, PermisoUtil.EDITAR)) {
        this.spinner.show()
        this.facturaCompraService.update(facturaCompra).subscribe(() => {
          let mensaje = 'Factura de compra actualizada'
          this.snackBar.open(mensaje, "AVISO", { duration : 2000});
          this.limpiarControlGeneral();
          this.spinner.hide()
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS, PermisoUtil.CREAR)) {
        this.spinner.show()
        this.facturaCompraService.create(facturaCompra).subscribe(() => {
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
