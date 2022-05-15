import { NgxSpinnerService } from 'ngx-spinner';
import { FacturaCompraService } from './../../../_service/factura-compra.service';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { MatDialog } from '@angular/material/dialog';
import { InventarioDialogoEliminarComponent } from './inventario-dialogo-eliminar/inventario-dialogo-eliminar.component';
import { DataService } from './../../../_service/data.service';
import { Inventario } from './../../../_model/inventario';
import { map } from 'rxjs/operators';
import { InventarioService } from './../../../_service/inventario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepuestoService } from './../../../_service/repuesto.service';
import { Observable } from 'rxjs';
import { Repuesto } from './../../../_model/repuesto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-inventario-busqueda',
  templateUrl: './inventario-busqueda.component.html',
  styleUrls: ['./inventario-busqueda.component.css']
})
export class InventarioBusquedaComponent implements OnInit {

  form : FormGroup;

  myControlRepuesto : FormControl = new FormControl('', Validators.required);
  myControlFactura : FormControl = new FormControl('', Validators.required);
  myControlServicio : FormControl = new FormControl('', Validators.required);
  myControlFechaInicio : FormControl = new FormControl('', Validators.required);
  myControlFechaFin : FormControl = new FormControl('', Validators.required);

  porServicio : boolean = false;
  porRepuesto : boolean = false;
  porFecha : boolean = false;
  porFactura : boolean = false;

  repuesto : Repuesto;
  repuestos : Repuesto[];
  repuestosFiltrados$ : Observable<Repuesto[]>;

  formatoFechaHora : string = 'YYYY-MM-DD 00:00:00';
  formatoFechaHoraBusqueda : string = 'YYYY-MM-DD HH:mm:ss';
  maxFecha: Date = new Date();
  fechaInicioSeleccionada: Date = new Date();
  fechaFinSeleccionada: Date = new Date();
  fechaInicioFormato : string;
  fechaFinFormato : string;

  inventarios : Inventario[] = [];

  idVentana : number = VentanaUtil.INVENTARIOS;

