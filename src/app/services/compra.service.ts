import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Purchase } from '../models/purchase.interface';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private comprasCollection: AngularFirestoreCollection<any>;
  private historialCompras: { product: Product, quantity: number }[] = [];
  private historialComprasSubject: BehaviorSubject<{ product: Product, quantity: number }[]> = new BehaviorSubject(this.historialCompras);

  constructor(private firestore: AngularFirestore) {
    this.comprasCollection = this.firestore.collection('compras');
  }

  public async agregarCompra(compra: Purchase): Promise<void> {
    await this.comprasCollection.add(compra);
  }

  public agregarAlHistorialCompra(productos: { product: Product, quantity: number }[]): void {
    this.historialCompras.push(...productos);
    this.historialComprasSubject.next(this.historialCompras);
  }

  public obtenerHistorialCompras(): Observable<{ product: Product, quantity: number }[]> {
    return this.historialComprasSubject.asObservable();
  }
}