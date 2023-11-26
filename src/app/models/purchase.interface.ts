import { Product } from "./product.model";

export interface Purchase {
  fecha: Date;
  user: string;
  productos: { product: Product; quantity: number }[];
}