  constructor(
    private repuestoService : RepuestoService,
    private facturaCompraService : FacturaCompraService,
    private inventarioService : InventarioService,
    private dataService : DataService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'repuesto' : this.myControlRepuesto,
      'factura' : this.myControlFactura,
      'servicio' : this.myControlServicio,
      'fechaInicio' : this.myControlFechaInicio,
      'fechaFin' : this.myControlFechaFin
    });

    this.form.get('factura').disable();
    this.form.get('repuesto').disable();
    this.form.get('fechaInicio').disable();
    this.form.get('fechaFin').disable();
    this.form.get('servicio').disable();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getAll().subscribe(data => {
        this.repuestos = data;
      });

      this.repuestosFiltrados$ = this.myControlRepuesto.valueChanges.pipe(map(val => this.filtrarRepuestos(val)));
    }

    this.inventarioService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });
    
  }

  convertirInventarioFechaHora(i : Inventario) {
    let inventario : Inventario = new Inventario();
    inventario.idInventario = i.idInventario;
    inventario.usuario = i.usuario;
    inventario.concepto = i.concepto;
    inventario.cantidad = i.cantidad;
    inventario.razon = i.razon;
    inventario.facturaCompra = i.facturaCompra;
    inventario.fechaHora = moment(i.fechaHora).format(this.formatoFechaHoraBusqueda);
    inventario.inventarioDetalle = i.inventarioDetalle;
    return inventario;
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

  setRepuestoInput(e : boolean) {
    this.inventarios = [];
    this.myControlRepuesto.reset();
    if(e) {
      this.form.get('repuesto').enable();
    } else {
      this.form.get('repuesto').disable();
    }
  }

  setFacturaSelect(e : boolean) {
    this.inventarios = [];
    this.myControlFactura.reset();
    if(e) {
      this.form.get('factura').enable();
    } else {
      this.form.get('factura').disable();
    }
  }

  setFechaInput(e : boolean) {
    this.inventarios = [];
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

  setServicioSelect(e : boolean) {
    this.inventarios = [];
    this.myControlServicio.reset();
    if(e) {
      this.form.get('servicio').enable();
    } else {
      this.form.get('servicio').disable();
    }
  }

  cambiarFechaInicio(e : any) {
    this.fechaInicioSeleccionada = e.value;
    this.fechaInicioFormato = moment(this.fechaInicioSeleccionada).format(this.formatoFechaHora);
  }

  cambiarFechaFin(e : any) {
    this.fechaFinSeleccionada = e.value;
    this.fechaFinFormato = moment(this.fechaFinSeleccionada).format(this.formatoFechaHora);
  }

  buscar() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.INVENTARIOS, PermisoUtil.CONSULTAR)) {
      this.spinner.show()
      if(!this.porFactura && !this.porRepuesto && !this.porFecha && !this.porServicio) {

        this.spinner.hide()
        let mensaje = 'Debe elegir algún parámetro de búsqueda';
        this.snackBar.open(mensaje, "AVISO", { duration : 2000});
  
      } else if(this.porFactura && !this.porRepuesto && !this.porFecha && !this.porServicio) {
        
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLike(this.form.value['factura']).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && this.porRepuesto && !this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByRepuesto(this.repuesto.idRepuesto).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && !this.porRepuesto && this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFechaRango(this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && !this.porRepuesto && !this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByServicioCorrelativoLike(parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && !this.porRepuesto && this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndFechaRango(this.form.value['factura'], this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && this.porRepuesto && !this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndRepuesto(this.form.value['factura'], this.repuesto.idRepuesto).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && this.porRepuesto && !this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndRepuesto(this.form.value['factura'], this.repuesto.idRepuesto).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && !this.porRepuesto && !this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndServicioCorrelativoLike(this.form.value['factura'], parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && this.porRepuesto && !this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByRepuestoAndServicioCorrelativoLike(this.repuesto.idRepuesto, parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && this.porRepuesto && this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByRepuestoAndFechaRango(this.repuesto.idRepuesto, this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && !this.porRepuesto && this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByServicioCorrelativoLikeAndFechaRango(parseInt(this.form.value['servicio']), this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && this.porRepuesto && !this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndRepuestoAndServicioCorrelativoLike(this.form.value['factura'], this.repuesto.idRepuesto, parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && this.porRepuesto && this.porFecha && !this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndRepuestoAndFecha(this.form.value['factura'], this.repuesto.idRepuesto, this.fechaInicioFormato, this.fechaFinFormato).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(!this.porFactura && this.porRepuesto && this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByRepuestoAndFechaAndServicioCorrelativoLike(this.repuesto.idRepuesto, this.fechaInicioFormato, this.fechaFinFormato, parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && !this.porRepuesto && this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndFechaAndServicioCorrelativoLike(this.form.value['factura'], this.fechaInicioFormato, this.fechaFinFormato, parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      } else if(this.porFactura && this.porRepuesto && this.porFecha && this.porServicio) {
  
        this.inventarios = [];
        this.inventarioService.getByFacturaCompraCodigoLikeAndRepuestoAndFechaAndServicioCorrelativoLike(this.form.value['factura'], this.repuesto.idRepuesto, this.fechaInicioFormato, this.fechaFinFormato, parseInt(this.form.value['servicio'])).subscribe(data => {
          if(data!=null) {
            if(data.length > 0) {
              for(let d of data) {
                this.inventarios.push(this.convertirInventarioFechaHora(d));
              }
            }
          }
          this.spinner.hide()
        });
  
      }
    }  else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  } 

  enviarInventarioEdicion(inventario : Inventario) {
    this.dataService.setInventarioCambio(inventario);
  }

  abrirInventarioDialogoEliminar(inventario : Inventario) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.INVENTARIOS, PermisoUtil.ELIMINAR)) {
      let dialogRef = this.dialog.open(InventarioDialogoEliminarComponent, {
        width: 'auto',
        height: 'auto',
        data: inventario
      });
  
      dialogRef.afterClosed().subscribe(data => {
        this.inventarios = [];
        this.form.reset();
        this.porFactura = false;
        this.porFecha = false;
        this.porRepuesto = false;
        this.porServicio = false;
        this.form.get('fechaInicio').disable();
        this.form.get('fechaFin').disable();
        this.form.get('servicio').disable();
        this.form.get('repuesto').disable();
        this.form.get('factura').disable();
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  evaluarBotonBuscar() {
    if(this.form.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }
}
