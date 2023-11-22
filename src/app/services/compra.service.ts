// compra.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private historialCompras: { product: Product, quantity: number }[] = [];
  private historialComprasSubject: BehaviorSubject<{ product: Product, quantity: number }[]> = new BehaviorSubject(this.historialCompras);

  constructor() {}

  public agregarAlHistorialCompra(productos: { product: Product, quantity: number }[]): void {
    this.historialCompras.push(...productos);
    this.historialComprasSubject.next(this.historialCompras);
  }

  public obtenerHistorialCompras(): Observable<{ product: Product, quantity: number }[]> {
    return this.historialComprasSubject.asObservable();
  }
}
