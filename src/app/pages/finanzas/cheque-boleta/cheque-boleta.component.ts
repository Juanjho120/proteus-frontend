import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { BoletaDialogoEliminarComponent } from './boleta-dialogo-eliminar/boleta-dialogo-eliminar.component';
import { BoletaTipoDocumento } from './../../../_model/boletaTipoDocumento';
import { BoletaTipoDocumentoService } from './../../../_service/boleta-tipo-documento.service';
import { ChequeDialogoEliminarComponent } from './cheque-dialogo-eliminar/cheque-dialogo-eliminar.component';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Boleta } from './../../../_model/boleta';
import { BoletaService } from './../../../_service/boleta.service';
import { ChequeService } from './../../../_service/cheque.service';
import { CuentaBancariaService } from './../../../_service/cuenta-bancaria.service';
import { BancoService } from './../../../_service/banco.service';
import { Cheque } from './../../../_model/cheque';
import { MatTableDataSource } from '@angular/material/table';
import { CuentaBancaria } from './../../../_model/cuentaBancaria';
import { Observable } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Banco } from 'src/app/_model/banco';
import * as moment from 'moment';

@Component({
  selector: 'app-cheque-boleta',
  templateUrl: './cheque-boleta.component.html',
  styleUrls: ['./cheque-boleta.component.css']
})
export class ChequeBoletaComponent implements OnInit {

  idBusquedaCheque : number = 0;
  idBusquedaBoleta : number = 0;

  myControlBancoCheque : FormControl = new FormControl('', Validators.required);
  myControlNombreNumero : FormControl = new FormControl('', Validators.required);
  myControlCuentaBancariaCheque : FormControl = new FormControl('', Validators.required);
  myControlFechaInicioCheque : FormControl = new FormControl('', Validators.required);
  myControlFechaFinCheque : FormControl = new FormControl('', Validators.required);
  myControlBoleta : FormControl = new FormControl('', Validators.required);

  myControlBancoBoleta : FormControl = new FormControl('', Validators.required);
  myControlCuentaBancariaBoleta : FormControl = new FormControl('', Validators.required);
  myControlFechaInicioBoleta : FormControl = new FormControl('', Validators.required);
  myControlFechaFinBoleta : FormControl = new FormControl('', Validators.required);
  myControlDocumentoTipo : FormControl = new FormControl('', Validators.required);
  myControlNumeroBoleta : FormControl = new FormControl('', Validators.required);

  formBusquedaCheque : FormGroup;
  formBusquedaBoleta : FormGroup;
  formIngresoCheque : FormGroup;
  formIngresoBoleta : FormGroup;

  bancos$ : Observable<Banco[]>;
  idBancoBCheque : number = 0;
  idBancoBBoleta : number = 0;

  cuentasBancarias$ : Observable<CuentaBancaria[]>;
  idCuentaBancariaBCheque : number = 0;
  idCuentaBancariaCCheque : number = 0;
  idCuentaBancariaBBoleta : number = 0;
  idCuentaBancariaCBoleta : number = 0;

  maxFecha : Date = new Date();
  fechaInicioChequeSeleccionada: Date = new Date();
  fechaFinChequeSeleccionada: Date = new Date();
  fechaInicioBoletaSeleccionada: Date = new Date();
  fechaFinBoletaSeleccionada: Date = new Date();
  fechaEmisionSeleccionada: Date = new Date();
  fechaDepositoSeleccionada: Date = new Date();
  fechaSeleccionada: Date = new Date();
  fechaInicioChequeFormato : string;
  fechaFinChequeFormato : string;
  fechaInicioBoletaFormato : string;
  fechaFinBoletaFormato : string;
  fechaEmisionFormato : string;
  fechaDepositoFormato : string;
  fechaFormato : string;
  formatoFecha : string = 'YYYY-MM-DD';

  idBoletaB : number = 0;
  chequesNotInBoletas$ : Observable<Cheque[]>;
  idChequeNotInBoleta : number = 0;
  cheque : Cheque = new Cheque();
  boleta : Boleta = new Boleta();

  boletaTipoDocumentos$ : Observable<BoletaTipoDocumento[]>;
  idBoletaTipoDocumentoB : number = 0;
  idBoletaTipoDocumentoC : number = 0;

