import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { FacturaCompraMenor } from './../../../_model/facturaCompraMenor';
import { FacturaCompraMenorService } from './../../../_service/factura-compra-menor.service';
import { ReporteService } from './../../../_service/reporte.service';
import { Saldo } from './../../../_model/saldo';
import { SaldoService } from './../../../_service/saldo.service';
import { ComprobanteTipoService } from './../../../_service/comprobante-tipo.service';
import { PersonalService } from './../../../_service/personal.service';
import { CajaChicaDialogoEditarComponent } from './caja-chica-dialogo-editar/caja-chica-dialogo-editar.component';
import { CajaChicaDialogoEliminarComponent } from './caja-chica-dialogo-eliminar/caja-chica-dialogo-eliminar.component';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { CajaChica } from './../../../_model/cajaChica';
import { ServicioService } from './../../../_service/servicio.service';
import { Servicio } from './../../../_model/servicio';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CajaChicaService } from './../../../_service/caja-chica.service';
import { PlacaService } from './../../../_service/placa.service';
import { Placa } from './../../../_model/placa';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Concepto } from 'src/app/_model/concepto';
import { Personal } from 'src/app/_model/personal';
import { ComprobanteTipo } from 'src/app/_model/comprobanteTipo';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-caja-chica',
  templateUrl: './caja-chica.component.html',
  styleUrls: ['./caja-chica.component.css']
})
export class CajaChicaComponent implements OnInit {

  formCajaChica : FormGroup;
  formBusqueda : FormGroup;

  facturasCompraMenor$ : Observable<FacturaCompraMenor[]>;
  facturaCompraMenorSelected : FacturaCompraMenor;

  idPlacaAll : number = 0;
  placasAll$ : Observable<Placa[]>;

  idServicio : number = 0;
  servicios$ : Observable<Servicio[]>;

  idConceptoC : number = 0;
  idConceptoB : number = 0;

  personal$ : Observable<Personal[]>;
  idAutoriza : number = 0;
  idRecibe : number = 0;

  comprobanteTipos$ : Observable<ComprobanteTipo[]>;
  idComprobanteTipoC : number = 0;
  idComprobanteTipoB : number = 0;

  saldoCajaChica : Saldo = new Saldo();

  idBusqueda : number = 0;

  maxFecha : Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;
  formatoFecha : string = 'YYYY-MM-DD';

