import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  protected urlClientes: string = `${environment.HOST}/api/backend/cliente_reportes`

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
}
