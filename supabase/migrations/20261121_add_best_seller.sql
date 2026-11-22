-- Add the Best Seller flag without changing existing menu data.
ALTER TABLE public.menu_items
ADD COLUMN IF NOT EXISTS is_best_seller boolean NOT NULL DEFAULT false;
