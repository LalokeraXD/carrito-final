import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ToastController } from '@ionic/angular';
import { CompraService } from '../services/compra.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public carrito: { product: Product; quantity: number }[] = [
    // {
    //   product: {
    //     id: '1',
    //     name: 'Producto 1',
    //     price: 10.99,
    //     description: 'Descripción del Producto 1',
    //     photo: 'https://picsum.photos/500/300?random=5',
    //     type: 'Tipo 1'
    //   },
    //   quantity: 2
    // },
    // {
    //   product: {
    //     id: '2',
    //     name: 'Producto 2',
    //     price: 19.99,
    //     description: 'Descripción del Producto 2',
    //     photo: 'https://picsum.photos/500/300?random=5',
    //     type: 'Tipo 2'
    //   },
    //   quantity: 1
    // },
  ];

  constructor(
    private toastController: ToastController,
    private compraService: CompraService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.obtenerCarrito();
    console.log(this.carrito);
  }

  async obtenerCarrito() {
    this.cartService.getCarrito().subscribe((carrito) => {
      this.carrito = carrito;
    });
  }

  calcularTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  async realizarPago() {
    // Puedes implementar la lógica para el pago aquí
    // Por ahora, solo mostraremos un mensaje
    const toast = await this.toastController.create({
      message: 'Pago realizado con éxito',
      duration: 2000,
      position: 'bottom',
    });

    toast.present();

    // Luego de realizar el pago, puedes vaciar el carrito
    this.cartService.vaciarCarrito();
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
