export interface Product {
  id: string;
  user_id: string;
  title: string;
  price: number;
  description: string;
  image_url: string;
  created_at: string;
  seller_name?: string;
}

export type Page = 'home' | 'login' | 'register' | 'add-product' | 'product-detail';
