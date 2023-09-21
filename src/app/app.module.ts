import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import { ConfirmationService, MessageService } from "primeng/api";

import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {BadgeModule} from 'primeng/badge';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipModule} from 'primeng/chip';
import {ChipsModule} from 'primeng/chips';
/* import {CodeHighlighterModule} from 'primeng/codehighlighter'; */
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
/* import {FullCalendarModule} from 'primeng/fullcalendar'; */
import {GalleriaModule} from 'primeng/galleria';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
/* import {LightboxModule} from 'primeng/lightbox'; */
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SkeletonModule} from 'primeng/skeleton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';

import {AppCodeModule} from './menu/app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './menu/app.main.component';
import {AppConfigComponent} from './menu/app.config.component';
import {AppMenuComponent} from './menu/app.menu.component';
import {AppMenuitemComponent} from './menu/app.menuitem.component';
import {AppInlineMenuComponent} from './menu/app.inlinemenu.component';
import {AppRightMenuComponent} from './menu/app.rightmenu.component';
import {AppBreadcrumbComponent} from './menu/app.breadcrumb.component';
import {AppTopBarComponent} from './menu/app.topbar.component';
import {AppFooterComponent} from './menu/app.footer.component';
import {DashboardComponent} from './demo/view/dashboard.component';
import {DashboardAnalyticsComponent} from './demo/view/dashboardanalytics.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
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
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {AppLandingComponent} from './pages/app.landing.component';

import {CountryService} from './demo/service/countryservice';
import {CustomerService} from './demo/service/customerservice';
import {EventService} from './demo/service/eventservice';
import {IconService} from './demo/service/iconservice';
import {NodeService} from './demo/service/nodeservice';
import {PhotoService} from './demo/service/photoservice';
import {ProductService} from './demo/service/productservice';

import {MenuService} from './menu/app.menu.service';
import {AppBreadcrumbService} from './menu/app.breadcrumb.service';
import {AppContactusComponent} from './pages/app.contactus.component';
import { LocalComponent } from './paginas/tablas/local/local.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BlockUIModule} from 'primeng/blockui';
import { TipoProductoComponent } from './paginas/tablas/tipoproducto/tipoproducto.component';
import { MarcaComponent } from './paginas/tablas/marca/marca.component';
import { PresentacionComponent } from './paginas/tablas/presentacion/presentacion.component';
import { UnidadComponent } from './paginas/tablas/unidad/unidad.component';
import { BancoComponent } from './paginas/tablas/banco/banco.component';
import { ProductoComponent } from './paginas/productos/producto/producto.component';

import { DecimalesPipe } from './_pipes/decimales.pipe';
import { OnlydecimalesPipe } from './_pipes/onlydecimales.pipe';
import { AsignarunidadesComponent } from './paginas/productos/asignarunidades/asignarunidades.component';
import { StocksComponent } from './paginas/productos/stocks/stocks.component';
import { LeftpathPipe } from './_pipes/leftpath.pipe';
import { PassfechavistaPipe } from './_pipes/passfechavista.pipe';
import { InventarioComponent } from './paginas/almacen/inventario/inventario.component';
import { GestionlotesComponent } from './paginas/almacen/gestionlotes/gestionlotes.component';
import { ProductosbajostockComponent } from './paginas/almacen/productosbajostock/productosbajostock.component';
import { ProductosvencidosComponent } from './paginas/almacen/productosvencidos/productosvencidos.component';
import { ListarentradasalidaproductosComponent } from './paginas/almacen/listarentradasalidaproductos/listarentradasalidaproductos.component';
import { ClienteComponent } from './paginas/ventas/cliente/cliente.component';
import { VentaComponent } from './paginas/ventas/venta/venta.component';
import { CatalogoComponent } from './paginas/servicios/catalogo/catalogo.component';
import { LoginComponent } from './paginas/login/login/login.component';

import { JwtModule } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { Not403Component } from './paginas/errors/not403/not403.component';
import { Not404Component } from './paginas/errors/not404/not404.component';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { SoloNumerosDirective } from './solo-numeros.directive';

export function tokenGetter() {
    return sessionStorage.getItem(environment.TOKEN_NAME);
  }

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        /* CodeHighlighterModule, */
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        /* FullCalendarModule, */
        GalleriaModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        /* LightboxModule, */
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TimelineModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        ProgressSpinnerModule,
        BlockUIModule,
        JwtModule.forRoot({
            config: {
              tokenGetter: tokenGetter,
              allowedDomains: [environment.HOST.substring(7)],
              disallowedRoutes: [`http://${environment.HOST.substring(7)}/api/security/login/enviarCorreo`, `http://${environment.HOST.substring(7)}/api/security/oauth/token` , `http://${environment.HOST.substring(7)}/api/security/tokens/anular`],
            },
          }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppInlineMenuComponent,
        AppRightMenuComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardComponent,
        DashboardAnalyticsComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        DisplayComponent,
        ElevationComponent,
        FlexboxComponent,
        GridComponent,
        IconsComponent,
        WidgetsComponent,
        SpacingComponent,
        TypographyComponent,
        TextComponent,
        AppCrudComponent,
        AppCalendarComponent,
        AppLoginComponent,
        AppLandingComponent,
        AppInvoiceComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppTimelineDemoComponent,
        AppContactusComponent,
        LocalComponent,
        TipoProductoComponent,
        MarcaComponent,
        PresentacionComponent,
        UnidadComponent,
        BancoComponent,
        ProductoComponent,
        DecimalesPipe,
        OnlydecimalesPipe,
        AsignarunidadesComponent,
        StocksComponent,
        LeftpathPipe,
        PassfechavistaPipe,
        InventarioComponent,
        GestionlotesComponent,
        ProductosbajostockComponent,
        ProductosvencidosComponent,
        ListarentradasalidaproductosComponent,
        ClienteComponent,
        VentaComponent,
        CatalogoComponent,
        LoginComponent,
        Not403Component,
        Not404Component,
        SoloNumerosDirective
    ],
    providers: [
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MenuService, AppBreadcrumbService, ConfirmationService, MessageService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ServerErrorsInterceptor,
          multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
