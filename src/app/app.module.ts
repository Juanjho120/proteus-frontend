import { DialogoAgregarPermisoComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/dialogo-agregar-permiso/dialogo-agregar-permiso.component';
import { environment } from './../environments/environment';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarcaAutoComponent } from './pages/marca-auto/marca-auto.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MarcaRepuestoComponent } from './pages/marca-repuesto/marca-repuesto.component';
import { ServicioTipoComponent } from './pages/servicio-tipo/servicio-tipo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarcaAutoDialogoComponent } from './pages/marca-auto/marca-auto-dialogo/marca-auto-dialogo.component';
import { MarcaAutoDialogoEliminarComponent } from './pages/marca-auto/marca-auto-dialogo-eliminar/marca-auto-dialogo-eliminar.component';
import { MarcaRepuestoDialogoComponent } from './pages/marca-repuesto/marca-repuesto-dialogo/marca-repuesto-dialogo.component';
import { MarcaRepuestoDialogoEliminarComponent } from './pages/marca-repuesto/marca-repuesto-dialogo-eliminar/marca-repuesto-dialogo-eliminar.component';
import { ServicioTipoDialogoComponent } from './pages/servicio-tipo/servicio-tipo-dialogo/servicio-tipo-dialogo.component';
import { ServicioTipoDialogoEliminarComponent } from './pages/servicio-tipo/servicio-tipo-dialogo-eliminar/servicio-tipo-dialogo-eliminar.component';
import { CardexComponent } from './pages/cardex/cardex.component';
import { CardexDialogoComponent } from './pages/cardex/cardex-dialogo/cardex-dialogo.component';
import { CardexNuevoComponent } from './pages/cardex/cardex-nuevo/cardex-nuevo.component';
import { CardexDialogoEliminarComponent } from './pages/cardex/cardex-dialogo-eliminar/cardex-dialogo-eliminar.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { InventarioRegistroComponent } from './pages/inventario/inventario-registro/inventario-registro.component';
import { InventarioBusquedaComponent } from './pages/inventario/inventario-busqueda/inventario-busqueda.component';
import { InventarioEntradaSalidaComponent } from './pages/inventario/inventario-entrada-salida/inventario-entrada-salida.component';
import { SegmentoComponent } from './pages/segmento/segmento.component';
import { SegmentoIngresoBusquedaComponent } from './pages/segmento/segmento-ingreso-busqueda/segmento-ingreso-busqueda.component';
import { SegmentoIngresoBusquedaDialogoComponent } from './pages/segmento/segmento-ingreso-busqueda/segmento-ingreso-busqueda-dialogo/segmento-ingreso-busqueda-dialogo.component';
import { SegmentoIngresoBusquedaDialogoEliminarComponent } from './pages/segmento/segmento-ingreso-busqueda/segmento-ingreso-busqueda-dialogo-eliminar/segmento-ingreso-busqueda-dialogo-eliminar.component';
import { SegmentoCreditoPagoComponent } from './pages/segmento/segmento-credito-pago/segmento-credito-pago.component';
import { SegmentoPagoDialogoComponent } from './pages/segmento/segmento-credito-pago/segmento-pago-dialogo/segmento-pago-dialogo.component';
import { SegmentoPagoDialogoEliminarComponent } from './pages/segmento/segmento-credito-pago/segmento-pago-dialogo-eliminar/segmento-pago-dialogo-eliminar.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorDialogoComponent } from './pages/proveedor/proveedor-dialogo/proveedor-dialogo.component';
import { ProveedorDialogoEliminarComponent } from './pages/proveedor/proveedor-dialogo-eliminar/proveedor-dialogo-eliminar.component';
import { AsesorDialogoComponent } from './pages/proveedor/asesor-dialogo/asesor-dialogo.component';
import { AsesorDialogoEliminarComponent } from './pages/proveedor/asesor-dialogo-eliminar/asesor-dialogo-eliminar.component';
import { PlacaComponent } from './pages/placa/placa.component';
import { PlacaDialogoEliminarComponent } from './pages/placa/placa-dialogo-eliminar/placa-dialogo-eliminar.component';
import { FacturaCompraComponent } from './pages/factura-compra/factura-compra.component';
import { FacturaCompraIngresoComponent } from './pages/factura-compra/factura-compra-ingreso/factura-compra-ingreso.component';
import { FacturaCompraBusquedaComponent } from './pages/factura-compra/factura-compra-busqueda/factura-compra-busqueda.component';
import { FacturaCompraDialogoEliminarComponent } from './pages/factura-compra/factura-compra-busqueda/factura-compra-dialogo-eliminar/factura-compra-dialogo-eliminar.component';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { CotizacionDialogoBuscarComponent } from './pages/cotizacion/cotizacion-dialogo-buscar/cotizacion-dialogo-buscar.component';
import { CotizacionDialogoEliminarComponent } from './pages/cotizacion/cotizacion-dialogo-eliminar/cotizacion-dialogo-eliminar.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { ServicioIngresoEdicionComponent } from './pages/servicio/servicio-ingreso-edicion/servicio-ingreso-edicion.component';
import { ServicioBusquedaComponent } from './pages/servicio/servicio-busqueda/servicio-busqueda.component';
import { ServicioResumenComponent } from './pages/servicio/servicio-resumen/servicio-resumen.component';
import { ServicioDialogoBuscarComponent } from './pages/servicio/servicio-ingreso-edicion/servicio-dialogo-buscar/servicio-dialogo-buscar.component';
import { ServicioDialogoEliminarComponent } from './pages/servicio/servicio-ingreso-edicion/servicio-dialogo-eliminar/servicio-dialogo-eliminar.component';
import { ChecklistComponent } from './pages/checklist/checklist.component';
import { ChecklistIngresoEdicionComponent } from './pages/checklist/checklist-ingreso-edicion/checklist-ingreso-edicion.component';
import { ChecklistBusquedaComponent } from './pages/checklist/checklist-busqueda/checklist-busqueda.component';
import { ChecklistDialogoBuscarComponent } from './pages/checklist/checklist-ingreso-edicion/checklist-dialogo-buscar/checklist-dialogo-buscar.component';
import { FinanzasComponent } from './pages/finanzas/finanzas.component';
import { FinanzasCreditoPagoComponent } from './pages/finanzas/finanzas-credito-pago/finanzas-credito-pago.component';
import { CajaChicaComponent } from './pages/finanzas/caja-chica/caja-chica.component';
import { CuentaBancariaComponent } from './pages/finanzas/cuenta-bancaria/cuenta-bancaria.component';
import { CreditoProveedorDetalleDialogoComponent } from './pages/finanzas/finanzas-credito-pago/credito-proveedor-detalle-dialogo/credito-proveedor-detalle-dialogo.component';
import { PagoProveedorDialogoComponent } from './pages/finanzas/finanzas-credito-pago/pago-proveedor-dialogo/pago-proveedor-dialogo.component';
import { PagoProveedorDialogoEliminarComponent } from './pages/finanzas/finanzas-credito-pago/pago-proveedor-dialogo-eliminar/pago-proveedor-dialogo-eliminar.component';
import { CajaChicaDialogoEditarComponent } from './pages/finanzas/caja-chica/caja-chica-dialogo-editar/caja-chica-dialogo-editar.component';
import { CajaChicaDialogoEliminarComponent } from './pages/finanzas/caja-chica/caja-chica-dialogo-eliminar/caja-chica-dialogo-eliminar.component';
import { CuentaBancariaDialogoEditarComponent } from './pages/finanzas/cuenta-bancaria/cuenta-bancaria-dialogo-editar/cuenta-bancaria-dialogo-editar.component';
import { CuentaBancariaDialogoEliminarComponent } from './pages/finanzas/cuenta-bancaria/cuenta-bancaria-dialogo-eliminar/cuenta-bancaria-dialogo-eliminar.component';
import { BancoDialogoEliminarComponent } from './pages/finanzas/cuenta-bancaria/banco/banco-dialogo-eliminar/banco-dialogo-eliminar.component';
import { BancoDialogoEditarComponent } from './pages/finanzas/cuenta-bancaria/banco/banco-dialogo-editar/banco-dialogo-editar.component';
import { CuentaBancariaTipoDialogoEditarComponent } from './pages/finanzas/cuenta-bancaria/cuenta-bancaria-tipo/cuenta-bancaria-tipo-dialogo-editar/cuenta-bancaria-tipo-dialogo-editar.component';
import { CuentaBancariaTipoDialogoEliminarComponent } from './pages/finanzas/cuenta-bancaria/cuenta-bancaria-tipo/cuenta-bancaria-tipo-dialogo-eliminar/cuenta-bancaria-tipo-dialogo-eliminar.component';
import { MonedaDialogoEditarComponent } from './pages/finanzas/cuenta-bancaria/moneda/moneda-dialogo-editar/moneda-dialogo-editar.component';
import { MonedaDialogoEliminarComponent } from './pages/finanzas/cuenta-bancaria/moneda/moneda-dialogo-eliminar/moneda-dialogo-eliminar.component';
import { PagoProveedorDetalleDialogoComponent } from './pages/finanzas/finanzas-credito-pago/pago-proveedor-detalle-dialogo/pago-proveedor-detalle-dialogo.component';
import { ChequeBoletaComponent } from './pages/finanzas/cheque-boleta/cheque-boleta.component';
import { ChequeDialogoEliminarComponent } from './pages/finanzas/cheque-boleta/cheque-dialogo-eliminar/cheque-dialogo-eliminar.component';
import { BoletaDialogoEliminarComponent } from './pages/finanzas/cheque-boleta/boleta-dialogo-eliminar/boleta-dialogo-eliminar.component';
import { SegmentoCreditoDetalleDialogoComponent } from './pages/segmento/segmento-credito-pago/segmento-credito-detalle-dialogo/segmento-credito-detalle-dialogo.component';
import { SegmentoPagoDetalleDialogoComponent } from './pages/segmento/segmento-credito-pago/segmento-pago-detalle-dialogo/segmento-pago-detalle-dialogo.component';
import { ChecklistServicioDialogoComponent } from './pages/servicio/servicio-resumen/checklist-servicio-dialogo/checklist-servicio-dialogo.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { Not403Component } from './pages/not403/not403.component';
import { Not404Component } from './pages/not404/not404.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { FacturasComponent } from './pages/finanzas/facturas/facturas.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ProveedorMenorDialogoComponent } from './pages/proveedor/proveedor-menor-dialogo/proveedor-menor-dialogo.component';
import { ProveedorMenorDialogoEliminarComponent } from './pages/proveedor/proveedor-menor-dialogo-eliminar/proveedor-menor-dialogo-eliminar.component';
import { ModificacionComponent } from './pages/modificacion/modificacion.component';
import { DetalleCreacionDialogoComponent } from './pages/modificacion/detalle-creacion-dialogo/detalle-creacion-dialogo.component';
import { DetalleActualizacionDialogoComponent } from './pages/modificacion/detalle-actualizacion-dialogo/detalle-actualizacion-dialogo.component';
import { DetalleEliminacionDialogoComponent } from './pages/modificacion/detalle-eliminacion-dialogo/detalle-eliminacion-dialogo.component';
import { RecursosHumanosComponent } from './pages/recursos-humanos/recursos-humanos.component';
import { RecursoHumanoDialogoEliminarComponent } from './pages/recursos-humanos/recurso-humano-dialogo-eliminar/recurso-humano-dialogo-eliminar.component';
import { PersonalPuestoComponent } from './pages/personal-puesto/personal-puesto.component';
import { PersonalPuestoDialogoComponent } from './pages/personal-puesto/personal-puesto-dialogo/personal-puesto-dialogo.component';
import { PersonalPuestoDialogoEliminarComponent } from './pages/personal-puesto/personal-puesto-dialogo-eliminar/personal-puesto-dialogo-eliminar.component';
import { InventarioDialogoEliminarComponent } from './pages/inventario/inventario-busqueda/inventario-dialogo-eliminar/inventario-dialogo-eliminar.component';
import { CreditoProveedorDetalleEdicionComponent } from './pages/finanzas/finanzas-credito-pago/credito-proveedor-detalle-edicion/credito-proveedor-detalle-edicion.component';
import { NotaCreditoDialogoComponent } from './pages/finanzas/finanzas-credito-pago/nota-credito-dialogo/nota-credito-dialogo.component';
import { NotaCreditoAdjuntoDialogoComponent } from './pages/finanzas/finanzas-credito-pago/nota-credito-adjunto-dialogo/nota-credito-adjunto-dialogo.component';
import { FacturaCompraMenorDetalleDialogoComponent } from './pages/servicio/servicio-resumen/factura-compra-menor-detalle-dialogo/factura-compra-menor-detalle-dialogo.component';
import { FacturaCompraMenorIngresoComponent } from './pages/factura-compra/factura-compra-menor-ingreso/factura-compra-menor-ingreso.component';
import { FacturaCompraMenorBusquedaComponent } from './pages/factura-compra/factura-compra-menor-busqueda/factura-compra-menor-busqueda.component';
import { FacturaCompraMenorDialogoEliminarComponent } from './pages/factura-compra/factura-compra-menor-busqueda/factura-compra-menor-dialogo-eliminar/factura-compra-menor-dialogo-eliminar.component';
import { CotizacionClienteInformacionDialogoComponent } from './pages/cotizacion/cotizacion-cliente-informacion-dialogo/cotizacion-cliente-informacion-dialogo.component';
import { UsuarioPermisoComponent } from './pages/usuario-permiso/usuario-permiso.component';
import { ConsultaEdicionUsuarioPermisoComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/consulta-edicion-usuario-permiso.component';
import { CreacionUsuarioComponent } from './pages/usuario-permiso/creacion-usuario/creacion-usuario.component';
import { DialogoEliminarPermisoComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/dialogo-eliminar-permiso/dialogo-eliminar-permiso.component';
import { DialogoEliminarTablaComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/dialogo-eliminar-tabla/dialogo-eliminar-tabla.component';
import { DialogoEliminarVentanaComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/dialogo-eliminar-ventana/dialogo-eliminar-ventana.component';
import { DialogoEliminarUsuarioComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/dialogo-eliminar-usuario/dialogo-eliminar-usuario.component';
import { DialogoEditarUsuarioComponent } from './pages/usuario-permiso/consulta-edicion-usuario-permiso/dialogo-editar-usuario/dialogo-editar-usuario.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CreacionRolComponent } from './pages/usuario-permiso/creacion-rol/creacion-rol.component';
import { DialogoUsernameComponent } from './pages/usuario-permiso/creacion-usuario/dialogo-username/dialogo-username.component';
import { CuadrarPasswordDialogoComponent } from './pages/cardex/cuadrar-password-dialogo/cuadrar-password-dialogo.component';
import { AutorizacionComponent } from './pages/autorizacion/autorizacion.component';
import { AutorizacionPasswordDialogoComponent } from './pages/autorizacion/autorizacion-password-dialogo/autorizacion-password-dialogo.component';
import { LoaderService } from './_service/loader.service';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    SoporteComponent,
    MarcaAutoComponent,
    MarcaRepuestoComponent,
    ServicioTipoComponent,
    MarcaAutoDialogoComponent,
    MarcaAutoDialogoEliminarComponent,
    MarcaRepuestoDialogoComponent,
    MarcaRepuestoDialogoEliminarComponent,
    ServicioTipoDialogoComponent,
    ServicioTipoDialogoEliminarComponent,
    CardexComponent,
    CardexDialogoComponent,
    CardexNuevoComponent,
    CardexDialogoEliminarComponent,
    InventarioComponent,
    InventarioRegistroComponent,
    InventarioBusquedaComponent,
    InventarioEntradaSalidaComponent,
    SegmentoComponent,
    SegmentoIngresoBusquedaComponent,
    SegmentoIngresoBusquedaDialogoComponent,
    SegmentoIngresoBusquedaDialogoEliminarComponent,
    SegmentoCreditoPagoComponent,
    SegmentoPagoDialogoComponent,
    SegmentoPagoDialogoEliminarComponent,
    ProveedorComponent,
    ProveedorDialogoComponent,
    ProveedorDialogoEliminarComponent,
    AsesorDialogoComponent,
    AsesorDialogoEliminarComponent,
    PlacaComponent,
    PlacaDialogoEliminarComponent,
    FacturaCompraComponent,
    FacturaCompraIngresoComponent,
    FacturaCompraBusquedaComponent,
    FacturaCompraDialogoEliminarComponent,
    CotizacionComponent,
    CotizacionDialogoBuscarComponent,
    CotizacionDialogoEliminarComponent,
    ServicioComponent,
    ServicioIngresoEdicionComponent,
    ServicioBusquedaComponent,
    ServicioResumenComponent,
    ServicioDialogoBuscarComponent,
    ServicioDialogoEliminarComponent,
    ChecklistComponent,
    ChecklistIngresoEdicionComponent,
    ChecklistBusquedaComponent,
    ChecklistDialogoBuscarComponent,
    FinanzasComponent,
    FinanzasCreditoPagoComponent,
    CajaChicaComponent,
    CuentaBancariaComponent,
    CreditoProveedorDetalleDialogoComponent,
    PagoProveedorDialogoComponent,
    PagoProveedorDialogoEliminarComponent,
    CajaChicaDialogoEditarComponent,
    CajaChicaDialogoEliminarComponent,
    CuentaBancariaDialogoEditarComponent,
    CuentaBancariaDialogoEliminarComponent,
    BancoDialogoEliminarComponent,
    BancoDialogoEditarComponent,
    CuentaBancariaTipoDialogoEditarComponent,
    CuentaBancariaTipoDialogoEliminarComponent,
    MonedaDialogoEditarComponent,
    MonedaDialogoEliminarComponent,
    PagoProveedorDetalleDialogoComponent,
    ChequeBoletaComponent,
    ChequeDialogoEliminarComponent,
    BoletaDialogoEliminarComponent,
    SegmentoCreditoDetalleDialogoComponent,
    SegmentoPagoDetalleDialogoComponent,
    ChecklistServicioDialogoComponent,
    LoginComponent,
    Not403Component,
    Not404Component,
    RecuperarComponent,
    TokenComponent,
    FacturasComponent,
    ProveedorMenorDialogoComponent,
    ProveedorMenorDialogoEliminarComponent,
    ModificacionComponent,
    DetalleCreacionDialogoComponent,
    DetalleActualizacionDialogoComponent,
    DetalleEliminacionDialogoComponent,
    RecursosHumanosComponent,
    RecursoHumanoDialogoEliminarComponent,
    PersonalPuestoComponent,
    PersonalPuestoDialogoComponent,
    PersonalPuestoDialogoEliminarComponent,
    InventarioDialogoEliminarComponent,
    CreditoProveedorDetalleEdicionComponent,
    NotaCreditoDialogoComponent,
    NotaCreditoAdjuntoDialogoComponent,
    FacturaCompraMenorDetalleDialogoComponent,
    FacturaCompraMenorIngresoComponent,
    FacturaCompraMenorBusquedaComponent,
    FacturaCompraMenorDialogoEliminarComponent,
    CotizacionClienteInformacionDialogoComponent,
    UsuarioPermisoComponent,
    ConsultaEdicionUsuarioPermisoComponent,
    CreacionUsuarioComponent,
    DialogoAgregarPermisoComponent,
    DialogoEliminarPermisoComponent,
    DialogoEliminarTablaComponent,
    DialogoEliminarVentanaComponent,
    DialogoEliminarUsuarioComponent,
    DialogoEditarUsuarioComponent,
    PerfilComponent,
    CreacionRolComponent,
    DialogoUsernameComponent,
    CuadrarPasswordDialogoComponent,
    AutorizacionComponent,
    AutorizacionPasswordDialogoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config : {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.substring(7)],
        disallowedRoutes: [`http://${environment.HOST.substring(7)}/login/enviarCorreo`],
      },
    }),
  ],
  providers: [
    LoaderService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : ServerErrorsInterceptor,
      multi : true
    },
    { provide : LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
