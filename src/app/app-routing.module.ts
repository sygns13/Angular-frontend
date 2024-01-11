import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//login
import { LoginComponent } from './paginas/login/login/login.component';

//Fondo Principal padre
import {AppMainComponent} from './menu/app.main.component';

//tablas base
import {LocalComponent} from './paginas/tablas/local/local.component';
import {TipoProductoComponent} from './paginas/tablas/tipoproducto/tipoproducto.component';
import {MarcaComponent} from './paginas/tablas/marca/marca.component';
import {PresentacionComponent} from './paginas/tablas/presentacion/presentacion.component';
import {UnidadComponent} from './paginas/tablas/unidad/unidad.component';
import {BancoComponent} from './paginas/tablas/banco/banco.component';

//tablas almacen
import {ProductoComponent} from './paginas/productos/producto/producto.component';
import {InventarioComponent} from './paginas/almacen/inventario/inventario.component';
import {GestionlotesComponent} from './paginas/almacen/gestionlotes/gestionlotes.component';
import {ListarentradasalidaproductosComponent} from './paginas/almacen/listarentradasalidaproductos/listarentradasalidaproductos.component';
import {ProductosbajostockComponent} from './paginas/almacen/productosbajostock/productosbajostock.component';
import {ProductosvencidosComponent} from './paginas/almacen/productosvencidos/productosvencidos.component';

//tablas servicios
import {CatalogoComponent} from './paginas/servicios/catalogo/catalogo.component';

//tablas ventas
import {ClienteComponent} from './paginas/ventas/cliente/cliente.component';
import {VentaComponent} from './paginas/ventas/venta/venta.component';
import {VentasrealizadasComponent} from './paginas/ventas/ventasrealizadas/ventasrealizadas.component';
import { CobrarComponent } from './paginas/ventas/cobrar/cobrar.component';

//tablas compras
import { ProveedorComponent } from './paginas/compras/proveedor/proveedor.component';
import { EntradastockComponent } from './paginas/compras/entradastock/entradastock.component';
import { ComprasrealizadasComponent } from './paginas/compras/comprasrealizadas/comprasrealizadas.component';
import { PagarComponent } from './paginas/compras/pagar/pagar.component';

//tablas caja
import { InitcomprobanteComponent } from './paginas/caja/initcomprobante/initcomprobante.component';
import { DetallemetodopagoComponent } from './paginas/caja/detallemetodopago/detallemetodopago.component';
import { IngresosalidacajaComponent } from './paginas/caja/ingresosalidacaja/ingresosalidacaja.component';
import { CajaDiariaComponent } from './paginas/caja/caja-diaria/caja-diaria.component';

//tablas configs
import { SettingsComponent } from './paginas/configs/settings/settings.component';
import { UsuariosComponent } from './paginas/configs/usuarios/usuarios.component';

//REPORTES
import { ClienterepComponent } from './paginas/reporte/clienterep/clienterep.component';
import { ProveedorrepComponent } from './paginas/reporte/proveedorrep/proveedorrep.component';
import { MarcarepComponent } from './paginas/reporte/marcarep/marcarep.component';
import { TipoproductorepComponent } from './paginas/reporte/tipoproductorep/tipoproductorep.component';

import { ProductosalmacenComponent } from './paginas/reporte/productosalmacen/productosalmacen.component';
import { ProductosprecioComponent } from './paginas/reporte/productosprecio/productosprecio.component';

import { ComprasgeneralesComponent } from './paginas/reporte/comprasgenerales/comprasgenerales.component';
import { ComprasdetalladasComponent } from './paginas/reporte/comprasdetalladas/comprasdetalladas.component';
import { CuentaspagarComponent } from './paginas/reporte/cuentaspagar/cuentaspagar.component';
import { CuentaspagardetailComponent } from './paginas/reporte/cuentaspagardetail/cuentaspagardetail.component';

import { VentasgeneralesComponent } from './paginas/reporte/ventasgenerales/ventasgenerales.component';
import { VentasdetalladasComponent } from './paginas/reporte/ventasdetalladas/ventasdetalladas.component';
import { VentastopproductosComponent } from './paginas/reporte/ventastopproductos/ventastopproductos.component';
import { CuentascobrarComponent } from './paginas/reporte/cuentascobrar/cuentascobrar.component';
import { CuentascobrardetailComponent } from './paginas/reporte/cuentascobrardetail/cuentascobrardetail.component';
import { CajaresumenComponent } from './paginas/reporte/cajaresumen/cajaresumen.component';
import { IngresosventasComponent } from './paginas/reporte/ingresosventas/ingresosventas.component';
import { IngresosotrosComponent } from './paginas/reporte/ingresosotros/ingresosotros.component';
import { EgresoscomprasComponent } from './paginas/reporte/egresoscompras/egresoscompras.component';

import {DashboardComponent} from './demo/view/dashboard.component';
import {DashboardAnalyticsComponent} from './demo/view/dashboardanalytics.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MediaDemoComponent} from './demo/view/mediademo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';

