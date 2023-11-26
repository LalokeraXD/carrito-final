import { Component } from '@angular/core';
import { FavoritosService } from '../services/favoritos.service';
import { ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  productosFavoritos: any[] = [];
  usuario: string = '';

  constructor(
    private favoritosService: FavoritosService,
    private toastController: ToastController,
    private cartService: CartService    
    ) {}

    async ionViewWillEnter() {
      // Obtener el usuario actual
      this.usuario = await this.cartService.getNombreUsuario();
  
      // Obtener los productos favoritos del usuario
      this.favoritosService.obtenerFavoritos(this.usuario).subscribe((favoritos: any) => {
        if (favoritos && favoritos.products) {
          this.productosFavoritos = favoritos.products;
        } else {
          this.productosFavoritos = [];
        }
      });
    }
  
    async eliminarDeFavoritos(producto: any) {
      this.favoritosService.eliminarFavorito(producto, this.usuario);
      this.mostrarMensaje('Producto eliminado correctamente de favoritos.');
    }

    agregarAlCarrito(producto: Product): void {
      this.cartService.agregarAlCarrito(producto);
      this.mostrarMensaje('Producto agregado al carrito.');
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
