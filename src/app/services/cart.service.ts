import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Product } from '../models/product.model';
import { Purchase } from '../models/purchase.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carrito: { product: Product, quantity: number }[] = [];
  private carritoSubject = new BehaviorSubject<{ product: Product; quantity: number }[]>([]);
  private historialCompras: Purchase[] = [];
  private nombreUsuario: string = 'admin';

  constructor(private firestore: AngularFirestore) {}

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

  public getCarrito(): Observable<{ product: Product; quantity: number }[]> {
    const nombreUsuario = this.getNombreUsuario();
  
    if (nombreUsuario) {
      const carritoDocRef = this.firestore.collection('carrito').doc(nombreUsuario);
  
      return carritoDocRef.valueChanges().pipe(
        switchMap((carritoFirestore: any) => {
          if (carritoFirestore && carritoFirestore.products) {
            const productsData: { id: string; cant: number }[] = carritoFirestore.products;
  
            const productDetailsObservables = productsData.map(item => {
              const productDocRef = this.firestore.collection('products').doc(item.id);
  
              return productDocRef.valueChanges().pipe(
                map((productData: any) => {
                  if (productData) {
                    return {
                      product: {
                        id: item.id,
                        name: productData.name,
                        price: productData.price,
                        description: productData.description,
                        photo: productData.photo,
                        type: productData.type,
                      },
                      quantity: item.cant
                    };
                  } else {
                    console.error('Producto no encontrado:', item.id);
                    return null;
                  }
                }),
                catchError((error) => {
                  console.error('Error al obtener detalles del producto:', error);
                  return of(null);
                })
              );
            });
  
            return forkJoin(productDetailsObservables).pipe(
              // Filtrar elementos nulos y convertir a array final
              map(products => products.filter(product => product !== null) as { product: Product; quantity: number }[])
            );
          } else {
            return of([]); // Retorna un observable vacío si no hay productos en el carrito
          }
        })
      );
    } else {
      return of([]); // Retorna un observable vacío si no hay nombre de usuario
    }
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
  
  private async actualizarCarritoFirestore(nombreUsuario: string, carrito: { product: Product; quantity: number }[]): Promise<void> {
    const carritoDocRef = this.firestore.collection('carrito').doc(nombreUsuario);

    const carritoData = {
      user: nombreUsuario,
      products: carrito.map(item => ({ id: item.product.id, cant: item.quantity }))
    };

    await carritoDocRef.set(carritoData, { merge: true });
  }

  public setNombreUsuario(username: string): void {
    this.nombreUsuario = username;
  }

  public getNombreUsuario(): string {
    return this.nombreUsuario;
  }

  public vaciarCarrito(): void {
    this.carrito = [];
    this.carritoSubject.next(this.carrito);
  }
}
