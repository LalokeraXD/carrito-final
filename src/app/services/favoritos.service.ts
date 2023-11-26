import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Importa firebase

interface FavoritosDoc {
  products?: any[]; // Ajusta esto según la estructura real de tus documentos
}

@Injectable({
  providedIn: 'root'
})

export class FavoritosService {
  constructor(private firestore: AngularFirestore) {}

  async agregarFavorito(producto: any, usuario: string): Promise<void> {
    const favoritosDocRef = this.firestore.collection('favoritos').doc(usuario).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const favoritosDoc = await transaction.get(favoritosDocRef);

      let products: any[] = [];
      if (favoritosDoc.exists) {
        const existingProducts = (favoritosDoc.data() as FavoritosDoc)?.products || [];
        products = [...existingProducts, producto];
      } else {
        products = [producto];
      }

      transaction.update(favoritosDocRef, { products: firebase.firestore.FieldValue.arrayUnion(producto) });
    });
  }

  obtenerFavoritos(usuario: string): any {
    return this.firestore.collection('favoritos').doc(usuario).valueChanges();
  }

  async eliminarFavorito(producto: any, usuario: string): Promise<void> {
    const favoritosDocRef = this.firestore.collection('favoritos').doc(usuario).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const favoritosDoc = await transaction.get(favoritosDocRef);

      if (favoritosDoc.exists) {
        const existingProducts = (favoritosDoc.data() as FavoritosDoc)?.products || [];
        const updatedProducts = existingProducts.filter((item: any) => item.id !== producto.id);

        transaction.update(favoritosDocRef, { products: firebase.firestore.FieldValue.arrayRemove(producto) });
      }
    });
  }
}