  myControlFechaFin : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);
  myControlPlaca : FormControl = new FormControl('', Validators.required);
  myControlServicio : FormControl = new FormControl('', Validators.required);
  myControlComprobanteTipo : FormControl = new FormControl('', Validators.required);

  dataSource : MatTableDataSource<CajaChica>;
  displayedColumns = ['fechaIngreso','concepto', 'monto', 'autoriza', 'recibe', 'descripcion', 'comprobanteTipo', 'acciones'];

  idVentana : number = VentanaUtil.FINANZAS;
  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';

  constructor(
    private placaService : PlacaService,
    private servicioService : ServicioService,
    private cajaChicaService : CajaChicaService,
    private personalService : PersonalService,
    private comprobanteTipoService : ComprobanteTipoService,
    private facturaCompraMenorService : FacturaCompraMenorService,
    private saldoService : SaldoService,
    private reporteService : ReporteService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.facturaCompraMenorSelected = new FacturaCompraMenor();

    this.saldoCajaChica.monto = 0;
    
    this.actualizarSaldo();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CONSULTAR)) {
      this.placasAll$ = this.placaService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SERVICIOS, PermisoUtil.CONSULTAR)) {
      this.servicios$ = this.servicioService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PERSONAL, PermisoUtil.CONSULTAR)) {
      this.personal$ = this.personalService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.COMPROBANTE_TIPOS, PermisoUtil.CONSULTAR)) {
      this.comprobanteTipos$ = this.comprobanteTipoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.CONSULTAR)) {
      this.facturasCompraMenor$ = this.facturaCompraMenorService.getNotInCajaChica();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CAJAS_CHICAS, PermisoUtil.CONSULTAR)) {
      this.cajaChicaService.getByFechaIngreso(moment(this.maxFecha).format(this.formatoFecha), 
      moment(this.maxFecha).format(this.formatoFecha)).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });

      this.cajaChicaService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
    }
    
    this.initFormCajaChica();

    this.initFormBusqueda();

    this.cajaChicaService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

  }

  actualizarSaldo() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SALDOS, PermisoUtil.CONSULTAR)) {
      this.saldoService.getByNombre("Caja Chica").subscribe(data => {
        this.saldoCajaChica = data;
      });
    }
  }

  initFormCajaChica() {
    this.formCajaChica = new FormGroup({
      'concepto' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required),
      'autoriza' : new FormControl('', Validators.required),
      'recibe' : new FormControl('', Validators.required),
      'descripcion' : new FormControl('', Validators.required),
      'comprobanteTipo' : new FormControl('', Validators.required),
      'facturaCompra' : new FormControl('', Validators.required),
      'numeroComprobante' : new FormControl(''),
    });

    this.formCajaChica.get('facturaCompra').disable();
    this.formCajaChica.get('numeroComprobante').disable();
    this.formCajaChica.get('descripcion').disable();
    this.formCajaChica.get('monto').disable();
  }

  initFormBusqueda() {
    this.formBusqueda = new FormGroup({
      'comprobanteTipo' : this.myControlComprobanteTipo,
      'servicio' : this.myControlServicio,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin
    });

    this.formBusqueda.get('comprobanteTipo').disable();
    this.formBusqueda.get('servicio').disable();
    this.formBusqueda.get('fechaInicio').disable();
    this.formBusqueda.get('fechaFin').disable();
  }

  limpiarFormCajaChica() {
    this.formCajaChica.reset();
    this.formCajaChica.get('facturaCompra').disable();
    this.formCajaChica.get('numeroComprobante').disable();
    this.formCajaChica.get('descripcion').disable();
    this.formCajaChica.get('monto').disable();
    this.facturaCompraMenorSelected = new FacturaCompraMenor();
    this.idConceptoC = 0;
    this.idAutoriza = 0;
    this.idRecibe = 0;
    this.idComprobanteTipoC = 0;
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.FACTURAS_COMPRAS_MENORES, PermisoUtil.CONSULTAR)) {
      this.facturasCompraMenor$ = this.facturaCompraMenorService.getNotInCajaChica();
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

  guardarCajaChica() {
    this.spinner.show();
    if(this.facturaCompraMenorSelected.idFacturaCompraMenor == null) {
      let cajaChica = new CajaChica();
      cajaChica.concepto = new Concepto();
      cajaChica.concepto.idConcepto = this.idConceptoC;
      cajaChica.autoriza = new Personal();
      cajaChica.autoriza.idPersonal = this.idAutoriza;
      cajaChica.recibe = new Personal();
      cajaChica.recibe.idPersonal = this.idRecibe;
      cajaChica.comprobanteTipo = new ComprobanteTipo();
      cajaChica.comprobanteTipo.idComprobanteTipo = this.idComprobanteTipoC;
      cajaChica.numeroComprobante = this.formCajaChica.value['numeroComprobante'];
      cajaChica.descripcion = this.formCajaChica.value['descripcion'];
      cajaChica.monto = this.formCajaChica.value['monto'];
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CAJAS_CHICAS, PermisoUtil.CREAR)) {
        this.cajaChicaService.create(cajaChica).pipe(switchMap(() => {
          return this.cajaChicaService.getByFechaIngreso(moment(this.maxFecha).format(this.formatoFecha), 
          moment(this.maxFecha).format(this.formatoFecha));
        })).subscribe(data => {
          this.cajaChicaService.setObjetoCambio(data);
          this.cajaChicaService.setMensajeCambio('Caja chica creada');
          this.limpiarFormCajaChica();
          this.actualizarSaldo();
          this.spinner.hide();
        });
      } else {
        this.spinner.hide();
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      let cajaChica = new CajaChica();
      cajaChica.concepto = new Concepto();
      cajaChica.concepto.idConcepto = this.idConceptoC;
      cajaChica.autoriza = new Personal();
      cajaChica.autoriza.idPersonal = this.idAutoriza;
      cajaChica.recibe = new Personal();
      cajaChica.recibe.idPersonal = this.idRecibe;
      cajaChica.comprobanteTipo = new ComprobanteTipo();
      cajaChica.comprobanteTipo.idComprobanteTipo = this.idComprobanteTipoC;
      cajaChica.numeroComprobante = this.facturaCompraMenorSelected.codigo;
      if(this.facturaCompraMenorSelected.servicio==null) {
        cajaChica.descripcion = `PAGO DE FACTURA DE COMPRA ${this.facturaCompraMenorSelected.codigo} DEL PROVEEDOR ${this.facturaCompraMenorSelected.proveedorMenor.nombre}`;
      } else {
        cajaChica.descripcion = `PAGO DE FACTURA DE COMPRA ${this.facturaCompraMenorSelected.codigo} DEL PROVEEDOR ${this.facturaCompraMenorSelected.proveedorMenor.nombre} PARA EL SERVICIO ${this.facturaCompraMenorSelected.servicio.idServicio}`;
      }
      
      cajaChica.monto = this.facturaCompraMenorSelected.total;
      cajaChica.facturaCompraMenor = this.facturaCompraMenorSelected;
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CAJAS_CHICAS, PermisoUtil.CREAR)) {
        this.cajaChicaService.create(cajaChica).pipe(switchMap(() => {
          return this.cajaChicaService.getByFechaIngreso(moment(this.maxFecha).format(this.formatoFecha), 
          moment(this.maxFecha).format(this.formatoFecha));
        })).subscribe(data => {
          this.cajaChicaService.setObjetoCambio(data);
          this.cajaChicaService.setMensajeCambio('Caja chica creada');
          this.limpiarFormCajaChica();
          this.actualizarSaldo();
          this.spinner.hide();
        });
      } else {
        this.spinner.hide();
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
  }

  buscarCajaChica() {
    this.spinner.show();
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CAJAS_CHICAS, PermisoUtil.CONSULTAR)) {
      if(this.idBusqueda == 0 || this.idBusqueda == 5) {
        this.cajaChicaService.getAll().subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.spinner.hide();
        });
      } else if(this.idBusqueda == 1) {
        this.cajaChicaService.getByComprobanteTipo(this.idComprobanteTipoB).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.spinner.hide();
        });
      } else if(this.idBusqueda == 2) {
        this.cajaChicaService.getByServicio(this.idServicio).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.spinner.hide();
        });
      } else if(this.idBusqueda == 4) {
        this.cajaChicaService.getByFechaIngreso(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.spinner.hide();
        });
      }
    } else {
        this.spinner.hide();
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  setInputs() {
    if(this.idBusqueda == 1) {
      this.setComprobanteTipoInput(true);
      this.setServicioInput(false);
      this.setFechaInput(false);
    } else if(this.idBusqueda == 2) {
      this.setComprobanteTipoInput(false);
      this.setServicioInput(true);
      this.setFechaInput(false);
    } else if(this.idBusqueda == 4) {
      this.setComprobanteTipoInput(false);
      this.setServicioInput(false);
      this.setFechaInput(true);
    } else if(this.idBusqueda == 5) {
      this.setComprobanteTipoInput(false);
      this.setServicioInput(false);
      this.setFechaInput(false);
    }
  }

  setComprobanteTipoInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.myControlComprobanteTipo.reset();
    if(e) {
      this.formBusqueda.get('comprobanteTipo').enable();
    } else {
      this.formBusqueda.get('comprobanteTipo').disable();
    }
  }

  setServicioInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
    this.myControlServicio.reset();
    if(e) {
      this.formBusqueda.get('servicio').enable();
    } else {
      this.formBusqueda.get('servicio').disable();
    }
  }

  setFechaInput(e : boolean) {
    this.dataSource = new MatTableDataSource();
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
  
  abrirDialogoEditar(cajaChica : CajaChica) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CAJAS_CHICAS, PermisoUtil.EDITAR)) {
      let dialogRef = this.dialog.open(CajaChicaDialogoEditarComponent, {
        width: '450px',
        data: cajaChica
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.actualizarSaldo();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  abrirDialogoEliminar(cajaChica : CajaChica) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CAJAS_CHICAS, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(CajaChicaDialogoEliminarComponent, {
        width: '400px',
        data: cajaChica
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.actualizarSaldo();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  evaluarProveedorSelect() {
    this.facturaCompraMenorSelected = new FacturaCompraMenor();
    this.formCajaChica.patchValue({
      numeroComprobante : '',
        descripcion : '',
        monto : ''
    });
    this.formCajaChica.get('facturaCompra').disable();
    this.formCajaChica.get('numeroComprobante').disable();
    this.formCajaChica.get('descripcion').disable();
    this.formCajaChica.get('monto').disable();
    if(this.idComprobanteTipoC==1) {
      this.formCajaChica.get('facturaCompra').enable();
    } else if(this.idComprobanteTipoC==2) {
      this.formCajaChica.get('numeroComprobante').enable();
      this.formCajaChica.get('descripcion').enable();
      this.formCajaChica.get('monto').enable();
    } else if(this.idComprobanteTipoC==3) {
      this.formCajaChica.get('descripcion').enable();
      this.formCajaChica.get('monto').enable();
    }
  }

  evaluarFacturaCompraSelect() {
    if(this.facturaCompraMenorSelected.servicio!=null) {
      this.formCajaChica.patchValue({
        numeroComprobante : this.facturaCompraMenorSelected.codigo,
        descripcion : `PAGO DE FACTURA DE COMPRA PARA EL SERVICIO ${this.facturaCompraMenorSelected.servicio.idServicio}`,
        monto : this.facturaCompraMenorSelected.total
      });
    } else {
        this.formCajaChica.patchValue({
          numeroComprobante : this.facturaCompraMenorSelected.codigo,
          descripcion : `PAGO DE FACTURA DE COMPRA ${this.facturaCompraMenorSelected.codigo} del proveedor ${this.facturaCompraMenorSelected.proveedorMenor.nombre}`,
          monto : this.facturaCompraMenorSelected.total
        });
    }
  }

  verBotonReporte() {
    if(this.dataSource!=null && this.dataSource.data.length>0 && !this.loaderService.isLoading.value) {
      return false;
    }
    return true;
  }

  crearReporteCajaChica() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPORTES, PermisoUtil.CONSULTAR)) {
      if(this.idBusqueda==4) {
        this.spinner.show();
        this.reporteService.crearReporteCajaChica(parseInt(sessionStorage.getItem('idUsuario')), this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = `CajaChicaResumen_${this.fechaInicioFormato}_${this.fechaFinFormato}.pdf`;
          a.click();
          this.spinner.hide();
        });
      }
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  evaluarBotonGuardarCajaChica() {
    if(this.formCajaChica.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

  evaluarBotonBuscarCajaChica() {
    if(this.formBusqueda.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

}
