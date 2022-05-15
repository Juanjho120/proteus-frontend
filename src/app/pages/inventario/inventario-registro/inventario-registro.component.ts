import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaCompraDTO } from './../../../_model/dto/facturaCompraDTO';
import { FacturaCompraService } from './../../../_service/factura-compra.service';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { UsuarioService } from './../../../_service/usuario.service';
import { DataService } from './../../../_service/data.service';
import { Usuario } from './../../../_model/usuario';
import { Concepto } from './../../../_model/concepto';
import { InventarioService } from './../../../_service/inventario.service';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepuestoService } from './../../../_service/repuesto.service';
import { Observable } from 'rxjs';
import { InventarioDetalle } from './../../../_model/inventarioDetalle';
import { Inventario } from './../../../_model/inventario';
import { Repuesto } from './../../../_model/repuesto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FacturaCompra } from 'src/app/_model/facturaCompra';
import { MatRadioChange } from '@angular/material/radio';
import { LoaderService } from 'src/app/_service/loader.service';
import { Sucursal } from 'src/app/_model/sucursal';
import { SucursalService } from 'src/app/_service/sucursal.service';

@Component({
  selector: 'app-inventario-registro',
  templateUrl: './inventario-registro.component.html',
  styleUrls: ['./inventario-registro.component.css']
})
export class InventarioRegistroComponent implements OnInit {

  idConcepto : number;
  form : FormGroup;
  formInventario : FormGroup;

  repuestos : Repuesto[];
  repuestoSeleccionado : Repuesto;

  facturas : FacturaCompraDTO[];
  facturaSeleccionada : FacturaCompraDTO;

  inventarioDetalle : InventarioDetalle[] = [];

  myControlRepuesto : FormControl = new FormControl('', Validators.required);
  myControlFactura : FormControl = new FormControl('', Validators.required);

  repuestosFiltrados$ : Observable<Repuesto[]>;
  facturasFiltradas$ : Observable<FacturaCompraDTO[]>;

  inventarioCompleto : boolean = false;

  idInventario : number = 0;

  conceptoControl : boolean = false;

  usuarioLogueado : Usuario;

  idVentana : number = VentanaUtil.INVENTARIOS;

