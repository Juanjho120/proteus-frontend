import { Sucursal } from './../../../_model/sucursal';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { ReporteService } from './../../../_service/reporte.service';
import { NotaCreditoAdjuntoDialogoComponent } from './nota-credito-adjunto-dialogo/nota-credito-adjunto-dialogo.component';
import { NotaCreditoService } from './../../../_service/nota-credito.service';
import { NotaCredito } from './../../../_model/notaCredito';
import { NotaCreditoDialogoComponent } from './nota-credito-dialogo/nota-credito-dialogo.component';
import { CreditoProveedorDetalleEdicionComponent } from './credito-proveedor-detalle-edicion/credito-proveedor-detalle-edicion.component';
import { PagoProveedorDetalleDialogoComponent } from './pago-proveedor-detalle-dialogo/pago-proveedor-detalle-dialogo.component';
import { TransaccionService } from './../../../_service/transaccion.service';
import { ChequeService } from './../../../_service/cheque.service';
import { PagoProveedorDTO } from './../../../_model/dto/pagoProveedorDTO';
import { PagoProveedorDialogoEliminarComponent } from './pago-proveedor-dialogo-eliminar/pago-proveedor-dialogo-eliminar.component';
import { PagoProveedorDialogoComponent } from './pago-proveedor-dialogo/pago-proveedor-dialogo.component';
import { PagoProveedorService } from './../../../_service/pago-proveedor.service';
import { CreditoProveedorService } from './../../../_service/credito-proveedor.service';
import { CreditoProveedorDetalle } from './../../../_model/creditoProveedorDetalle';
import { CreditoProveedor } from './../../../_model/creditoProveedor';
import { ProveedorService } from './../../../_service/proveedor.service';
import { Proveedor } from './../../../_model/proveedor';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreditoProveedorDetalleService } from './../../../_service/credito-proveedor-detalle.service';
import { CreditoProveedorDetalleDialogoComponent } from './credito-proveedor-detalle-dialogo/credito-proveedor-detalle-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaCompraService } from './../../../_service/factura-compra.service';
import { FacturaCompra } from './../../../_model/facturaCompra';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SucursalService } from 'src/app/_service/sucursal.service';

@Component({
  selector: 'app-finanzas-credito-pago',
  templateUrl: './finanzas-credito-pago.component.html',
  styleUrls: ['./finanzas-credito-pago.component.css']
})
export class FinanzasCreditoPagoComponent implements OnInit {

  facturasCompra : FacturaCompra[] = [];
  creditoProveedorTotal : number = 0;

  dataSourceFactura : MatTableDataSource<FacturaCompra>;
  displayedColumnsFactura = ['codigo', 'fecha', 'proveedor', 'total', 'asignar'];

  dataSourceCreditoDetalle : MatTableDataSource<CreditoProveedorDetalle>;
  displayedColumnsCreditoDetalle = ['codigo', 'fechaFactura', 'observaciones', 'total', 'acumulativo', 'estado', 'notas', 'accionesCD'];

  dataSourcePagoProveedor : MatTableDataSource<PagoProveedorDTO>;
  displayedColumnsPagoProveedor = ['tipoDocumento', 'noDocumento', 'fechaPago', 'observaciones', 'monto', 'acciones'];

  formBusqueda : FormGroup;
  proveedores$ : Observable<Proveedor[]>;
  idProveedor : number = 0;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  creditoProveedor : CreditoProveedor;
  creditoProveedorDetalles : CreditoProveedorDetalle[] = [];
  pagoProveedores : PagoProveedorDTO[] = [];

  formatoFechaHora : string = 'YYYY-MM-DD';

  notaCredito : NotaCredito;

  idVentana : number = VentanaUtil.FINANZAS;

