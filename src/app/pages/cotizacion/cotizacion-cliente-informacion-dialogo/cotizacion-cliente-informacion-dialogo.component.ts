import { NgxSpinnerService } from 'ngx-spinner';
import { CotizacionAutomotorDTO } from './../../../_model/dto/cotizacionAutomotorDTO';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReporteService } from './../../../_service/reporte.service';
import { Cotizacion } from './../../../_model/cotizacion';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-cotizacion-cliente-informacion-dialogo',
  templateUrl: './cotizacion-cliente-informacion-dialogo.component.html',
  styleUrls: ['./cotizacion-cliente-informacion-dialogo.component.css']
})
export class CotizacionClienteInformacionDialogoComponent implements OnInit {

  form : FormGroup;

  constructor(
    private dialogRef : MatDialogRef<CotizacionClienteInformacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Cotizacion,
    private reporteService : ReporteService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      'segmentoNombre' : new FormControl(this.data.segmento.nombre),
      'segmentoDireccion' : new FormControl(this.data.segmento.direccionFiscal),
      'segmentoNit' : new FormControl(this.data.segmento.nit),
      'atencion' : new FormControl(''),
      'marca' : new FormControl(''),
      'tipo' : new FormControl(''),
      'modelo' : new FormControl(''),
      'placa' : new FormControl(''),
      'color' : new FormControl(''),
      'linea' : new FormControl('')
    });
  }

  generarCotizacionCliente() {
    this.spinner.show()
    let cotizacionAutomotor = new CotizacionAutomotorDTO();
    cotizacionAutomotor.idCotizacion = this.data.idCotizacion;
    cotizacionAutomotor.segmentoNombre = this.form.value['segmentoNombre'];
    cotizacionAutomotor.segmentoDireccion = this.form.value['segmentoDireccion'];
    cotizacionAutomotor.segmentoNit = this.form.value['segmentoNit'];
    cotizacionAutomotor.atencion = this.form.value['atencion'];
    cotizacionAutomotor.marca = this.form.value['marca'];
    cotizacionAutomotor.tipo = this.form.value['tipo'];
    cotizacionAutomotor.modelo = this.form.value['modelo'];
    cotizacionAutomotor.placa = this.form.value['placa'];
    cotizacionAutomotor.color = this.form.value['color'];
    cotizacionAutomotor.linea = this.form.value['linea'];
    this.reporteService.crearCotizacionCliente(cotizacionAutomotor).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Cotizacion_${cotizacionAutomotor.segmentoNombre}_${cotizacionAutomotor.placa}.pdf`;
      a.click();
      this.spinner.hide()
    });
  }
  
  cerrar() {
    this.dialogRef.close();
  }
}
