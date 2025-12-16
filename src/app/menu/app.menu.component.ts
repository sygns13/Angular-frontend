import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ConfigsService } from '../_service/configs.service';
import { Config } from '../_model/config';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    pk_cajasEnabled: string = "cajas_enabled";
    configCajasEnabled = new Config();
    verModulosCajas: boolean = false;

    constructor(public app: AppComponent, private configsService: ConfigsService) { }

    ngOnInit() {
        this.configsService.initConfigCajas(); // Inicializar estado global

        this.configsService.verModulosCajas.subscribe(estado => {
            this.verModulosCajas = estado;
            this.establecerMenu();
        });
    }

    establecerMenu() {
        this.model = [
            {
                label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/principal']
                /*items: [
                    {label: 'Dashboard Sales', icon: 'pi pi-fw pi-home', routerLink: ['/'], badge: '4', badgeClass: 'p-badge-info'},
                    {label: 'Dashboard Analytics', icon: 'pi pi-fw pi-home',
                        routerLink: ['/favorites/dashboardanalytics'], badge: '2', badgeClass: 'p-badge-success'}
                ]*/
            },
            {
                label: 'Configuraciones', icon: 'pi pi-fw pi-cog', styleClass: 'menu-label-black',
                items: [
                    { label: 'Configuraciones', icon: 'pi pi-fw pi-cog', routerLink: ['/configs/settings'] },
                    { label: 'Gestión de Usuarios', icon: 'pi pi-fw pi-user-edit', routerLink: ['/configs/usuarios'] },
                    { label: 'Config Métodos de Pago', icon: 'pi pi-fw pi-mobile', routerLink: ['/configs/metodos-pagos'] },
                    { label: 'Iniciar Comprobantes', icon: 'pi pi-fw pi-file', routerLink: ['/configs/init-comprobantes'] },
                ]
            }
        ];

        if (this.verModulosCajas) {
            this.model.push(
                {
                    label: 'Gestión de Cajas de Ventas', icon: 'pi pi-fw pi-wallet',
                    items: [
                        { label: 'Registro de Cajas de Ventas', icon: 'pi pi-fw pi-table', routerLink: ['/caja/cajas'] },
                        { label: 'Gestión de Caja de Ventas', icon: 'pi pi-fw pi-inbox', routerLink: ['/caja/gestion'] },
                    ]
                }
            );
        }

        this.model.push(
            {
                label: 'Tablas Base', icon: 'pi pi-fw pi-folder-open',
                items: [
                    { label: 'Gestión de Locales', icon: 'pi pi-fw pi-home', routerLink: ['/tablas/locales'] },
                    { label: 'Tipos de Productos', icon: 'pi pi-fw pi-list', routerLink: ['/tablas/tipo_productos'] },
                    { label: 'Gestión de Marcas', icon: 'pi pi-fw pi-list', routerLink: ['/tablas/marcas'] },
                    { label: 'Presentaciones de Productos', icon: 'pi pi-fw pi-bookmark', routerLink: ['/tablas/presentaciones'] },
                    { label: 'Gestión de Unidades', icon: 'pi pi-fw pi-table', routerLink: ['/tablas/unidades'] },
                    /* {label: 'Registro de Bancos', icon: 'pi pi-fw pi-home', routerLink: ['/tablas/bancos']} */
                ]
            },
            {
                label: 'Almacén', icon: 'pi pi-fw pi-inbox',
                items: [
                    { label: 'Catálogo de Productos', icon: 'pi pi-fw pi-camera', routerLink: ['/almacen/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-briefcase', routerLink: ['/almacen/inventario'] },
                    { label: 'Gestión de Salidas e Ingresos Libres de Productos', icon: 'pi pi-fw pi-sort', routerLink: ['/almacen/gestion_stocks'] },
                    { label: 'Reporte de de Salidas e Ingresos Libres de Productos', icon: 'pi pi-fw pi-list', routerLink: ['/almacen/reporte_stocks'] },
                    { label: 'Productos Bajos de Stock', icon: 'pi pi-fw pi-angle-double-down', routerLink: ['/almacen/productos_bajo_stock'] },
                    { label: 'productos Vencidos', icon: 'pi pi-fw pi-backward', routerLink: ['/almacen/productos_vencidos'] },
                ]
            },
            /* {
                label: 'Servicios', icon: 'pi pi-fw pi-calendar',
                items: [
                    {label: 'Catálogo de Servicios', icon: 'pi pi-fw pi-camera', routerLink: ['/servicios/catalogo']},
                ]
            },*/
            {
                label: 'Ventas', icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    { label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/ventas/clientes'] },
                    { label: 'Venta de Productos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/ventas/venta'] },
                    { label: 'Ventas Realizadas', icon: 'pi pi-fw pi-inbox', routerLink: ['/ventas/venta_realizada'] },
                    /* {label: 'Resúmenes de Ventas', icon: 'pi pi-fw pi-sliders-h', routerLink: ['utilities/flexbox']}, */
                    { label: 'Cuentas por Cobrar', icon: 'pi pi-fw pi-money-bill', routerLink: ['/ventas/cobrar'] }
                ]
            },
            {
                label: 'Compras', icon: 'pi pi-fw pi-compass',
                items: [
                    { label: 'Proveedores', icon: 'pi pi-fw pi-user-plus', routerLink: ['/compras/proveedors'] },
                    /* {label: 'Cuentas Bancarias', icon: 'pi pi-fw pi-table', routerLink: ['utilities/display']}, */
                    { label: 'Compras a Proveedores', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/compras/compra'] },
                    { label: 'Compras Realizadas', icon: 'pi pi-fw pi-list', routerLink: ['/compras/compra_realizada'] },
                    { label: 'Cuentas por Pagar', icon: 'pi pi-fw pi-star', routerLink: ['/compras/pagar'] }
                ]
            },
            {
                label: 'Tesorería Sucursal', icon: 'pi pi-fw pi-dollar',
                items: [
                    { label: 'Movimientos por Sucursal', icon: 'pi pi-fw pi-sort-numeric-down-alt', routerLink: ['/tesoreria/movimientos-caja'] },
                    { label: 'Caja del Día por  Sucursal', icon: 'pi pi-fw pi-table', routerLink: ['/tesoreria/caja-diaria'] },
                ]
            },
            {
                label: 'Reportes', icon: 'pi pi-fw pi-print',
                items: [
                    { label: 'Reporte de Clientes', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/clientes'] },
                    {
                        label: 'Proveedores', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/proveedores']
                        /* items: [
                            {label: 'Listado de Proveedores', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                            {label: 'Cuentas de Proveedores', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}
                        ] */
                    },
                    /* {label: 'Reporte de Bancos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/bancos']}, */
                    { label: 'Reporte de Marcas', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/marcas'] },
                    { label: 'Tipos de Productos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/tipo-productos'] },
                    {
                        label: 'Productos', icon: 'pi pi-fw pi-file-pdf',
                        items: [
                            { label: 'Productos por Sucursal', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/productos-almacen'] },
                            { label: 'Reportes de Inventario', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/almacen/inventario'] },
                            { label: 'Listado de Precios de Productos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/productos-precios'] }
                        ]
                    },
                    { label: 'Entradas y Salidas Libres', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/almacen/reporte_stocks'] },
                    {
                        label: 'Compras', icon: 'pi pi-fw pi-file-pdf',
                        items: [
                            { label: 'Compras de Productos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/compras-generales'] },
                            { label: 'Compras Detalladas por Producto', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/compras-detalladas'] },
                            /*                         {label: 'Compras Detalladas por Proveedor', icon: 'pi pi-file-pdf', routerLink: ['/landing']}, */
                            { label: 'Reporte de Pagos de Compras', icon: 'pi pi-file-pdf', routerLink: ['/reporte/pago-compras'] },
                            { label: 'Pagos de Compras Detalladas', icon: 'pi pi-file-pdf', routerLink: ['/reporte/pago-detallado'] }
                        ]
                    },
                    {
                        label: 'Ventas', icon: 'pi pi-fw pi-file-pdf',
                        items: [
                            { label: 'Ventas Generales', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/ventas-generales'] },
                            /* {label: 'Ventas por Vendedor', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}, */
                            { label: 'Ventas Detalladas por Producto', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/ventas-detalladas'] },
                            { label: 'Top de Productos Vendidos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/top-productos-vendidos'] },
                            { label: 'Reporte de Pagos de Ventas', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/cobro-ventas'] },
                            { label: 'Reporte de Pagos Detallados', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/reporte/cobro-detallado'] },
                            /* {label: 'Análisis Estadístico', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']} */
                        ]
                    },
                    {
                        label: 'Caja', icon: 'pi pi-fw pi-chart-line',
                        items: [
                            { label: 'Resumen de Caja', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/reporte/resumen-caja'] },
                            { label: 'Ingresos por Ventas', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/reporte/ingresos-ventas'] },
                            { label: 'Ingresos por Otros Conceptos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/reporte/ingresos-otros'] },
                            { label: 'Egresos por Pago a Proveedores', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/reporte/egresos-compras'] },
                            { label: 'Egresos por Otros Conceptos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/reporte/egresos-otros'] },
                            /* {label: 'Ingresos Egresos Detallados', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']} */
                        ]
                    }
                ]
            }
        );
    }

}
