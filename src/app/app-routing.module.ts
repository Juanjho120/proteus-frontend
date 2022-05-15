import { AutorizacionComponent } from './pages/autorizacion/autorizacion.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { UsuarioPermisoComponent } from './pages/usuario-permiso/usuario-permiso.component';
import { RecursosHumanosComponent } from './pages/recursos-humanos/recursos-humanos.component';
import { ModificacionComponent } from './pages/modificacion/modificacion.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { Not404Component } from './pages/not404/not404.component';
import { Not403Component } from './pages/not403/not403.component';
import { GuardService } from './_service/guard.service';
import { LoginComponent } from './pages/login/login.component';
import { FinanzasComponent } from './pages/finanzas/finanzas.component';
import { ChecklistComponent } from './pages/checklist/checklist.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { FacturaCompraComponent } from './pages/factura-compra/factura-compra.component';
import { PlacaComponent } from './pages/placa/placa.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { SegmentoComponent } from './pages/segmento/segmento.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { CardexNuevoComponent } from './pages/cardex/cardex-nuevo/cardex-nuevo.component';
import { CardexComponent } from './pages/cardex/cardex.component';
import { ServicioTipoComponent } from './pages/servicio-tipo/servicio-tipo.component';
import { MarcaRepuestoComponent } from './pages/marca-repuesto/marca-repuesto.component';
import { MarcaAutoComponent } from './pages/marca-auto/marca-auto.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent, canActivate : [GuardService]},
  { path: 'soporte', component: SoporteComponent, canActivate : [GuardService]},
  { path: 'marcas-autos', component: MarcaAutoComponent, canActivate : [GuardService]},
  { path: 'marcas-repuestos', component: MarcaRepuestoComponent, canActivate : [GuardService]},
  { path: 'servicio-tipos', component: ServicioTipoComponent, canActivate : [GuardService]},
  { path: 'cardex', component: CardexComponent, children : [
    { path : 'nuevo/:idSucursal', component : CardexNuevoComponent }
  ], canActivate : [GuardService]},
  { path: 'inventario', component: InventarioComponent, canActivate : [GuardService]},
  { path: 'segmento', component: SegmentoComponent, canActivate : [GuardService]},
  { path: 'proveedor', component: ProveedorComponent, canActivate : [GuardService]},
  { path: 'placa', component: PlacaComponent, canActivate : [GuardService]},
  { path: 'factura-compra', component: FacturaCompraComponent, canActivate : [GuardService]},
  { path: 'cotizacion', component: CotizacionComponent, canActivate : [GuardService]},
  { path: 'servicio', component: ServicioComponent, canActivate : [GuardService]},
  { path: 'checklist', component: ChecklistComponent, canActivate : [GuardService]},
  { path: 'finanzas', component: FinanzasComponent, canActivate : [GuardService]},
  { path: 'autorizaciones', component: AutorizacionComponent, canActivate : [GuardService]},
  { path: 'modificacion', component: ModificacionComponent, canActivate : [GuardService]},
  { path: 'recurso-humano', component: RecursosHumanosComponent, canActivate : [GuardService]},
  { path: 'usuario-permiso', component: UsuarioPermisoComponent, canActivate : [GuardService]},
  { path: 'perfil', component: PerfilComponent, canActivate : [GuardService]},
  { path: 'not-403', component: Not403Component},
  { path: 'not-404', component: Not404Component},
  {
    path : 'recuperar', component: RecuperarComponent, children: [
      { path: ':token', component: TokenComponent }
    ]
  },
  { path: 'login', component: LoginComponent},
  { path : '', redirectTo: 'login', pathMatch: 'full' },
  { path : '**', redirectTo: 'not-404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
