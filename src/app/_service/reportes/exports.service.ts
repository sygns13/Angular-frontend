import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroInventario } from '../../_util/filtro_inventario';
import { FiltroGeneral } from 'src/app/_util/filtro_general';
import { FiltroEntradaStock } from 'src/app/_util/filtro_entrada_stock';
import { FiltroVenta } from 'src/app/_util/filtro_venta';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  protected urlClientes: string = `${environment.HOST}/api/backend/cliente_reportes`;
  protected urlProveedores: string = `${environment.HOST}/api/backend/proveedor_reportes`;
  protected urlMarcas: string = `${environment.HOST}/api/backend/marca_reportes`;
  protected urlTipoProductos: string = `${environment.HOST}/api/backend/tipo_producto_reportes`;

  protected urlProductos: string = `${environment.HOST}/api/backend/producto_reportes`;
  protected pathProdSucursal: string = `sucursal`;
  protected pathProdInventario: string = `inventario`;
  protected pathProdPrecio: string = `precio`;

  protected urlMovimientoProductos: string = `${environment.HOST}/api/backend/movimiento_productos_reportes`;
  protected pathMovimiento: string = `movimiento`;
  
  protected urlCompras: string = `${environment.HOST}/api/backend/entrada_stock_report`;
  protected pathGeneral: string = `general`;
  protected pathDetallada: string = `detallada`;
  protected pathCuentasPorPagar: string = `cuentas_pagar_general`;
  protected pathCuentasPorPagarDetail: string = `cuentas_pagar_detallado`;

  protected urlVentas: string = `${environment.HOST}/api/backend/venta_report`;
  protected pathGeneralVta: string = `general`;
  protected pathDetalladaVta: string = `detallada`;
  protected pathTopProductos: string = `top_productos`;
  protected pathCuentasPorCobrar: string = `cuentas_cobrar_general`;
  protected pathCuentasPorCobrarDetail: string = `cuentas_cobrar_detallado`;
  
  protected urlCaja: string = `${environment.HOST}/api/backend/caja_reportes`;
  protected resumen: string = `resumen`;
  protected ingresosVentas: string = `ingresos_ventas`;

  constructor(protected http: HttpClient) { }

  exportClientesPDF() {
    return this.http.get(`${this.urlClientes}/export-pdf`, {
      responseType: 'blob'
    });
  }

  exportClientesXLSX() {
    return this.http.get(`${this.urlClientes}/export-xls`, {
      responseType: 'blob'
    });
  }

  exportProveedoresPDF() {
    return this.http.get(`${this.urlProveedores}/export-pdf`, {
      responseType: 'blob'
    });
  }

  exportProveedoresXLSX() {
    return this.http.get(`${this.urlProveedores}/export-xls`, {
      responseType: 'blob'
    });
  }

  exportMarcasPDF() {
    return this.http.get(`${this.urlMarcas}/export-pdf`, {
      responseType: 'blob'
    });
  }

  exportMarcasXLSX() {
    return this.http.get(`${this.urlMarcas}/export-xls`, {
      responseType: 'blob'
    });
  }

  exportTipoProductosPDF() {
    return this.http.get(`${this.urlTipoProductos}/export-pdf`, {
      responseType: 'blob'
    });
  }

  exportTipoProductosXLSX() {
    return this.http.get(`${this.urlTipoProductos}/export-xls`, {
      responseType: 'blob'
    });
  }

  exportProductosSucursalPDF(almacenId: number) {
    return this.http.get(`${this.urlProductos}/${this.pathProdSucursal}/export-pdf?almacen_id=${almacenId}`, {
      responseType: 'blob'
    });
  }

  exportProductosSucursalXLSX(almacenId: number) {
    return this.http.get(`${this.urlProductos}/${this.pathProdSucursal}/export-xls?almacen_id=${almacenId}`, {
      responseType: 'blob'
    });
  }

  exportProductoInventarioPDF(filtros: FiltroInventario) {
    return this.http.post(`${this.urlProductos}/${this.pathProdInventario}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportProductoInventarioXLSX(filtros: FiltroInventario) {
    return this.http.post(`${this.urlProductos}/${this.pathProdInventario}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportProductosPrecioPDF(almacenId: number, unidadId: number) {
    return this.http.get(`${this.urlProductos}/${this.pathProdPrecio}/export-pdf?almacen_id=${almacenId}&unidad_id=${unidadId}`, {
      responseType: 'blob'
    });
  }

  exportProductosPrecioXLSX(almacenId: number, unidadId: number) {
    return this.http.get(`${this.urlProductos}/${this.pathProdPrecio}/export-xls?almacen_id=${almacenId}&unidad_id=${unidadId}`, {
      responseType: 'blob'
    });
  }

  exportMovimientoProductosPDF(filtros: FiltroGeneral) {
    return this.http.post(`${this.urlMovimientoProductos}/${this.pathMovimiento}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportMovimientoProductosXLSX(filtros: FiltroGeneral) {
    return this.http.post(`${this.urlMovimientoProductos}/${this.pathMovimiento}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportComprasGeneralesPDF(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathGeneral}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportComprasGeneralesXLSX(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathGeneral}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportComprasDetalladasPDF(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathDetallada}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportComprasDetalladasXLSX(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathDetallada}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasPagarPDF(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathCuentasPorPagar}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasPagarXLSX(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathCuentasPorPagar}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }


  exportCuentasPagarDetailPDF(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathCuentasPorPagarDetail}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasPagarDetailXLSX(filtros: FiltroEntradaStock) {
    return this.http.post(`${this.urlCompras}/${this.pathCuentasPorPagarDetail}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }


  exportVentasGeneralesPDF(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathGeneralVta}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportVentasGeneralesXLSX(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathGeneralVta}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportVentasDetalladasPDF(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathDetalladaVta}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportVentasDetalladasXLSX(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathDetalladaVta}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }


  exportVentasTopProductosPDF(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathTopProductos}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportVentasTopProductosXLSX(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathTopProductos}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasCobrarPDF(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathCuentasPorCobrar}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasCobrarXLSX(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathCuentasPorCobrar}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasCobrarDetailPDF(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathCuentasPorCobrarDetail}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportCuentasCobrarDetailXLSX(filtros: FiltroVenta) {
    return this.http.post(`${this.urlVentas}/${this.pathCuentasPorCobrarDetail}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }


  exportCajaResumenPDF(filtros: FiltroGeneral) {
    return this.http.post(`${this.urlCaja}/${this.resumen}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportCajaResumenXLSX(filtros: FiltroGeneral) {
    return this.http.post(`${this.urlCaja}/${this.resumen}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

  exportIngresosVentasPDF(filtros: FiltroVenta) {
    return this.http.post(`${this.urlCaja}/${this.ingresosVentas}/export-pdf`, filtros, {
      responseType: 'blob'
    });
  }

  exportIngresosVentasXLSX(filtros: FiltroVenta) {
    return this.http.post(`${this.urlCaja}/${this.ingresosVentas}/export-xls`, filtros, {
      responseType: 'blob'
    });
  }

}
