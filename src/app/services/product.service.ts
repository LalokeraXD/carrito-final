import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public id: string = '';
  private productsCollection: AngularFirestoreCollection<Product>;
  private productToUpdate: BehaviorSubject<Product | undefined> = new BehaviorSubject<Product | undefined>(undefined);

  constructor(private firestore: AngularFirestore) {
    // this.products.push({
    //   name: "Aguacate",
    //   price: 100,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Frutas y Verduras",
    //   photo: "https://picsum.photos/500/300?random",
    // });
    // this.products.push({
    //   name: "Coca Cola",
    //   price: 20,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Abarrotes",
    //   photo: "https://picsum.photos/500/300?random"
    // });
    // this.products.push({
    //   name: "Jabón Zote",
    //   price: 40,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Limpieza",
    //   photo: "https://picsum.photos/500/300?random"
    // });
    // this.products.push({
    //   name: "Aspirina",
    //   price: 50,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Farmacia",
    //   photo: "https://picsum.photos/500/300?random"
    // });
    this.productsCollection = this.firestore.collection<Product>('products');
  }

  //  public addProducts(p: Product):Product[]{
  //   this.products.push(p);
  //   return this.products;
  //  }

  //  public removeProduct(pos:number):Product[]{
  //   this.products.splice(pos,1);
  //   return this.products;
  // }

  //  public updateProduct(pos: number,p:Product):Product[]{
  //   this.products[pos]=p;
  //   return this.products;
  //  }

  //  public getProducts():Product[]{
  //   return this.products;
  //  }

  //  public getProductsWhere(pos:number): Product{
  //   return this.products[pos];
  // }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.valueChanges();
  }

  async getProductById(productId: string): Promise<Product | undefined> {
    const snapshot = await this.productsCollection.doc(productId).ref.get();
    return snapshot.exists ? snapshot.data() as Product : undefined;
  }

  addProduct(product: Product): void {
    const id = this.firestore.createId(); // Genera un ID único
    const productWithId = { ...product, id }; // Añade el ID al producto
    this.productsCollection.doc(id).set(productWithId);
  }

  public async updateProduct(productId: string, updatedProduct: Partial<Product>): Promise<void> {
    await this.firestore.collection('products').doc(productId).update(updatedProduct);
  }

  removeProduct(productId: string): void {
    this.productsCollection.doc(productId).delete();
  }

  setProductToUpdate(product: Product): void {
    this.productToUpdate.next(product);
  }

  getProductToUpdate(): Observable<Product | undefined> {
    return this.productToUpdate.asObservable();
  }
}
