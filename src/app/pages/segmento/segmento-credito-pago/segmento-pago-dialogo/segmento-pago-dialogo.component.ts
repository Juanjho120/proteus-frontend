import { Transaccion } from './../../../../_model/transaccion';
import { SegmentoPagoTransaccionChequeDTO } from './../../../../_model/dto/segmentoPagoTransaccionChequeDTO';
import { TransaccionEstadoService } from './../../../../_service/transaccion-estado.service';
import { CuentaBancariaService } from './../../../../_service/cuenta-bancaria.service';
import { CuentaBancaria } from './../../../../_model/cuentaBancaria';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagoTipoService } from './../../../../_service/pago-tipo.service';
import { SegmentoCreditoDetalleService } from './../../../../_service/segmento-credito-detalle.service';
import { MatTableDataSource } from '@angular/material/table';
import { PagoTipo } from './../../../../_model/pagoTipo';
import { SegmentoCredito } from './../../../../_model/segmentoCredito';
import { switchMap } from 'rxjs/operators';
import { SegmentoPago } from './../../../../_model/segmentoPago';
import { SegmentoPagoService } from './../../../../_service/segmento-pago.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentoCreditoDetalleDTO } from './../../../../_model/dto/segmentoCreditoDetalleDTO';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { SegmentoCreditoDetalle } from 'src/app/_model/segmentoCreditoDetalle';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { TransaccionEstado } from 'src/app/_model/transaccionEstado';
import { SegmentoPagoDetalle } from 'src/app/_model/segmentoPagoDetalle';
import { Cheque } from 'src/app/_model/cheque';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/_service/loader.service';
import { Sucursal } from 'src/app/_model/sucursal';

interface SegmentoCreditoSucursal {
  segmentoCredito: SegmentoCredito,
  idSucursal: number
}

@Component({
  selector: 'app-segmento-pago-dialogo',
  templateUrl: './segmento-pago-dialogo.component.html',
  styleUrls: ['./segmento-pago-dialogo.component.css']
})
export class SegmentoPagoDialogoComponent implements OnInit {

  formPago: FormGroup;
  formCheque : FormGroup;
  formTransaccion : FormGroup;
  segmentoNombre : string = "";

  pagoTipos$ : Observable<PagoTipo[]>;
  idPagoTipo : number = 0;

  cuentasBancarias$ : Observable<CuentaBancaria[]>;
  idCuentaBancaria : number = 0;

  transaccionEstados$ : Observable<TransaccionEstado[]>;
  idTransaccionEstado : number = 0;

  dataSourceFacturasPorPagar : MatTableDataSource<SegmentoCreditoDetalle>;
  dataSourceFacturasAPagar : MatTableDataSource<SegmentoCreditoDetalle>;

  segmentoCreditoDetallePorPagar : SegmentoCreditoDetalle[] = [];
  segmentoCreditoDetalleAPagar : SegmentoCreditoDetalle[] = [];

  displayedColumnsFactura = ['factura', 'servicio', 'fecha', 'total'];

  formatoFecha : string = 'YYYY-MM-DD';
  maxFecha: Date = new Date();
  fechaEmisionSeleccionada: Date = new Date();
  fechaProcesamientoSeleccionada: Date = new Date();
  fechaAprobacionSeleccionada: Date = new Date();
  fechaEmisionFormato : string;
  fechaProcesamientoFormato : string;
  fechaAprobacionFormato : string;

  monto: number = 0;

  constructor(
    private dialogRef : MatDialogRef<SegmentoPagoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : SegmentoCreditoSucursal,
    private segmentoPagoService : SegmentoPagoService,
    private segmentoCreditoDetalleService : SegmentoCreditoDetalleService,
    private pagoTipoService : PagoTipoService,
    private cuentaBancariaService : CuentaBancariaService,
    private transaccionEstadoService : TransaccionEstadoService,
    private snackBar : MatSnackBar,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.segmentoNombre = this.data.segmentoCredito.segmento.nombre;
    this.dataSourceFacturasAPagar = new MatTableDataSource();
    this.segmentoCreditoDetalleService.getBySegmentoSinPagar(this.data.segmentoCredito.segmento.idSegmento).subscribe(data => {
      for(let segmentoCreditoDetalle of data) {
        segmentoCreditoDetalle.fechaHoraEmision = moment(segmentoCreditoDetalle.fechaHoraEmision).format(this.formatoFecha);
        if(this.data.idSucursal > 0 && segmentoCreditoDetalle.servicio.sucursal.idSucursal == this.data.idSucursal) {
          this.segmentoCreditoDetallePorPagar.push(segmentoCreditoDetalle);
        } else if(this.data.idSucursal == 0) {
          this.segmentoCreditoDetallePorPagar.push(segmentoCreditoDetalle);
        }
      }
      this.dataSourceFacturasPorPagar = new MatTableDataSource(this.segmentoCreditoDetallePorPagar);
    });

    this.pagoTipos$ = this.pagoTipoService.getAll();

    this.cuentasBancarias$ = this.cuentaBancariaService.getAll();

    this.transaccionEstados$ = this.transaccionEstadoService.getAll();

    this.initFormPago();

    this.initFormCheque();

    this.initFormTransaccion();
  }

