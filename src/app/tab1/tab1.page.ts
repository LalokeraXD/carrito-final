import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AlertController, ToastController } from '@ionic/angular';
import { FavoritosService } from '../services/favoritos.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public products: Product[] = [];
  public productsFounds: Product[] = [];
  public car: { [productId: number]: { product: Product, quantity: number } } = {};
  public filter = [
    "Abarrotes",
    "Frutas y Verduras",
    "Limpieza",
    "Farmacia",
  ];

  public colors = [
    {
      type: "Abarrotes",
      color: "primary"
    },
    {
      type: "Frutas y Verduras",
      color: "secondary"
    },
    {
      type: "Limpieza",
      color: "warning"
    },
    {
      type: "Farmacia",
      color: "danger"
    }
  ];

  constructor(
    private cartService: CartService,
    private favoritosService: FavoritosService,
    private alertController: AlertController, 
    private router: Router, 
    private productService: ProductService,
    private toastController: ToastController
    ) {
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
    // this.productsFounds = this.products;
    // this.productsFounds = this.product.getProducts();
    this.productService.getProducts().subscribe(products => {
      this.productsFounds = products;
    });
  }

  public getColor(type: string): string {
    const itemFound = this.colors.find((element) => {
      return element.type === type;
    });
    let color = itemFound && itemFound.color ? itemFound.color : '';
    return color;
  }

  public filterProducts(): void {
    console.log(this.filter);
    this.productsFounds = this.products.filter(
      item => {
        return this.filter.includes(item.type);
      }
    );
  }

  agregarAlCarrito(producto: Product): void {
    this.cartService.agregarAlCarrito(producto);
    this.mostrarMensaje('Producto agregado al carrito.');
  }

  openAddProductPage() {
    this.router.navigate(['/add-product']);
  }

  // openUpdateProductPage(pos: number) {
  //   this.productService.pos = pos;

  //   // Obtén el producto desde el array observable
  //   this.productService.getProducts().pipe(
  //     map(products => products[pos])
  //   ).subscribe(product => {
  //     // Envía la información del producto al servicio
  //     this.productService.setProductToUpdate(product);

  //     // Redirige a la página de actualización
  //     this.router.navigate(['/update-product']);
  //   });
  // }

  openUpdateProductPage(prod: Product) {
    console.log(prod);
    this.router.navigate(['/update-product', prod.id]);
  }  

  getpos(id: string) {
    this.productService.id = id;
  }

  carritoVacio(): boolean {
    return Object.keys(this.car).length === 0;
  }

  get carritoArray(): { product: Product, quantity: number }[] {
    return Object.values(this.car);
  }

  calcularTotalCarrito(): number {
    let total = 0;
    for (const productId of Object.keys(this.car)) {
      const producto = this.car[parseInt(productId)].product;
      const quantity = this.car[parseInt(productId)].quantity;
      total += producto.price * quantity;
    }
    return total;
  }

  agregarAlFavorito(producto: any) {
    this.favoritosService.agregarFavorito(producto);
    this.mostrarMensaje('Producto agregado a favoritos.');
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000, // Duración del mensaje en milisegundos
      position: 'bottom', // Posición del mensaje en la pantalla
    });
    toast.present();
  }

  async mostrarAlertaConfirmacion(prod: Product) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.productService.removeProduct(prod.id);
            this.msgDeleted();
          }
        }
      ]
    });

    await alert.present();
  }

  async msgDeleted() {
    const toast = await this.toastController.create({
      message: 'Producto eliminado',
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  
}
