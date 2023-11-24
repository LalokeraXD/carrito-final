import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Purchase } from '../models/purchase.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carrito: { product: Product, quantity: number }[] = [];
  private carritoSubject: BehaviorSubject<{ product: Product, quantity: number }[]> = new BehaviorSubject(this.carrito);
  private historialCompras: Purchase[] = [];

  constructor() {}

  public registrarCompra(): void {
    const compra: Purchase = {
      fecha: new Date().toLocaleDateString(),
      productos: this.carrito.slice() // Clonar los productos en el carrito para la compra
    };

    this.historialCompras.push(compra);
    this.carrito = []; // Vaciar el carrito después de la compra
    this.carritoSubject.next(this.carrito);
  }

  public obtenerHistorialCompras(): Purchase[] {
    return this.historialCompras;
  }

  public agregarAlCarrito(producto: Product): void {
    const productoEnCarrito = this.carrito.find((item) => item.product.id === producto.id);

    if (productoEnCarrito) {
      productoEnCarrito.quantity++;
    } else {
      this.carrito.push({ product: producto, quantity: 1 });
    }

    this.carritoSubject.next(this.carrito);
  }

  public obtenerCarrito(): Observable<{ product: Product, quantity: number }[]> {
    return this.carritoSubject.asObservable();
  }

  public vaciarCarrito(): void {
    this.carrito = [];
    this.carritoSubject.next(this.carrito);
  }
}