  initFormPago() {
    this.formPago = new FormGroup({
      'pagoTipo' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required)
    });
  }

  initFormCheque() {
    this.formCheque = new FormGroup({
      'cuentaBancaria' : new FormControl('', Validators.required),
      'numero' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required),
      'fechaEmision' : new FormControl('', Validators.required)
    });
  }

  initFormTransaccion() {
    this.formTransaccion = new FormGroup({
      'cuentaBancaria' : new FormControl('', Validators.required),
      'referencia' : new FormControl('', Validators.required),
      'monto' : new FormControl('', Validators.required),
      'fechaProcesamiento' : new FormControl('', Validators.required),
      'fechaAprobacion' : new FormControl('', Validators.required),
      'transaccionEstado' : new FormControl('', Validators.required)
    });
  }

  removerFacturaPorPagar(i : number) {
    this.monto += this.segmentoCreditoDetallePorPagar[i].totalRestante;
    this.segmentoCreditoDetalleAPagar.push(this.segmentoCreditoDetallePorPagar[i]);
    this.segmentoCreditoDetallePorPagar.splice(i, 1);

    this.dataSourceFacturasAPagar = new MatTableDataSource(this.segmentoCreditoDetalleAPagar);
    this.dataSourceFacturasPorPagar = new MatTableDataSource(this.segmentoCreditoDetallePorPagar);
    this.actualizarMontoForm();
  }

  removerFacturaAPagar(i : number) {
    this.monto -= this.segmentoCreditoDetalleAPagar[i].totalRestante;
    this.segmentoCreditoDetallePorPagar.push(this.segmentoCreditoDetalleAPagar[i]);
    this.segmentoCreditoDetalleAPagar.splice(i, 1);

    this.dataSourceFacturasAPagar = new MatTableDataSource(this.segmentoCreditoDetalleAPagar);
    this.dataSourceFacturasPorPagar = new MatTableDataSource(this.segmentoCreditoDetallePorPagar);
    this.actualizarMontoForm();
  }

  actualizarMontoForm() {
    if(this.idPagoTipo==2) {
      this.formCheque.patchValue({
        monto : this.monto.toFixed(2)
      });
    } else if(this.idPagoTipo==3) {
      this.formTransaccion.patchValue({
        monto : this.monto.toFixed(2)
      });
    } else {
      this.formPago.patchValue({
        monto : this.monto.toFixed(2)
      });
    }
  }

  cambiarFechaEmision(e : any) {
    this.fechaEmisionSeleccionada = e.value;
    this.fechaEmisionFormato = moment(this.fechaEmisionSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaProcesamiento(e : any) {
    this.fechaProcesamientoSeleccionada = e.value;
    this.fechaProcesamientoFormato = moment(this.fechaProcesamientoSeleccionada).format(this.formatoFecha);
  }

  cambiarFechaAprobacion(e : any) {
    this.fechaAprobacionSeleccionada = e.value;
    this.fechaAprobacionFormato = moment(this.fechaAprobacionSeleccionada).format(this.formatoFecha);
  }

  verChequeTransaccion() {
    this.formCheque.reset();
    this.formTransaccion.reset();
    this.idTransaccionEstado = 0;
    this.idCuentaBancaria = 0;
    this.fechaEmisionFormato = "";
    this.fechaProcesamientoFormato = "";
    this.fechaAprobacionFormato = "";
    this.formPago.patchValue({
      monto : ''
    });
    if(this.idPagoTipo==2) {
      document.getElementById("div-form-cheque").style.display = "block";
      document.getElementById("div-form-transaccion").style.display = "none";
      this.formPago.get('monto').disable();
      this.formCheque.patchValue({
        monto : this.monto.toFixed(2)
      });
    } else if(this.idPagoTipo==3) {
      document.getElementById("div-form-cheque").style.display = "none";
      document.getElementById("div-form-transaccion").style.display = "block";
      this.formPago.get('monto').disable();
      this.formTransaccion.patchValue({
        monto : this.monto.toFixed(2)
      });
    } else {
      document.getElementById("div-form-cheque").style.display = "none";
      document.getElementById("div-form-transaccion").style.display = "none";
      this.formPago.get('monto').enable();
      this.formPago.patchValue({
        monto : this.monto.toFixed(2)
      });
    }
  }

  evaluarGuardarSegmentoPagoBoton() {
    if(this.loaderService.isLoading.value) {
      return true;
    }
    
    if(this.idPagoTipo>0) {
      if(this.idPagoTipo==1 && this.segmentoCreditoDetalleAPagar.length > 0) {
        if(this.formPago.valid) {
          return false;
        }
      } else if(this.idPagoTipo==2) {
        if(this.formPago.valid && this.formCheque.valid && this.segmentoCreditoDetalleAPagar.length > 0) {
          return false;
        }
      } else if(this.idPagoTipo==3) {
        if(this.formPago.valid && this.formTransaccion.valid && this.segmentoCreditoDetalleAPagar.length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  guardarSegmentoPago() {
    let segmentoPagoDto = new SegmentoPagoTransaccionChequeDTO();
    segmentoPagoDto.segmentoPago = new SegmentoPago();
    segmentoPagoDto.segmentoPago.pagoTipo = new PagoTipo();
    segmentoPagoDto.segmentoPago.pagoTipo.idPagoTipo = this.idPagoTipo;
    segmentoPagoDto.segmentoPago.monto = this.formPago.value['monto'];
    segmentoPagoDto.segmentoPago.sucursal = new Sucursal();
    segmentoPagoDto.segmentoPago.sucursal.idSucursal = this.data.idSucursal;
    segmentoPagoDto.segmentoPago.segmentoPagoDetalle = [];

    let totalPago = 0;
    for(let segmentoCreditoDetalleAux of this.segmentoCreditoDetalleAPagar) {
      totalPago += segmentoCreditoDetalleAux.totalRestante;
      let segmentoPagoDetalle = new SegmentoPagoDetalle();
      segmentoPagoDetalle.segmentoCreditoDetalle = new SegmentoCreditoDetalle();
      segmentoPagoDetalle.segmentoCreditoDetalle.idSegmentoCreditoDetalle = segmentoCreditoDetalleAux.idSegmentoCreditoDetalle;
      segmentoPagoDto.segmentoPago.segmentoPagoDetalle.push(segmentoPagoDetalle);
    }

    if(this.idPagoTipo == 1) {
      segmentoPagoDto.cheque = null;
      segmentoPagoDto.transaccion = null;
    } else if(this.idPagoTipo == 2) {
      segmentoPagoDto.segmentoPago.monto = this.formCheque.value['monto'];
      segmentoPagoDto.transaccion = null;
      
      let cheque = new Cheque();
      cheque.cuentaBancaria = new CuentaBancaria();
      cheque.cuentaBancaria.idCuentaBancaria = this.idCuentaBancaria;
      cheque.numero = this.formCheque.value['numero'];
      cheque.monto = this.formCheque.value['monto'];
      cheque.fechaEmision = this.fechaEmisionFormato;

      segmentoPagoDto.cheque = cheque;
      
    } else if(this.idPagoTipo == 3) {
      segmentoPagoDto.segmentoPago.monto = this.formTransaccion.value['monto'];
      segmentoPagoDto.cheque = null;

      let transaccion = new Transaccion();
      transaccion.cuentaBancariaDestino = new CuentaBancaria();
      transaccion.cuentaBancariaDestino.idCuentaBancaria = this.idCuentaBancaria;
      transaccion.referencia = this.formTransaccion.value['referencia'];
      transaccion.fechaAprobacion = this.fechaAprobacionFormato;
      transaccion.fechaProcesamiento = this.fechaProcesamientoFormato;
      transaccion.monto = this.formTransaccion.value['monto'];
      transaccion.transaccionEstado = new TransaccionEstado();
      transaccion.transaccionEstado.idTransaccionEstado = this.idTransaccionEstado;

      segmentoPagoDto.transaccion = transaccion;
    }

    if(totalPago > segmentoPagoDto.segmentoPago.monto || totalPago < segmentoPagoDto.segmentoPago.monto) {
      this.snackBar.open('El monto a pagar debe ser igual a la suma de las facturas seleccionadas', 'AVISO', {duration : 2000});
      return;
    }

    this.spinner.show();
    this.segmentoPagoService.createDTO(segmentoPagoDto).subscribe(() => {
      this.segmentoPagoService.setMensajeCambio('Pago de segmento registrado');
      this.spinner.hide();
      this.cerrar();
    });
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
