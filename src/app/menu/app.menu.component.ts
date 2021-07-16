import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';

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

    constructor(public app: AppComponent) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio', icon: 'pi pi-fw pi-home',  routerLink: ['/principal']
                /*items: [
                    {label: 'Dashboard Sales', icon: 'pi pi-fw pi-home', routerLink: ['/'], badge: '4', badgeClass: 'p-badge-info'},
                    {label: 'Dashboard Analytics', icon: 'pi pi-fw pi-home',
                        routerLink: ['/favorites/dashboardanalytics'], badge: '2', badgeClass: 'p-badge-success'}
                ]*/
            },
            {
                label: 'Tablas Base', icon: 'pi pi-fw pi-inbox',
                items: [
                    {label: 'Gestión de Locales', icon: 'pi pi-fw pi-home', routerLink: ['/tablas/locales']},
                    {label: 'Tipos de Productos', icon: 'pi pi-fw pi-list', routerLink: ['/tablas/tipo_productos']},
                    {label: 'Gestión de Marcas', icon: 'pi pi-fw pi-list', routerLink: ['/tablas/marcas']},
                    {label: 'Presentaciones de Productos', icon: 'pi pi-fw pi-bookmark', routerLink: ['/tablas/presentaciones']},
                    {label: 'Gestión de Unidades', icon: 'pi pi-fw pi-table', routerLink: ['/tablas/unidades']},
                    {label: 'Registro de Bancos', icon: 'pi pi-fw pi-home', routerLink: ['/tablas/bancos']}
                ]
            },
            {
                label: 'Gestión de Almacén', icon: 'pi pi-fw pi-inbox',
                items: [
                    {label: 'Catálogo de Productos', icon: 'pi pi-fw pi-camera', routerLink: ['/almacen/productos']},
                    {label: 'Inventario', icon: 'pi pi-fw pi-briefcase', routerLink: ['/almacen/inventario']},
                    {label: 'Gestión de Salidas e Ingresos Libres de Productos', icon: 'pi pi-fw pi-sort', routerLink: ['/almacen/gestion_stocks']},
                    {label: 'Reporte de de Salidas e Ingresos Libres de Productos', icon: 'pi pi-fw pi-list', routerLink: ['/almacen/reporte_stocks']},
                    {label: 'Productos Bajos de Stock', icon: 'pi pi-fw pi-angle-double-down', routerLink: ['/almacen/productos_bajo_stock']},
                    {label: 'productos Vencidos', icon: 'pi pi-fw pi-backward', routerLink: ['/almacen/productos_vencidos']},
                ]
            },
            {
                label: 'Ventas', icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    {label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/ventas/clientes']},
                    {label: 'Realizar Venta', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['utilities/display']},
                    {label: 'Ventas Realizadas', icon: 'pi pi-fw pi-inbox', routerLink: ['utilities/elevation']},
                    {label: 'Resúmenes de Ventas', icon: 'pi pi-fw pi-sliders-h', routerLink: ['utilities/flexbox']},
                    {label: 'Cuentas por Cobrar', icon: 'pi pi-fw pi-money-bill', routerLink: ['utilities/icons']}
                ]
            },
            {
                label: 'Compras', icon: 'pi pi-fw pi-compass',
                items: [
                    {label: 'Proveedores', icon: 'pi pi-fw pi-user-plus', routerLink: ['/uikit/formlayout']},
                    {label: 'Cuentas Bancarias', icon: 'pi pi-fw pi-table', routerLink: ['utilities/display']},
                    {label: 'Compras a Proveedores', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['utilities/elevation']},
                    {label: 'Compras Realziadas', icon: 'pi pi-fw pi-list', routerLink: ['utilities/flexbox']},
                    {label: 'Cuentas por Pagar', icon: 'pi pi-fw pi-star', routerLink: ['utilities/icons']}
                ]
            },
            {
                label: 'Caja', icon: 'pi pi-fw pi-dollar',
                items: [
                    {label: 'Registro de Movimientos', icon: 'pi pi-fw pi-sort-numeric-down-alt', routerLink: ['/uikit/formlayout']},
                    {label: 'Caja Diaria', icon: 'pi pi-fw pi-table', routerLink: ['utilities/display']},
                    {label: 'Iniciar Comprobantes', icon: 'pi pi-fw pi-file', routerLink: ['utilities/elevation']}
                ]
            },
            {
                label: 'Reportes', icon: 'pi pi-fw pi-print',
                items: [
                    {label: 'Reporte de Clientes', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/pages/crud']},
                    {label: 'Proveedores', icon: 'pi pi-fw pi-file-pdf',
                        items: [
                            /* {label: 'Listado de Proveedores', icon: 'pi pi-fw pi-globe', url: 'assets/pages/landing.html', target: '_blank'}, */
                            {label: 'Listado de Proveedores', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}, 
                            {label: 'Cuentas de Proveedores', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}
                        ]
                    },
                    {label: 'Reporte de Bancos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/login']},
                    {label: 'Reporte de Marcas', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/pages/invoice']},
                    {label: 'Tipos de Productos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/pages/help']},
                    {label: 'Productos', icon: 'pi pi-fw pi-file-pdf', 
                    items: [
                        {label: 'Productos por Almacén', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}, 
                        {label: 'Reportes de Inventario', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Listado de Precios de Productos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}
                    ]
                    },
                    {label: 'Reporte de Salidas Libres', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/notfound']},
                    {label: 'Compras', icon: 'pi pi-fw pi-file-pdf',
                    items: [
                        {label: 'Compras de Productos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}, 
                        {label: 'Compras Detalladas por Producto', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Compras Detalladas por Proveedor', icon: 'pi pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Reporte de Cuentas por Pagar', icon: 'pi pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Reporte de Pagos Realizados', icon: 'pi pi-file-pdf', routerLink: ['/landing']}
                    ]
                    },
                    {label: 'Ventas', icon: 'pi pi-fw pi-file-pdf',
                    items: [
                        {label: 'Ventas Generales', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}, 
                        {label: 'Ventas por Vendedor', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Ventas Detalladas', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Top de Productos Vendidos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Reporte de Cuentas por Cobrar', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Reporte de Pagos Cobrados', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']},
                        {label: 'Análisis Estadístico', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/landing']}
                    ]
                    },
                    {label: 'Caja', icon: 'pi pi-fw pi-chart-line',
                    items: [
                        {label: 'Caja Diaria', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']}, 
                        {label: 'Ingresos por Ventas', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']},
                        {label: 'Ingresos por Otros Conceptos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']},
                        {label: 'Gastos por Pago a Proveedores', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']},
                        {label: 'Gastos Diversos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']},
                        {label: 'Ingresos Egresos Detallados', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/landing']}
                    ]
                    }
                ]
            },
            {label: 'Configuraciones', icon: 'pi pi-fw pi-cog',
            items: [
                {label: 'Gestión de Usuarios', icon: 'pi pi-fw pi-user-edit', routerLink: ['/landing']}, 
                {label: 'Configuraciones', icon: 'pi pi-fw pi-cog', routerLink: ['/landing']}
            ]
            }
        ];
    }
}
