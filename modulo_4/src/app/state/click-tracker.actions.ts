import { createAction, props } from '@ngrx/store';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurantId: string;
  restaurantName: string;
}

export const trackClick = createAction(
  '[Click Tracker] Track Click',
  props<{ tag: string }>()
);

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ item: CartItem }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ index: number }>()
);

export const checkout = createAction(
  '[Cart] Checkout'
);
