// purchase.interface.ts
import { Product } from './product.model';

export interface Purchase {
  fecha: string;
  productos: { product: Product, quantity: number }[];
}
