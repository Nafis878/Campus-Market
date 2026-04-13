
/*
  # Campus Marketplace Schema

  ## Overview
  Sets up the database for a simple campus marketplace where students can post and browse items for sale.

  ## New Tables

  ### products
  - `id` (uuid, primary key) - Unique product identifier
  - `user_id` (uuid, references auth.users) - The student who posted the item
  - `title` (text) - Product title
  - `price` (numeric) - Price in local currency
  - `description` (text) - Product description
  - `image_url` (text) - URL to the uploaded product image
  - `created_at` (timestamptz) - When the listing was created

  ## Security
  - RLS enabled on products table
  - Authenticated users can insert their own products
  - Everyone can view all products (marketplace is public)
  - Only the owner can update or delete their product
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_user_id_idx ON products(user_id);
