// compras.page.ts
import { Component, OnInit } from '@angular/core';
import { Purchase } from '../models/purchase.interface';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-compras',
  templateUrl: 'compras.page.html',
  styleUrls: ['compras.page.scss'],
})
export class ComprasPage implements OnInit {
  historialCompras: Purchase[] = [];

  constructor() {}

  ngOnInit(): void {
  }

  calcularTotalCompra(productos: { product: Product, quantity: number }[]): number {
    let total = 0;
    for (const item of productos) {
      total += item.product.price * item.quantity;
    }
    return total;
  }
}
