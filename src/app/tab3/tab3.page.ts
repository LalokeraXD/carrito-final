import { Component } from '@angular/core';
import { FavoritosService } from '../services/favoritos.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  productosFavoritos: any[] = [];

  constructor(
    private favoritosService: FavoritosService,
    private toastController: ToastController) {}

  ionViewWillEnter() {
    this.productosFavoritos = this.favoritosService.obtenerFavoritos();
  }

  eliminarDeFavoritos(producto: any) {
    this.favoritosService.eliminarFavorito(producto);
      this.productosFavoritos = this.favoritosService.obtenerFavoritos();
      this.mostrarMensaje('Producto eliminado correctamente.');
  }

  agregarAlCarrito(producto: any) {
    this.mostrarMensaje('Producto agregado al carrito correctamente.');
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
