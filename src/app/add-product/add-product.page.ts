import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage {
  public producForm: FormGroup
  constructor(
    private fomBuilder: FormBuilder, 
    private productService: ProductService,
    private toastController: ToastController, 
    private router: Router
  ) {
    this.producForm = this.fomBuilder.group({
      name:['',Validators.required],
      price:[0,Validators.required],
      description:[''],
      photo:['',Validators.required],
      type:['',Validators.required],
    });
   }

  public async addProduct(){
    const product = this.producForm.value;
    this.productService.addProducts(product);

    const toast = await this.toastController.create({
      message: 'Producto añadido',
      duration: 2000,
      position: 'bottom'
    });
    
    
    toast.present();
    this.router.navigate(['/tabs/tab1']);
  }

}
