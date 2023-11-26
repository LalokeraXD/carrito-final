import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { Purchase } from '../models/purchase.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { CompraService } from './compra.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carrito: { product: Product; quantity: number }[] = [];
  private carritoSubject = new BehaviorSubject<{ product: Product; quantity: number }[]>([]);
  private historialCompras: Purchase[] = [];
  private nombreUsuario: string = this.getNombreUsuario();
  private carritoCollection: AngularFirestoreCollection<any>;
  private nombreUsuarioSubject = new BehaviorSubject<string>('');
  nombreUsuarioObservable: Observable<string> = this.nombreUsuarioSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private compraService: CompraService
    ) {
    this.carritoCollection = this.firestore.collection('carrito');
  }

  public registrarCompra(): void {
    const compra: Purchase = {
      fecha: new Date(),
      user: this.nombreUsuario,
      productos: this.carrito.slice() // Clonar los productos en el carrito para la compra
    };

    this.historialCompras.push(compra);
    this.carrito = []; // Vaciar el carrito después de la compra
    this.carritoSubject.next(this.carrito);
  }

  public async realizarCompra(): Promise<void> {
    // Registra la compra
    const compra: Purchase = {
      fecha: new Date(),
      user: this.getNombreUsuario(), // Agrega el nombre del usuario
      productos: this.carrito.slice(), // Clonar los productos en el carrito para la compra
    };

    // Agrega la compra a la colección "compras" en Firestore
    await this.compraService.agregarCompra(compra);

    // Vacía el carrito después de la compra
    this.vaciarCarrito();

    // Actualiza el carrito en Firestore (vacío)
    const nombreUsuario = this.getNombreUsuario();
    if (nombreUsuario) {
      await this.actualizarCarritoFirestore(nombreUsuario, []);
    }
  }

  public obtenerHistorialCompras(): Purchase[] {
    return this.historialCompras;
  }

  public getCarrito(): Observable<{ product: { id: string }; quantity: number }[]> {
    const nombreUsuario = this.getNombreUsuario();
  
    if (!nombreUsuario) {
      console.error('Nombre de usuario no válido.');
      return of([]); // Retorna un array vacío si no hay nombre de usuario
    }
  
    const carritoDocRef = this.firestore.collection('carrito').doc(nombreUsuario);
  
    return carritoDocRef.valueChanges().pipe(
      map((carritoFirestore: any) => {
        if (!carritoFirestore || !carritoFirestore.products) {
          console.error('No hay productos en el carrito.');
          return [];
        }
  
        return carritoFirestore.products.map((item: { id: string, cant: number }) => {
          return {
            product: { id: item.id },
            quantity: item.cant || 0
          } as { product: { id: string }; quantity: number };
        });
      }),
      catchError((error) => {
        console.error('Error al obtener datos del carrito:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  public async agregarAlCarrito(producto: Product): Promise<void> {
    const productoEnCarrito = this.carrito.find((item) => item.product.id === producto.id);
  
    if (productoEnCarrito) {
      productoEnCarrito.quantity++;
    } else {
      this.carrito.push({ product: producto, quantity: 1 });
    }
  
    const nombreUsuario = this.getNombreUsuario();
  
    if (nombreUsuario) {
      await this.actualizarCarritoFirestore(nombreUsuario, this.carrito);
    }
  
    this.carritoSubject.next(this.carrito);
  }
  
  
  public async actualizarCarritoFirestore(nombreUsuario: string, carrito: { product: Product; quantity: number }[]): Promise<void> {
    const carritoDocRef = this.firestore.collection('carrito').doc(nombreUsuario);
  
    const carritoData = {
      user: nombreUsuario,
      products: carrito.map(item => ({ id: item.product.id, cant: item.quantity }))
    };
  
    await carritoDocRef.set(carritoData, { merge: true });
  }

  public setNombreUsuario(username: string): void {
    this.nombreUsuarioSubject.next(username);
    this.nombreUsuario = username;
  }

  public getNombreUsuario(): string {
    return this.nombreUsuario;
  }

  public vaciarCarrito(): void {
    this.carrito = [];
    this.carritoSubject.next(this.carrito);
  }

  public async eliminarProductoDelCarrito(productId: string): Promise<void> {
    const nombreUsuario = this.getNombreUsuario();
  
    if (!nombreUsuario) {
      console.error('Nombre de usuario no válido.');
      return;
    }
  
    // Elimina el producto del carrito local
    const index = this.carrito.findIndex(item => item.product.id === productId);
    if (index !== -1) {
      this.carrito.splice(index, 1);
      this.carritoSubject.next(this.carrito);
    }
  
    // Elimina el producto de la colección en Firestore
    const carritoDocRef = this.firestore.collection('carrito').doc(nombreUsuario);
    try {
      const carritoFirestore = await carritoDocRef.get().toPromise();
  
      if (carritoFirestore) {
        const carritoData = carritoFirestore.data() as { products?: { id: string; cant: number }[] };
  
        if (carritoData && carritoData.products) {
          const productosActualizados = carritoData.products.filter((item: any) => item.id !== productId);
          await carritoDocRef.set({ products: productosActualizados }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  }
  
  
}