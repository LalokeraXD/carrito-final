import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private UsersService: UsersService, 
    private router: Router, 
    private toastController: ToastController,
    private cartService: CartService
  ) { }

  ngOnInit() {
  }

  username: string = '';
  password: string = '';

  showError: boolean = false;

  async login() {
    const isValid = this.UsersService.authenticate(this.username, this.password);

    if (isValid) {
      this.cartService.setNombreUsuario(this.username);
      console.log('Redirigiendo a tabs/tab1'); // Agrega este console.log para verificar si se ejecuta
      this.router.navigate(['/tabs/tab1']);
    } else {
      const toast = await this.toastController.create({
        message: 'Credenciales incorrectas. Inténtalo de nuevo.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

}
