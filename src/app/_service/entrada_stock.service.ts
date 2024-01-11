import { EntradaStock } from '../_model/entrada_stock';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from './../_model/proveedor';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleEntradaStock } from '../_model/detalle_entrada_stock';
import { ProductoAddEntradaStock } from '../_model/producto_add_entrada_stock';
import { PagoProveedor } from '../_model/pago_proveedor';
import { FiltroEntradaStock } from '../_util/filtro_entrada_stock';
import { ComprasDTO } from '../_model/compras_dto';

@Injectable({
  providedIn: 'root'
})
export class EntradaStockService extends GenericService<EntradaStock>{

  EntradaStocks = new Subject<EntradaStock[]>();

  protected url: string = `${environment.HOST}/api/backend/entrada-stock`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/entrada-stock`);
  }

  registrarRetEntradaStock(entrada_stock: EntradaStock) {
    return this.http.post<EntradaStock>(this.url, entrada_stock);
  }

  modificarEntradaStock(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}`, entrada_stock);
  }

  modificarProveedor(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}/updateproveedor`, entrada_stock);
  }

  agregarProductoAEntradaStock(detalleEntradaStock: DetalleEntradaStock) {
    return this.http.post<EntradaStock>(`${this.url}/add-detalle-entrada-stock`, detalleEntradaStock);
  }

  agregarProductoAEntradaStockPorCodigo(productoAddEntradaStock: ProductoAddEntradaStock) {
    return this.http.post<EntradaStock>(`${this.url}/add-producto-entrada-stock`, productoAddEntradaStock);
  }

  deleteProductoAEntradaStock(detalleEntradaStock: DetalleEntradaStock) {
    return this.http.post<EntradaStock>(`${this.url}/delete-detalle-entrada-stock`, detalleEntradaStock);
  }

  modificarProductoAEntradaStock(detalleEntradaStock: DetalleEntradaStock) {
    return this.http.post<EntradaStock>(`${this.url}/modificar-detalle-entrada-stock`, detalleEntradaStock);
  }

  resetEntradaStock(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}/resetentrada-stock`, entrada_stock);
  }

  pagarEntradaStock(pagoProveedor: PagoProveedor) {
    return this.http.post<PagoProveedor>(`${this.url}/pago-proveedor`, pagoProveedor);
  }

  getEntradaStocks(filtro: FiltroEntradaStock, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get-entrada-stocks?page=${p}&size=${s}`, filtro);
  }


  anular(id: number) {
    return this.http.patch(`${this.url}/anular/${id}`, null);
  }

  getEntradaStocksPorPagar(filtro: FiltroEntradaStock, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get-entrada-stocks-pagar?page=${p}&size=${s}`, filtro);
  }

  getPagosEntradaStocks(id: number, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get-pagos/${id}?page=${p}&size=${s}`, null);
  }

  facturarEntradaStock(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}/facturar`, entrada_stock);
  }
  revFacturaEntradaStock(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}/revertir-facturar`, entrada_stock);
  }
  actualizarEntradaStock(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}/actualizar`, entrada_stock);
  }
  revActualizacionEntradaStock(entrada_stock: EntradaStock) {
    return this.http.put<EntradaStock>(`${this.url}/revertir-actualizar`, entrada_stock);
  }



  //Reportes Detalle
  getEntradaStocksDetail(filtro: FiltroEntradaStock, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get_entrada_stocks_details?page=${p}&size=${s}`, filtro);
  }


  getPagosEntradaStocksDetail(filtro: FiltroEntradaStock, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get_entrada_stocks_pagar_detail?page=${p}&size=${s}`, filtro);
  }

  getEgresosCompras(filtro: FiltroEntradaStock, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get_egresos_compras?page=${p}&size=${s}`, filtro);
  }
}
