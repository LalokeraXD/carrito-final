import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ToastController } from '@ionic/angular';
import { CompraService } from '../services/compra.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public carrito: { product: Product; quantity: number }[] = [
  //   {
  //     products: [{
  //       id: '1adggdr4',
  //       quantity: 2
  //     },
  //     {
  //       id: 'asfad1r32',
  //       quantity: 1
  //     },
  //     {
  //       id: 'gds561',
  //       quantity: 3
  //     }
  // ],
  //   user: 'admin'
  // }
  ];

  constructor(
    private toastController: ToastController,
    private compraService: CompraService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.obtenerCarrito();
  }
  
  async obtenerCarrito() {
    this.cartService.getCarrito().subscribe(async (carrito) => {
      console.log('Datos del carrito en obtenerCarrito:', carrito);
  
      if (carrito && carrito.length > 0) {
        const carritoDetails = await Promise.all(carrito.map(async (item) => {
          const product = await this.productService.getProductById(item.product.id);
  
          if (product) {
            return {
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                type: product.type,
                photo: product.photo,
              },
              quantity: item.quantity || 0
            };
          } else {
            // Manejar el caso en que no se pueda obtener el producto
            return null;
          }
        }));
  
        // Filter out null values
        this.carrito = carritoDetails.filter((item) => item !== null) as { product: Product; quantity: number }[];
      } else {
        // Manejar el caso en que no hay productos en el carrito
        this.carrito = [];
      }
    });
  }
  
  
  calcularTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  async realizarPago() {
    // Llamada al servicio para realizar la compra
    await this.cartService.realizarCompra();
  
    // Mostrar mensaje
    this.mostrarMensaje('Pago realizado con éxito');
  } 

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000, // Duración del mensaje en milisegundos
      position: 'bottom', // Posición del mensaje en la pantalla
    });
    toast.present();
  }
}