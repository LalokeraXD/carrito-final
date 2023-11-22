import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  favoritos: any[] = [];

  agregarFavorito(producto: any) {
    // Verificar si el producto ya está en la lista de favoritos
    const productoExistente = this.favoritos.find(item => item.id === producto.id);

    if (!productoExistente) {
      this.favoritos.push(producto);
    }
  }

  obtenerFavoritos() {
    return this.favoritos;
  }

  eliminarFavorito(producto: any) {
    const indice = this.favoritos.findIndex(item => item.id === producto.id);
    if (indice !== -1) {
      this.favoritos.splice(indice, 1);
    }
  }
}