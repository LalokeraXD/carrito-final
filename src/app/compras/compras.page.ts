import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompraService } from '../services/compra.service';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-compras',
  templateUrl: 'compras.page.html',
  styleUrls: ['compras.page.scss'],
})
export class ComprasPage implements OnInit, OnDestroy {
  historialCompras: any[] = [];
  historialComprasSubscription: Subscription | undefined;
  nombreUsuario: string = '';

  constructor(private compraService: CompraService, private cartService: CartService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el nombre de usuario
    this.cartService.nombreUsuarioObservable.subscribe((nombreUsuario) => {
      this.nombreUsuario = nombreUsuario;
      this.cargarHistorialCompras();
    });
  }

  cargarHistorialCompras(): void {
    this.historialComprasSubscription = this.compraService.obtenerHistorialCompras().subscribe({
        next: (historialCompras) => {
            // Filtra las compras solo para el usuario actual
            this.historialCompras = historialCompras
                .filter(compra => compra.user === this.nombreUsuario)
                .sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis()) // Ordena por fecha descendente
                .map(compra => {
                    return { ...compra, fecha: this.formatearFecha(compra.fecha) };
                });
        },
        error: (error) => {
            console.error('Error al cargar el historial de compras:', error);
        },
    });
}


  calcularTotalCompra(productos: any[]): number {
    let total = 0;
    for (const item of productos) {
      total += item.product.price * item.quantity;
    }
    return total;
  }

  formatearFecha(fecha: any): string {
    // Convertir el objeto Timestamp a un objeto Date
    const date = fecha.toDate();
    
    // Formatear la fecha y la hora
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    const fechaFormateada = date.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = date.toLocaleTimeString('es-ES', opcionesHora);

    return `${fechaFormateada} ${horaFormateada}`;
  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción para evitar posibles fugas de memoria
    if (this.historialComprasSubscription) {
      this.historialComprasSubscription.unsubscribe();
    }
  }
}
