import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  protected urlClientes: string = `${environment.HOST}/api/backend/cliente_reportes`;
  protected urlProveedores: string = `${environment.HOST}/api/backend/proveedor_reportes`;
  protected urlMarcas: string = `${environment.HOST}/api/backend/marca_reportes`;
  protected urlTipoProductos: string = `${environment.HOST}/api/backend/tipo_producto_reportes`;

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

}