  dataSourceInventarioDetalle : MatTableDataSource<InventarioDetalle>;
  displayedColumnsInventarioDetalle = ['cantidad', 'codigo', 'descripcion', 'accion'];

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  constructor(
    private repuestoService : RepuestoService,
    private facturaCompraService : FacturaCompraService,
    private inventarioService : InventarioService,
    private sucursalService : SucursalService,
    private dataService : DataService,
    private usuarioService : UsuarioService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.sucursales$ = this.sucursalService.getAll();
    this.dataSourceInventarioDetalle = new MatTableDataSource();
    this.form = new FormGroup({
      'cantidad' : new FormControl('', Validators.required),
      'repuesto' : this.myControlRepuesto
    });

    this.formInventario = new FormGroup({
      'razon' : new FormControl('', Validators.required)
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getAll().subscribe(data => {
        this.repuestos = data;
      });

      this.repuestosFiltrados$ = this.myControlRepuesto.valueChanges.pipe(map(val => this.filtrarRepuestos(val)));
    }

    this.facturaCompraService.getAllNotInInventarios().subscribe(data => {
      this.facturas = data;
    })
    this.facturasFiltradas$ = this.myControlFactura.valueChanges.pipe(map(val => this.filtrarFacturas(val)));

    this.dataService.getInventarioCambio().subscribe(data => {
      this.cargarCamposInventario(data);
    });

    this.usuarioService.getUsuarioByToken().subscribe(data => {
      this.usuarioLogueado = data;
    });

  }

  cargarCamposInventario(inventario : Inventario) {
    this.idInventario = inventario.idInventario;
    this.formInventario.patchValue({
      razon : inventario.razon
    });
    this.idConcepto = inventario.concepto.idConcepto;
    this.idSucursal = inventario.sucursal.idSucursal;
    this.inventarioDetalle = inventario.inventarioDetalle;
    this.dataSourceInventarioDetalle = new MatTableDataSource(this.inventarioDetalle)
    this.inventarioCompleto = true;
    this.conceptoControl = true;
    if(inventario.facturaCompra!=null) {
      this.facturaSeleccionada = new FacturaCompraDTO()
      this.facturaSeleccionada.idFacturaCompra =  inventario.facturaCompra.idFacturaCompra
      this.facturaSeleccionada.codigo = inventario.facturaCompra.codigo
      this.facturaSeleccionada.proveedor = inventario.facturaCompra.proveedor.nombre

      this.myControlFactura.patchValue(this.facturaSeleccionada)
    }
  }
  
  evaluarEntradaSalidaInventario($event: MatRadioChange) {
    if($event.value==2) {
      this.myControlFactura.reset()
      this.facturaSeleccionada = null
      this.myControlFactura.disable()
      this.formInventario.reset()
    } else {
      this.myControlFactura.enable()
    }
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

  filtrarFacturas(val : any) {
    if(val != null && val.idFacturaCompra > 0) {
      return this.facturas.filter(el => 
        el.codigo.toLowerCase().includes(val.codigo.toLowerCase())
      );
    }
    return this.facturas.filter(el =>
      el.codigo.toLowerCase().includes(val?.toLowerCase())
    );
  }

  mostrarRepuesto(repuesto : Repuesto) {
    return repuesto ? `${repuesto.codigo} - ${repuesto.descripcion}` : repuesto;
  }

  mostrarFactura(factura : FacturaCompraDTO) {
    return factura ? `${factura.codigo} - ${factura.proveedor}` : factura;
  }

  seleccionarRepuesto(e: any) {
    this.repuestoSeleccionado = e.option.value;
  }

  seleccionarFactura(e: any) {
    this.facturaSeleccionada = e.option.value;
    this.formInventario.patchValue({
      razon : `REGISTRO DE PRODUCTOS PARA LA FACTURA ${this.facturaSeleccionada.codigo} DEL PROVEEDOR ${this.facturaSeleccionada.proveedor}`
    })
  }
  
  agregarDetalle() {
    if(this.repuestoSeleccionado) {
      let cont = 0;
      for(let inventarioDetalleAux of this.inventarioDetalle) {
        if(inventarioDetalleAux.repuesto.idRepuesto === this.repuestoSeleccionado.idRepuesto) {
          inventarioDetalleAux.cantidad += this.form.value['cantidad']
          cont++;
          break;
        }
      }

      if(cont > 0) {
        
      } else {
        let inventarioDetalle = new InventarioDetalle();
        inventarioDetalle.cantidad = this.form.value['cantidad'];
        inventarioDetalle.repuesto = this.repuestoSeleccionado;
        this.inventarioDetalle.push(inventarioDetalle);
      }
      this.dataSourceInventarioDetalle = new MatTableDataSource(this.inventarioDetalle);
      this.limpiarControlDetalle();
    } else {
      let mensaje = 'Seleccione un repuesto valido'
      this.snackBar.open(mensaje, "AVISO", { duration : 2000});
    }
    this.verificarInventarioCompleto();
  }

  removerDetalle(index : number) {
    this.inventarioDetalle.splice(index, 1);
    this.dataSourceInventarioDetalle = new MatTableDataSource(this.inventarioDetalle)
    this.verificarInventarioCompleto();
  }

  verificarInventarioCompleto() {
    if(this.inventarioDetalle.length > 0) {
      this.inventarioCompleto = true;
    } else {
      this.inventarioCompleto = false;
    }
  }

  limpiarControlDetalle() {
    this.repuestoSeleccionado = null;
    this.myControlRepuesto.reset();
    this.form.reset();
  }

  limpiarControlDetalleGeneral() {
    this.facturaSeleccionada = null;
    this.myControlFactura.reset();
    this.limpiarControlDetalle()
  }

  limpiarControlGeneral() {
    this.limpiarControlDetalleGeneral();
    this.formInventario.reset();
    this.inventarioDetalle = [];
    this.dataSourceInventarioDetalle = new MatTableDataSource()
    this.inventarioCompleto = false;
    this.idConcepto = 0;
    this.conceptoControl = false;
    this.facturas = []
    this.facturaCompraService.getAllNotInInventarios().subscribe(data => {
      this.facturas = data;
    })
    this.facturasFiltradas$ = this.myControlFactura.valueChanges.pipe(map(val => this.filtrarFacturas(val)));
  }

  guardarInventario() {
    if(this.idConcepto > 0) {
      let inventario = new Inventario();
      inventario.usuario = this.usuarioLogueado;
      inventario.concepto = new Concepto();
      inventario.razon = this.formInventario.value['razon'];
      inventario.concepto.idConcepto = this.idConcepto;
      inventario.inventarioDetalle = this.inventarioDetalle;
      inventario.sucursal = new Sucursal();
      inventario.sucursal.idSucursal = this.idSucursal;
      if(this.facturaSeleccionada!=null && this.facturaSeleccionada.idFacturaCompra>0) {
        inventario.facturaCompra = new FacturaCompra()
        inventario.facturaCompra.idFacturaCompra = this.facturaSeleccionada.idFacturaCompra
      }

      if(this.idInventario>0) {
        inventario.idInventario = this.idInventario;
        if(this.loginService.tienePermiso(this.idVentana, TablaUtil.INVENTARIOS, PermisoUtil.EDITAR)) {
          this.spinner.show()
          this.inventarioService.update(inventario).subscribe( () => {
            let mensaje = 'Inventario Actualizado'
            this.snackBar.open(mensaje, "AVISO", { duration : 2000});
            this.limpiarControlGeneral();
            this.spinner.hide()
          });  
        } else {
          this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
        }
      } else {
        if(this.loginService.tienePermiso(this.idVentana, TablaUtil.INVENTARIOS, PermisoUtil.CREAR)) {
          this.spinner.show()
          this.inventarioService.create(inventario).subscribe( () => {
            let mensaje = 'Inventario Creado'
            this.snackBar.open(mensaje, "AVISO", { duration : 2000});
            this.limpiarControlGeneral();
            this.spinner.hide()
          });
        } else {
          this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
        }
      }
    } else {
      let mensaje = 'Identifique si es SALIDA o ENTRADA'
      this.snackBar.open(mensaje, "AVISO", { duration : 2000});
    }
  }

  evaluarBotonGuardar() {
    if(!this.inventarioCompleto || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }
}