import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppContactusComponent} from './pages/app.contactus.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';
import {AppLandingComponent} from './pages/app.landing.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
import {DisplayComponent} from './utilities/display.component';
import {ElevationComponent} from './utilities/elevation.component';
import {FlexboxComponent} from './utilities/flexbox.component';
import {GridComponent} from './utilities/grid.component';
import {IconsComponent} from './utilities/icons.component';
import {WidgetsComponent} from './utilities/widgets.component';
import {SpacingComponent} from './utilities/spacing.component';
import {TypographyComponent} from './utilities/typography.component';
import {TextComponent} from './utilities/text.component';
import {AppCrudComponent} from './pages/app.crud.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';
import { GuardService } from './_service/guard.service';

//Errores y seguridad de navegacion
import { Not403Component } from './paginas/errors/not403/not403.component';
import { Not404Component } from './paginas/errors/not404/not404.component';


const routes: Routes = [

  {
    path: '', redirectTo: 'login', pathMatch:'full'
    
  },
  {
    path: 'login', component: LoginComponent,
    children: [
     /* {path: '', component: DashboardComponent}, */
    ]
  },
  {
    path: 'principal', component: AppMainComponent, canActivate: [GuardService] /*,
    children: [
      {path: 'principal', component: DashboardComponent}, 
    ]*/
  },
  {
    path: 'tablas', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'locales', component: LocalComponent},
     {path: 'tipo_productos', component: TipoProductoComponent},
     {path: 'marcas', component: MarcaComponent},
     {path: 'presentaciones', component: PresentacionComponent},
     {path: 'unidades', component: UnidadComponent},
     {path: 'bancos', component: BancoComponent},
    ]
  },
  {
    path: 'almacen', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'productos', component: ProductoComponent},
     {path: 'inventario', component: InventarioComponent},
     {path: 'gestion_stocks', component: GestionlotesComponent},
     {path: 'reporte_stocks', component: ListarentradasalidaproductosComponent},
     {path: 'productos_bajo_stock', component: ProductosbajostockComponent},
     {path: 'productos_vencidos', component: ProductosvencidosComponent},
    ]
  },
  {
    path: 'servicios', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'catalogo', component: CatalogoComponent},
    ]
  },
  {
    path: 'ventas', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'clientes', component: ClienteComponent},
     {path: 'venta', component: VentaComponent},
     {path: 'venta_realizada', component: VentasrealizadasComponent},
     {path: 'cobrar', component: CobrarComponent},
    ]
  },
  {
    path: 'compras', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'proveedors', component: ProveedorComponent},
     {path: 'compra', component: EntradastockComponent},
     {path: 'compra_realizada', component: ComprasrealizadasComponent},
     {path: 'pagar', component: PagarComponent},
    ]
  },
  {
    path: 'caja', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'movimientos-caja', component: IngresosalidacajaComponent},
     {path: 'caja-diaria', component: CajaDiariaComponent},
     {path: 'init-comprobantes', component: InitcomprobanteComponent},
     {path: 'metodos-pagos', component: DetallemetodopagoComponent},
     /* {path: 'venta', component: VentaComponent} */
    ]
  },
  {
    path: 'configs', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'settings', component: SettingsComponent},
     {path: 'usuarios', component: UsuariosComponent},
    ]
  },
  {
    path: 'reporte', component: AppMainComponent, canActivate: [GuardService],
    children: [
     {path: 'clientes', component: ClienterepComponent},
     {path: 'proveedores', component: ProveedorrepComponent},
     {path: 'marcas', component: MarcarepComponent},
     {path: 'tipo-productos', component: TipoproductorepComponent},

     {path: 'productos-almacen', component: ProductosalmacenComponent},
     {path: 'productos-precios', component: ProductosprecioComponent},

     {path: 'compras-generales', component: ComprasgeneralesComponent},
     {path: 'compras-detalladas', component: ComprasdetalladasComponent},
     {path: 'pago-compras', component: CuentaspagarComponent},
     {path: 'pago-detallado', component: CuentaspagardetailComponent},

     {path: 'ventas-generales', component: VentasgeneralesComponent},
     {path: 'ventas-detalladas', component: VentasdetalladasComponent},
     {path: 'top-productos-vendidos', component: VentastopproductosComponent},
     {path: 'cobro-ventas', component: CuentascobrarComponent},
     {path: 'cobro-detallado', component: CuentascobrardetailComponent},

     {path: 'resumen-caja', component: CajaresumenComponent},
     {path: 'ingresos-ventas', component: IngresosventasComponent},
     {path: 'ingresos-otros', component: IngresosotrosComponent},
     {path: 'egresos-compras', component: EgresoscomprasComponent},
    ]
  },
  { path: 'not-403', component: Not403Component },
  { path: 'not-404', component: Not404Component },
  {
    path: '**',
    redirectTo: 'not-404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