  dataSourceCheque : MatTableDataSource<Cheque>;
  dataSourceBoleta : MatTableDataSource<Boleta>;
  
  displayedColumnsCheque = ['banco','noCuenta', 'noCheque', 'fechaEmision', 'fechaDeposito', 'monto'];
  displayedColumnsBoleta = ['banco','noCuenta', 'noBoleta', 'documentoTipo', 'fecha', 'monto'];

  idVentana : number = VentanaUtil.FINANZAS;

  constructor(
    private bancoService : BancoService,
    private cuentaBancariaService : CuentaBancariaService,
    private chequeService : ChequeService,
    private boletaService : BoletaService,
    private boletaTipoDocumentoService : BoletaTipoDocumentoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.initFormBusquedaCheque();

    this.initFormBusquedaBoleta();

    this.initFormIngresoCheque();

    this.initFormIngresoBoleta();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BANCOS, PermisoUtil.CONSULTAR)) {
      this.bancos$ = this.bancoService.getAll();
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CUENTAS_BANCARIAS, PermisoUtil.CONSULTAR)) {
      this.cuentasBancarias$ = this.cuentaBancariaService.getAll();
    }
    
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BOLETA_TIPOS_DOCUMENTOS, PermisoUtil.CONSULTAR)) {
      this.boletaTipoDocumentos$ = this.boletaTipoDocumentoService.getAll();
    }
    
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHEQUES, PermisoUtil.CONSULTAR)) {
      this.chequesNotInBoletas$ = this.chequeService.getNotInBoletas();

      this.chequeService.getAll().subscribe(data => {
        this.dataSourceCheque = new MatTableDataSource(data);
      });

      this.chequeService.getObjetoCambio().subscribe(data => {
        this.dataSourceCheque = new MatTableDataSource(data);
      });
    }
    
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BOLETAS, PermisoUtil.CONSULTAR)) {
      this.boletaService.getAll().subscribe(data => {
        this.dataSourceBoleta = new MatTableDataSource(data);
      });

      this.boletaService.getObjetoCambio().subscribe(data => {
        this.dataSourceBoleta = new MatTableDataSource(data);
      });
    }

    this.chequeService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.boletaService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

  }

  initFormBusquedaCheque() {
    this.formBusquedaCheque = new FormGroup({
      'banco' : this.myControlBancoCheque,
      'nombreNumero' : this.myControlNombreNumero,
      'cuentaBancaria' : this.myControlCuentaBancariaCheque,
      'fechaInicio' : this.myControlFechaInicioCheque,
      'fechaFin' : this.myControlFechaFinCheque,
      'boleta' : this.myControlBoleta
    });

    this.formBusquedaCheque.get('banco').disable();
    this.formBusquedaCheque.get('nombreNumero').disable();
    this.formBusquedaCheque.get('cuentaBancaria').disable();
    this.formBusquedaCheque.get('fechaInicio').disable();
    this.formBusquedaCheque.get('fechaFin').disable();
    this.formBusquedaCheque.get('boleta').disable();

  }

  initFormBusquedaBoleta() {
    this.formBusquedaBoleta = new FormGroup({
      'banco' : this.myControlBancoBoleta,
      'numero' : this.myControlNumeroBoleta,
      'cuentaBancaria' : this.myControlCuentaBancariaBoleta,
      'fechaInicio' : this.myControlFechaInicioBoleta,
      'fechaFin' : this.myControlFechaFinBoleta,
      'documentoTipo' : this.myControlDocumentoTipo
    });

    this.formBusquedaBoleta.get('banco').disable();
    this.formBusquedaBoleta.get('numero').disable();
    this.formBusquedaBoleta.get('cuentaBancaria').disable();
    this.formBusquedaBoleta.get('fechaInicio').disable();
    this.formBusquedaBoleta.get('fechaFin').disable();
    this.formBusquedaBoleta.get('documentoTipo').disable();

  }

  initFormIngresoCheque() {
    this.formIngresoCheque = new FormGroup({
      'cuentaBancaria' : new FormControl('', Validators.required),
      'numero' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required),
      'fechaEmision' : new FormControl('', Validators.required),
      'fechaDeposito' : new FormControl('')
    });

    this.formIngresoCheque.get('fechaDeposito').disable();
  }

  initFormIngresoBoleta() {
    this.formIngresoBoleta = new FormGroup({
      'cuentaBancaria' : new FormControl('', Validators.required),
      'numero' : new FormControl('', Validators.required),
      'documentoTipo' : new FormControl('', Validators.required),
      'fecha' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required),
      'cheque' : new FormControl(''),
    });

    this.formIngresoBoleta.get('cheque').disable();
    this.formIngresoBoleta.get('monto').disable();
  }

  setInputsCheque() {
    if(this.idBusquedaCheque == 1) {
      this.setBancoChequeInput(true);
      this.setNombreNumeroInput(false);
      this.setCuentaBancariaChequeInput(false);
      this.setFechaChequeInput(false);
      this.setBoletaInput(false);
    } else if(this.idBusquedaCheque == 2) {
      this.setBancoChequeInput(false);
      this.setNombreNumeroInput(false);
      this.setCuentaBancariaChequeInput(true);
      this.setFechaChequeInput(false);
      this.setBoletaInput(false);
    } else if(this.idBusquedaCheque == 3) {
      this.setBancoChequeInput(false);
      this.setNombreNumeroInput(true);
      this.setCuentaBancariaChequeInput(false);
      this.setFechaChequeInput(false);
      this.setBoletaInput(false);
    } else if(this.idBusquedaCheque == 4) {
      this.setBancoChequeInput(false);
      this.setNombreNumeroInput(true);
      this.setCuentaBancariaChequeInput(false);
      this.setFechaChequeInput(false);
      this.setBoletaInput(false);
    } else if(this.idBusquedaCheque == 5) {
      this.setBancoChequeInput(false);
      this.setNombreNumeroInput(false);
      this.setCuentaBancariaChequeInput(false);
      this.setFechaChequeInput(true);
      this.setBoletaInput(false);
    } else if(this.idBusquedaCheque == 6) {
      this.setBancoChequeInput(false);
      this.setNombreNumeroInput(false);
      this.setCuentaBancariaChequeInput(false);
      this.setFechaChequeInput(true);
      this.setBoletaInput(false);
    } else if(this.idBusquedaCheque == 7) {
      this.setBancoChequeInput(false);
      this.setNombreNumeroInput(false);
      this.setCuentaBancariaChequeInput(false);
      this.setFechaChequeInput(false);
      this.setBoletaInput(true);
    }
  }

  setBancoChequeInput(e : boolean) {
    this.dataSourceCheque = new MatTableDataSource();
    this.myControlBancoCheque.reset();
    if(e) {
      this.formBusquedaCheque.get('banco').enable();
    } else {
      this.formBusquedaCheque.get('banco').disable();
    }
  }

  setCuentaBancariaChequeInput(e : boolean) {
    this.dataSourceCheque = new MatTableDataSource();
    this.myControlCuentaBancariaCheque.reset();
    if(e) {
      this.formBusquedaCheque.get('cuentaBancaria').enable();
    } else {
      this.formBusquedaCheque.get('cuentaBancaria').disable();
    }
  }

  setNombreNumeroInput(e : boolean) {
    this.dataSourceCheque = new MatTableDataSource();
    this.myControlNombreNumero.reset();
    if(e) {
      this.formBusquedaCheque.get('nombreNumero').enable();
    } else {
      this.formBusquedaCheque.get('nombreNumero').disable();
    }
  }

  setBoletaInput(e : boolean) {
    this.dataSourceCheque = new MatTableDataSource();
    this.myControlBoleta.reset();
    if(e) {
      this.formBusquedaCheque.get('boleta').enable();
    } else {
      this.formBusquedaCheque.get('boleta').disable();
    }
  }

  setFechaChequeInput(e : boolean) {
    this.dataSourceCheque = new MatTableDataSource();
    this.myControlFechaInicioCheque.reset();
    this.myControlFechaFinCheque.reset();
    if(e) {
      this.formBusquedaCheque.get('fechaInicio').enable();
      this.formBusquedaCheque.get('fechaFin').enable();
    } else {
      this.formBusquedaCheque.get('fechaInicio').disable();
      this.formBusquedaCheque.get('fechaFin').disable();
    }
  }
 
  setInputsBoleta() {
    this.formBusquedaBoleta.reset();
    if(this.idBusquedaBoleta == 1) {
      this.setBancoBoletaInput(true);
      this.setCuentaBancariaBoletaInput(false);
      this.setNumeroBoletaInput(false);
      this.setDocumentoTipoInput(false);
      this.setFechaBoletaInput(false);
    } else if(this.idBusquedaBoleta == 2) {
      this.setBancoBoletaInput(false);
      this.setCuentaBancariaBoletaInput(true);
      this.setNumeroBoletaInput(false);
      this.setDocumentoTipoInput(false);
      this.setFechaBoletaInput(false);
    } else if(this.idBusquedaBoleta == 3) {
      this.setBancoBoletaInput(false);
      this.setCuentaBancariaBoletaInput(false);
      this.setNumeroBoletaInput(true);
      this.setDocumentoTipoInput(false);
      this.setFechaBoletaInput(false);
    } else if(this.idBusquedaBoleta == 4) {
      this.setBancoBoletaInput(false);
      this.setCuentaBancariaBoletaInput(false);
      this.setNumeroBoletaInput(false);
      this.setDocumentoTipoInput(true);
      this.setFechaBoletaInput(false);
    } else if(this.idBusquedaBoleta == 5) {
      this.setBancoBoletaInput(false);
      this.setCuentaBancariaBoletaInput(false);
      this.setNumeroBoletaInput(false);
      this.setDocumentoTipoInput(false);
      this.setFechaBoletaInput(true);
    }
  }

  setBancoBoletaInput(e : boolean) {
    this.dataSourceBoleta = new MatTableDataSource();
    this.myControlBancoBoleta.reset();
    if(e) {
      this.formBusquedaBoleta.get('banco').enable();
    } else {
      this.formBusquedaBoleta.get('banco').disable();
    }
  }

  setCuentaBancariaBoletaInput(e : boolean) {
    this.dataSourceBoleta = new MatTableDataSource();
    this.myControlCuentaBancariaBoleta.reset();
    if(e) {
      this.formBusquedaBoleta.get('cuentaBancaria').enable();
    } else {
      this.formBusquedaBoleta.get('cuentaBancaria').disable();
    }
  }

  setNumeroBoletaInput(e : boolean) {
    this.dataSourceBoleta = new MatTableDataSource();
    this.myControlBancoBoleta.reset();
    if(e) {
      this.formBusquedaBoleta.get('numero').enable();
    } else {
      this.formBusquedaBoleta.get('numero').disable();
    }
  }

  setDocumentoTipoInput(e : boolean) {
    this.dataSourceBoleta = new MatTableDataSource();
    this.myControlBancoBoleta.reset();
    if(e) {
      this.formBusquedaBoleta.get('documentoTipo').enable();
    } else {
      this.formBusquedaBoleta.get('documentoTipo').disable();
    }
  }

  setFechaBoletaInput(e : boolean) {
    this.dataSourceBoleta = new MatTableDataSource();
    this.myControlFechaInicioBoleta.reset();
    this.myControlFechaFinBoleta.reset();
    if(e) {
      this.formBusquedaBoleta.get('fechaInicio').enable();
      this.formBusquedaBoleta.get('fechaFin').enable();
    } else {
      this.formBusquedaBoleta.get('fechaInicio').disable();
      this.formBusquedaBoleta.get('fechaFin').disable();
    }
  }

  cambiarFechaInicioCheque(e : any) {
    this.fechaInicioChequeSeleccionada = e.value;
    this.fechaInicioChequeFormato = moment(this.fechaInicioChequeSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaFinCheque(e : any) {
    this.fechaFinChequeSeleccionada = e.value;
    this.fechaFinChequeFormato = moment(this.fechaFinChequeSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaInicioBoleta(e : any) {
    this.fechaInicioBoletaSeleccionada = e.value;
    this.fechaInicioBoletaFormato = moment(this.fechaInicioBoletaSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaFinBoleta(e : any) {
    this.fechaFinBoletaSeleccionada = e.value;
    this.fechaFinBoletaFormato = moment(this.fechaFinBoletaSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaEmision(e : any) {
    this.fechaEmisionSeleccionada = e.value;
    this.fechaEmisionFormato = moment(this.fechaEmisionSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaDeposito(e : any) {
    this.fechaDepositoSeleccionada = e.value;
    this.fechaDepositoFormato = moment(this.fechaDepositoSeleccionada).format(this.formatoFecha);
  }

  cambiarFecha(e : any) {
    this.fechaSeleccionada = e.value;
    this.fechaFormato = moment(this.fechaSeleccionada).format(this.formatoFecha);
  }

  buscarCheque() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHEQUES, PermisoUtil.CONSULTAR)) {
      if(this.idBusquedaCheque==1) {
        this.dataSourceCheque = new MatTableDataSource();
        this.chequeService.getByBanco(this.idBancoBCheque).subscribe(data => {
          this.dataSourceCheque = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaCheque==2) {
        this.dataSourceCheque = new MatTableDataSource();
        this.chequeService.getByCuentaBancaria(this.idCuentaBancariaBCheque).subscribe(data => {
          this.dataSourceCheque = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaCheque==3) {
        this.dataSourceCheque = new MatTableDataSource();
        this.chequeService.getByNombre(this.formBusquedaCheque.value['nombreNumero']).subscribe(data => {
          this.dataSourceCheque = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaCheque==4) {
        this.dataSourceCheque = new MatTableDataSource();
        this.chequeService.getByNumero(this.formBusquedaCheque.value['nombreNumero']).subscribe(data => {
          this.dataSourceCheque = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaCheque==5) {
        this.dataSourceCheque = new MatTableDataSource();
        this.chequeService.getByFechaEmision(this.fechaInicioChequeFormato, this.fechaFinChequeFormato).subscribe(data => {
          this.dataSourceCheque = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaCheque==6) {
        this.dataSourceCheque = new MatTableDataSource();
        this.chequeService.getByFechaDeposito(this.fechaInicioChequeFormato, this.fechaFinChequeFormato).subscribe(data => {
          this.dataSourceCheque = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaCheque==7) {
        this.dataSourceCheque = new MatTableDataSource();
        if(this.idBoletaB==1) {
          this.chequeService.getInBoletas().subscribe(data => {
            this.dataSourceCheque = new MatTableDataSource(data);
          });
        } else if(this.idBoletaB==2) {
          this.chequeService.getNotInBoletas().subscribe(data => {
            this.dataSourceCheque = new MatTableDataSource(data);
          });
        }
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  guardarCheque() {
    
    this.cheque.cuentaBancaria = new CuentaBancaria();
    this.cheque.cuentaBancaria.idCuentaBancaria = this.idCuentaBancariaCCheque;
    this.cheque.numero = this.formIngresoCheque.value['numero'];
    this.cheque.fechaEmision = this.fechaEmisionFormato;
    this.cheque.fechaDeposito = this.fechaDepositoFormato;
    if(this.fechaDepositoFormato=="") {
      this.cheque.fechaDeposito = null;
    }
    
    if(this.cheque!=null && this.cheque.idCheque>0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHEQUES, PermisoUtil.EDITAR)) {
        this.chequeService.update(this.cheque).pipe(switchMap(() => {
          return this.chequeService.getAll();
        })).subscribe(data => {
          this.chequeService.setObjetoCambio(data);
          this.chequeService.setMensajeCambio('Cheque actualizado');
          this.limpiarFormCheque();
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      this.cheque.monto = this.formIngresoCheque.value['monto'];
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHEQUES, PermisoUtil.CREAR)) {
        this.chequeService.create(this.cheque).pipe(switchMap(() => {
          return this.chequeService.getAll();
        })).subscribe(data => {
          this.chequeService.setObjetoCambio(data);
          this.chequeService.setMensajeCambio('Cheque creado');
          this.limpiarFormCheque();
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }
  }

  eliminarCheque() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHEQUES, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(ChequeDialogoEliminarComponent, {
        width: '400px',
        data: this.cheque
      });
      
      dialogRef.afterClosed().subscribe(() => {
        this.limpiarFormCheque();
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  limpiarFormCheque() {
    this.formIngresoCheque.reset();
    this.formIngresoCheque.get('monto').enable();
    this.idCuentaBancariaBCheque = 0;
    this.fechaEmisionFormato = "";
    this.fechaDepositoFormato = "";
    this.fechaEmisionSeleccionada = new Date();
    this.fechaDepositoSeleccionada = new Date();
    this.cheque = new Cheque();
  }

  evaluarBotonEliminarCheque() {
    if(this.cheque!=null && this.cheque.idCheque>0) {
      return false;
    }
    return true;
  }

  cargarCheque(cheque : Cheque) {
    this.cheque = new Cheque();
    this.cheque.idCheque = cheque.idCheque;
    this.cheque.cuentaBancaria = cheque.cuentaBancaria;
    this.cheque.monto = cheque.monto;
    this.cheque.numero = cheque.numero;
    this.cheque.fechaDeposito = cheque.fechaDeposito;
    this.cheque.fechaEmision = cheque.fechaEmision;
    
    this.idCuentaBancariaCCheque = this.cheque.cuentaBancaria.idCuentaBancaria;
    this.fechaEmisionFormato = moment(this.cheque.fechaEmision).format(this.formatoFecha);
    this.fechaDepositoFormato = "";
    if(this.cheque.fechaDeposito!=null) {
      this.fechaDepositoFormato = moment(this.cheque.fechaDeposito).format(this.formatoFecha);
    }

    this.formIngresoCheque = new FormGroup({
      'cuentaBancaria' : new FormControl(this.idCuentaBancariaCCheque, Validators.required),
      'numero' : new FormControl(this.cheque.numero, Validators.required),
      'monto' : new FormControl(this.cheque.monto, Validators.required),
      'fechaEmision' : new FormControl(this.fechaEmisionFormato, Validators.required),
      'fechaDeposito' : new FormControl(this.fechaDepositoFormato)
    });

    this.formIngresoCheque.get('fechaDeposito').disable();
    this.formIngresoCheque.get('monto').disable();
  }

  verChequeMonto() {
    if(this.idBoletaTipoDocumentoC==1) {
      this.formIngresoBoleta.get('monto').disable();
      this.formIngresoBoleta.get('cheque').enable();
    } else {
      this.formIngresoBoleta.patchValue({
        monto : ''
      });
      this.formIngresoBoleta.get('monto').enable();
      this.formIngresoBoleta.get('cheque').disable();
    }
  }

  cargarMontoCheque() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.CHEQUES, PermisoUtil.CONSULTAR)) {
      if(this.idChequeNotInBoleta>0) {
        this.formIngresoBoleta.get('monto').enable();
        this.chequeService.getById(this.idChequeNotInBoleta).subscribe(data => {
          this.formIngresoBoleta.patchValue({
            monto : `${data.monto.toFixed(2)}`
          });
          this.formIngresoBoleta.get('monto').disable();
        });
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  buscarBoleta() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BOLETAS, PermisoUtil.CONSULTAR)) {
      if(this.idBusquedaBoleta==1) {
        this.dataSourceBoleta = new MatTableDataSource();
        this.boletaService.getByBanco(this.idBancoBBoleta).subscribe(data => {
          this.dataSourceBoleta = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaBoleta==2) {
        this.dataSourceBoleta = new MatTableDataSource();
        this.boletaService.getByCuentaBancaria(this.idCuentaBancariaBBoleta).subscribe(data => {
          this.dataSourceBoleta = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaBoleta==3) {
        this.dataSourceBoleta = new MatTableDataSource();
        this.boletaService.getByNumero(this.formBusquedaBoleta.value['numero']).subscribe(data => {
          this.dataSourceBoleta = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaBoleta==4) {
        this.dataSourceBoleta = new MatTableDataSource();
        this.boletaService.getByBoletaTipoDocumento(this.idBoletaTipoDocumentoB).subscribe(data => {
          this.dataSourceBoleta = new MatTableDataSource(data);
        });
      } else if(this.idBusquedaBoleta==5) {
        this.dataSourceBoleta = new MatTableDataSource();
        this.boletaService.getByFecha(this.fechaInicioBoletaFormato, this.fechaFinBoletaFormato).subscribe(data => {
          this.dataSourceBoleta = new MatTableDataSource(data);
        });
      }
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  guardarBoleta() {
    this.boleta.cuentaBancaria = new CuentaBancaria();
    this.boleta.cuentaBancaria.idCuentaBancaria = this.idCuentaBancariaCBoleta;
    this.boleta.boletaTipoDocumento = new BoletaTipoDocumento();
    this.boleta.boletaTipoDocumento.idBoletaTipoDocumento = this.idBoletaTipoDocumentoC;
    this.boleta.numero = this.formIngresoBoleta.value['numero'];
    this.boleta.monto = this.formIngresoBoleta.value['monto'];
    this.boleta.fecha = this.fechaFormato;
    this.boleta.cheque = null;
    if(this.idChequeNotInBoleta>0) {
      this.boleta.cheque = new Cheque();
      this.boleta.cheque.idCheque = this.idChequeNotInBoleta;
    }

    if(this.boleta.idBoleta>0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BOLETAS, PermisoUtil.EDITAR)) {
        this.boletaService.update(this.boleta).pipe(switchMap(() => {
          return this.boletaService.getAll();
        })).subscribe(data => {
          this.boletaService.setObjetoCambio(data);
          this.boletaService.setMensajeCambio('Boleta actualizada');
          this.limpiarFormBoleta();
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BOLETAS, PermisoUtil.CREAR)) {
        this.boletaService.create(this.boleta).pipe(switchMap(() => {
          return this.boletaService.getAll();
        })).subscribe(data => {
          this.boletaService.setObjetoCambio(data);
          this.boletaService.setMensajeCambio('Boleta creada');
          this.limpiarFormBoleta();
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
      
    }
  }

  evaluarBotonEliminarBoleta() {
    if(this.boleta!=null && this.boleta.idBoleta>0) {
      return false;
    }
    return true;
  }

  eliminarBoleta() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.BOLETAS, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(BoletaDialogoEliminarComponent, {
        width: '400px',
        data: this.boleta
      });
      
      dialogRef.afterClosed().subscribe(() => {
        this.limpiarFormBoleta();
      });
    } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  limpiarFormBoleta() {
    this.formIngresoBoleta.reset();
    this.idCuentaBancariaCBoleta = 0;
    this.idBoletaTipoDocumentoC = 0;
    this.idChequeNotInBoleta = 0;
    this.boleta = new Boleta();
    this.formIngresoBoleta.get('monto').disable();
    this.formIngresoBoleta.get('cheque').disable();
    this.chequesNotInBoletas$ = this.chequeService.getNotInBoletas();
  }

  cargarBoleta(boleta : Boleta) {
    this.boleta = new Boleta();
    this.boleta.idBoleta = boleta.idBoleta;
    this.boleta.cuentaBancaria = boleta.cuentaBancaria;
    this.boleta.boletaTipoDocumento = boleta.boletaTipoDocumento;
    this.boleta.fecha = boleta.fecha;
    this.boleta.monto = boleta.monto;
    this.boleta.numero = boleta.numero;
    
    this.idCuentaBancariaCBoleta = this.boleta.cuentaBancaria.idCuentaBancaria;
    this.idBoletaTipoDocumentoC = this.boleta.boletaTipoDocumento.idBoletaTipoDocumento;
    this.fechaFormato = moment(this.boleta.fecha).format(this.formatoFecha);

    this.formIngresoBoleta.patchValue({
      cuentaBancaria : this.idCuentaBancariaCBoleta,
      numero : this.boleta.numero,
      documentoTipo : this.idBoletaTipoDocumentoC,
      fecha : this.fechaFormato,
      monto : this.boleta.monto.toFixed(2)
    });

    if(boleta.boletaTipoDocumento.idBoletaTipoDocumento==1) {
      this.idChequeNotInBoleta = boleta.cheque.idCheque;
      this.chequesNotInBoletas$ = this.chequeService.getNotInBoletasExceptCheque(this.idChequeNotInBoleta);
      this.formIngresoBoleta.get('cheque').enable();
      this.formIngresoBoleta.patchValue({
        cheque : this.idChequeNotInBoleta
      });
      this.formIngresoBoleta.get('monto').disable();
    } else {
      this.chequesNotInBoletas$ = this.chequeService.getNotInBoletas();
      this.formIngresoBoleta.get('monto').enable();
      this.formIngresoBoleta.get('cheque').disable();
    }
  }
}