  constructor(
    private facturaCompraService : FacturaCompraService,
    private sucursalService : SucursalService,
    private proveedorService : ProveedorService,
    private creditoProveedorService : CreditoProveedorService,
    private creditoProveedorDetalleService : CreditoProveedorDetalleService,
    private chequeService : ChequeService,
    private transaccionService : TransaccionService,
    private pagoProveedorService : PagoProveedorService,
    private notaCreditoService : NotaCreditoService,
    private reporteService : ReporteService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.sucursales$ = this.sucursalService.getAll();

    this.creditoProveedor = new CreditoProveedor();
    this.creditoProveedor.proveedor = new Proveedor();
    this.creditoProveedor.deudaAcumulativa = 0;
    this.creditoProveedor.proveedor = new Proveedor();
    this.creditoProveedorDetalles = [];
    this.pagoProveedores = [];

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS, PermisoUtil.CONSULTAR)) {
      this.facturaCompraService.getNotInCreditoProveedorDetalle().subscribe(data => {
        this.facturasCompra = data;
        this.filtrarFacturasPorSucursal();
        this.spinner.hide();
      });
    }

    this.facturaCompraService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.creditoProveedorService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.pagoProveedorService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.creditoProveedorDetalleService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.creditoProveedorDetalleService.checkVencimiento().subscribe(() => {

    });

    this.formBusqueda = new FormGroup({
      'proveedor' : new FormControl('', Validators.required)
    });

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.CONSULTAR)) {
      this.proveedores$ = this.proveedorService.getWithCredito();
    }
    
    this.creditoProveedor = new CreditoProveedor();
    this.creditoProveedor.proveedor = new Proveedor();
    this.creditoProveedor.proveedor.nombre = "NOMBRE PROVEEDOR";
    this.creditoProveedor.proveedor.nit = "NIT PROVEEDOR";
    this.creditoProveedor.deudaAcumulativa = 0;

    this.notaCredito = new NotaCredito();
  }

  filtrarPorSucursal() {
    this.filtrarFacturasPorSucursal();
    this.filtrarCreditoDetallePorSucursal();
    this.filtrarPagosPorSucursal();
  }

  filtrarFacturasPorSucursal() {
    this.dataSourceFactura = new MatTableDataSource(this.facturasCompra.filter((factura) => this.idSucursal > 0 ? factura.sucursal.idSucursal == this.idSucursal : factura));
  }

  filtrarCreditoDetallePorSucursal() {
    this.creditoProveedorTotal = 0;
    let creditoProveedorDetallesAux = this.creditoProveedorDetalles
                                        .filter((creditoDetalle) => 
                                          this.idSucursal > 0 ? 
                                            creditoDetalle.facturaCompra.sucursal.idSucursal == this.idSucursal 
                                            : creditoDetalle)
                                        .map((creditoDetalle) => ({
                                          ...creditoDetalle,
                                          acumulativo: this.creditoProveedorTotal += creditoDetalle.totalRestante
                                        }));
    this.dataSourceCreditoDetalle = new MatTableDataSource(creditoProveedorDetallesAux);
  }

  filtrarPagosPorSucursal() {
    this.dataSourcePagoProveedor = new MatTableDataSource(this.pagoProveedores.filter((pago) => this.idSucursal > 0 ? pago.idSucursal == this.idSucursal : pago))
  }

  asignarFactura(facturaCompra : FacturaCompra) {
    let dialogRef = this.dialog.open(CreditoProveedorDetalleDialogoComponent, {
      width: '400px',
      data: facturaCompra
    });

    dialogRef.afterClosed().subscribe(() => {
      this.facturasCompra = [];
      this.dataSourceFactura = new MatTableDataSource();
      this.facturaCompraService.getNotInCreditoProveedorDetalle().subscribe(data => {
        this.facturasCompra = data;
        this.filtrarFacturasPorSucursal();
        this.proveedores$ = this.proveedorService.getWithCredito();
        this.buscarCreditoProveedor();
      });
    });
  }

  buscarCreditoProveedor() {
    this.creditoProveedorDetalleService.checkVencimiento();
    this.dataSourceCreditoDetalle = new MatTableDataSource();
    this.dataSourcePagoProveedor = new MatTableDataSource();
    this.creditoProveedor = new CreditoProveedor();
    this.creditoProveedor.proveedor = new Proveedor();
    this.creditoProveedor.deudaAcumulativa = 0;

    if(this.idProveedor == 0) {
      this.creditoProveedor = new CreditoProveedor();
      this.creditoProveedor.deudaAcumulativa = 0;
      this.creditoProveedor.proveedor = new Proveedor();
      this.creditoProveedorDetalles = [];
      this.pagoProveedores = [];
      return;
    } else {
      this.spinner.show();
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CREDITO_PROVEEDORES, PermisoUtil.CONSULTAR)) {
        this.creditoProveedorService.getByProveedor(this.idProveedor).subscribe(data => {
          this.creditoProveedor = data;
    
          document.getElementById("div-credito-proveedor").style.display = "block";
          this.creditoProveedorDetalleService.getByCreditoProveedorAndPagada(this.creditoProveedor.idCreditoProveedor, false).subscribe(dato => {
            this.creditoProveedorDetalles = dato;
            let acumulativo = 0;
            for(let creditoProveedorDetalle of this.creditoProveedorDetalles) {
              acumulativo += creditoProveedorDetalle.totalRestante;
              creditoProveedorDetalle.acumulativo = acumulativo;
              if(creditoProveedorDetalle.vencida) {
                creditoProveedorDetalle.icon = "report_problem";
              } else {
                creditoProveedorDetalle.icon = "watch_later";
              }
              if(creditoProveedorDetalle.pagada) {
                creditoProveedorDetalle.icon = "attach_money";
              }
            }
            this.filtrarCreditoDetallePorSucursal();
            this.spinner.hide();
          });
  
          this.pagoProveedorService.getByCreditoProveedor(this.creditoProveedor.idCreditoProveedor).subscribe(data => {
            this.pagoProveedores = [];
            if(data!=null) {
              for(let pagoProveedor of data) {
                let pagoProveedorDto = new PagoProveedorDTO();
                pagoProveedorDto.idPagoProveedor = pagoProveedor.idPagoProveedor;
                pagoProveedorDto.tipoDocumento = pagoProveedor.pagoTipo.nombre;
                pagoProveedorDto.monto = pagoProveedor.monto;
                pagoProveedorDto.fechaPago = moment(pagoProveedor.fechaHoraPago).format(this.formatoFechaHora);
                pagoProveedorDto.observaciones = pagoProveedor.observaciones;
                pagoProveedorDto.idSucursal = pagoProveedor.sucursal.idSucursal;
    
                if(pagoProveedor.pagoTipo.nombre === "CHEQUE") {
                  this.chequeService.getById(pagoProveedor.idItem).subscribe(dataCheque => {
                    pagoProveedorDto.noDocumento = dataCheque.numero;
                  });
                } else if(pagoProveedor.pagoTipo.nombre === "TRANSACCION") {
                  this.transaccionService.getById(pagoProveedor.idItem).subscribe(dataTransaccion => {
                    pagoProveedorDto.noDocumento = dataTransaccion.referencia;
                  });
                } else {
                  pagoProveedorDto.noDocumento = "";
                }
                this.pagoProveedores.push(pagoProveedorDto);
              }
              this.filtrarPagosPorSucursal();
            }
          });
        });
      } else {
        this.spinner.hide();
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
  }

  abrirDialogoPagoProveedor() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PAGOS_PROVEEDORES, PermisoUtil.CREAR)) {
      let dialogRef = this.dialog.open(PagoProveedorDialogoComponent, {
        width: '600px',
        data: { creditoProveedor: this.creditoProveedor, idSucursal: this.idSucursal }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.buscarCreditoProveedor();
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoPagoProveedorEliminar(pagoProveedorDto : PagoProveedorDTO) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PAGOS_PROVEEDORES, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(PagoProveedorDialogoEliminarComponent, {
        width: '450px',
        data: pagoProveedorDto
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.buscarCreditoProveedor();
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoPagoProveedorDetalle(idPagoProveedor : number) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PAGO_PROVEEDOR_DETALLES, PermisoUtil.CONSULTAR)) {
      this.dialog.open(PagoProveedorDetalleDialogoComponent, {
        width: '1000px',
        data: idPagoProveedor
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirCreditoProveedorDetalleEdicion(creditoProveedorDetalle : CreditoProveedorDetalle) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PAGO_PROVEEDOR_DETALLES, PermisoUtil.EDITAR)) {
      this.dialog.open(CreditoProveedorDetalleEdicionComponent, {
        width: '400px',
        data: creditoProveedorDetalle
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirNotaCreditoDialogo(creditoProveedorDetalle : CreditoProveedorDetalle) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.NOTAS_CREDITO, PermisoUtil.CREAR)) {
      this.notaCreditoService.getByFacturaCompra(creditoProveedorDetalle.facturaCompra.idFacturaCompra).subscribe(dataN => {
        if(dataN==null) {
          let dialogRef = this.dialog.open(NotaCreditoDialogoComponent, {
            width: '350px',
            data: creditoProveedorDetalle
          });
      
          dialogRef.afterClosed().subscribe(() => {
            this.buscarCreditoProveedor();
          });
        } else {
          this.snackBar.open('Esta factura ya posee una nota de credito', 'AVISO', {duration : 2000});
        }
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirNotaCreditoAdjuntoDialogo(creditoProveedorDetalle : CreditoProveedorDetalle) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.NOTAS_CREDITO, PermisoUtil.CONSULTAR)) {
      this.notaCreditoService.getByFacturaCompra(creditoProveedorDetalle.facturaCompra.idFacturaCompra).subscribe(dataN => {
        if(dataN!=null) {
          this.dialog.open(NotaCreditoAdjuntoDialogoComponent, {
            width: '350px',
            data: dataN
          });
        }
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  verBotonReporteCredito() {
    if(this.creditoProveedorDetalles.length>0 && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  verBotonReportePago() {
    if(this.pagoProveedores.length>0 && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  crearReporteCreditoProveedorPorProveedorSinPagar(proveedor : Proveedor) {
    this.spinner.show();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.reporteService.crearReporteCreditoProveedorDetallePorProveedorSinPagar(proveedor.idProveedor, this.idSucursal, parseInt(sessionStorage.getItem('idUsuario'))).subscribe(data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        document.body.appendChild(a);
        a.href = url;
        a.download = `Creditos ${proveedor.nombre}.pdf`;
        a.click();
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  crearReportePagoProveedorDetalle(creditoProveedor : CreditoProveedor) {
    this.spinner.show();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      this.reporteService.crearReportePagoProveedor(creditoProveedor.idCreditoProveedor, this.idSucursal, parseInt(sessionStorage.getItem('idUsuario'))).subscribe(data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        document.body.appendChild(a);
        a.href = url;
        a.download = `Pagos ${creditoProveedor.proveedor.nombre}.pdf`;
        a.click();
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
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
