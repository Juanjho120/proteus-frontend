import { Placa } from './../../../_model/placa';
import { Segmento } from './../../../_model/segmento';
import { ProveedorMenor } from './../../../_model/proveedorMenor';
import { ProveedorAsesor } from './../../../_model/proveedorAsesor';
import { Proveedor } from './../../../_model/proveedor';
import { Repuesto } from './../../../_model/repuesto';
import { SegmentoService } from './../../../_service/segmento.service';
import { PlacaService } from './../../../_service/placa.service';
import { ProveedorMenorService } from './../../../_service/proveedor-menor.service';
import { ProveedorAsesorService } from './../../../_service/proveedor-asesor.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProveedorService } from './../../../_service/proveedor.service';
import { RepuestoService } from './../../../_service/repuesto.service';
import { ModificacionDTO } from './../../../_model/dto/modificacionDTO';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-detalle-creacion-dialogo',
  templateUrl: './detalle-creacion-dialogo.component.html',
  styleUrls: ['./detalle-creacion-dialogo.component.css']
})
export class DetalleCreacionDialogoComponent implements OnInit {

  repuesto : Repuesto = new Repuesto();
  proveedor : Proveedor = new Proveedor();
  proveedorAsesor : ProveedorAsesor = new ProveedorAsesor();
  proveedorMenor : ProveedorMenor = new ProveedorMenor();
  segmento : Segmento = new Segmento();
  placa : Placa = new Placa();

  constructor(
    private dialogRef : MatDialogRef<DetalleCreacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ModificacionDTO,
    private repuestoService : RepuestoService,
    private proveedorService : ProveedorService,
    private proveedorAsesorService : ProveedorAsesorService,
    private proveedorMenorService : ProveedorMenorService,
    private placaService : PlacaService,
    private segmentoService : SegmentoService
  ) { }

  ngOnInit(): void {
    if(this.data.tabla==="REPUESTOS") {
      this.repuestoService.getById(this.data.idItem).subscribe(data => {
        this.repuesto = data;
        if(data==null) {
          document.getElementById("div-eliminado").style.display = "block"; 
        } else {
          document.getElementById("div-eliminado").style.display = "none";
          document.getElementById("div-repuesto").style.display = "block";
        }
      });
    } else if(this.data.tabla==="PROVEEDORES MAYORES") {
      this.proveedorService.getById(this.data.idItem).subscribe(data => {
        this.proveedor = data;
        if(data==null) {
          document.getElementById("div-eliminado").style.display = "block"; 
        } else {
          document.getElementById("div-eliminado").style.display = "none";
          document.getElementById("div-proveedor").style.display = "block";
        }
      });
    } else if(this.data.tabla==="PROVEEDOR ASESORES") {
      this.proveedorAsesorService.getById(this.data.idItem).subscribe(data => {
        this.proveedorAsesor = data;
        if(data==null) {
          document.getElementById("div-eliminado").style.display = "block"; 
        } else {
          document.getElementById("div-eliminado").style.display = "none";
          document.getElementById("div-proveedor-asesor").style.display = "block";
        }
      });
    } else if(this.data.tabla==="PROVEEDORES MENORES") {
      this.proveedorMenorService.getById(this.data.idItem).subscribe(data => {
        this.proveedorMenor = data;
        if(data==null) {
          document.getElementById("div-eliminado").style.display = "block";
        } else {
          document.getElementById("div-eliminado").style.display = "none";
          document.getElementById("div-proveedor-menor").style.display = "block";
        }
      });
    } else if(this.data.tabla==="SEGMENTOS") {
      this.segmentoService.getById(this.data.idItem).subscribe(data => {
        this.segmento = data;
        if(data==null) {
          document.getElementById("div-eliminado").style.display = "block"; 
        } else {
          document.getElementById("div-eliminado").style.display = "none";
          document.getElementById("div-segmento").style.display = "block";
        }
      });
    } else if(this.data.tabla==="PLACAS") {
      this.placaService.getById(this.data.idItem).subscribe(data => {
        this.placa = data;
        if(data==null) {
          document.getElementById("div-eliminado").style.display = "block"; 
        } else {
          document.getElementById("div-eliminado").style.display = "none";
          document.getElementById("div-placa").style.display = "block";
        }
      });
    }
  }

}
