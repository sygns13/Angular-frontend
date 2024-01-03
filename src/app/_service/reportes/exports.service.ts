import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroInventario } from '../../_util/filtro_inventario';
import { FiltroGeneral } from 'src/app/_util/filtro_general';

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

}
