import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage implements OnInit {
  public productForm: FormGroup;
  public producto: Product | undefined;
  public productId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private toastController: ToastController,
    private router:Router,
    private route: ActivatedRoute
  ) {
    
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      description: [''],
      photo: ['', Validators.required],
      type: ['', Validators.required],
    });
   }

  // public async Updateproduct(){
  //   const produc = this.productForm.value;
  //   this.productsService.updateProduct(this.productsService.pos, produc);

  //   const toast = await this.toastController.create({
  //     message: "Producto actualizado",
  //     duration: 2000,
  //     position: 'bottom',

  //   });
  //   console.log(produc);
  //   toast.present();
  //   this.router.navigate(['/tabs/tab1']);
  // }

  ngOnInit() {
    this.loadProduct();
  }

  async loadProduct() {
    try {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.productId = id || '';
      });
  
      if (this.productId) {
        this.producto = await this.productService.getProductById(this.productId);
        if (this.producto) {
          this.productForm.patchValue(this.producto);
        } else {
          console.error('Producto no encontrado');
        }
      } else {
        console.error('ID del producto no válido');
      }
    } catch (error) {
      console.error('Error al cargar el producto', error);
    }
  }
  
  async updateProduct() {
    try {
      if (this.producto && this.producto.id) {
        const product = this.productForm.value;
        await this.productService.updateProduct(this.producto.id, product);

        const toast = await this.toastController.create({
          message: 'Producto actualizado',
          duration: 2000,
          position: 'bottom',
        });

        toast.present();
        this.router.navigate(['/tabs/tab1']);
      } else {
        console.error('ID del producto no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar el producto', error);
    }
  }
}
