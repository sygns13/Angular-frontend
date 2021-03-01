import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Producto } from './../../../_model/producto';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

  message: string = "valor2";

  @Input() producto: Producto;

  @Output() cerrarFormStocks = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.cerrarFormStocks.emit(this.message)
  }

}
