import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppMapComponent } from './components/map/map.component';
import { CartComponent } from './components/cart/cart.component';
import { ClickTrackerDirective } from './shared/click-tracker.directive';
import { addToCart, removeFromCart, checkout, CartItem } from './state/click-tracker.actions';
import { selectCart, selectCartTotal, selectClickCounts } from './state/click-tracker.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AppMapComponent, CartComponent, ClickTrackerDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private store = inject(Store);

  cartItems$ = this.store.select(selectCart);
  cartTotal$ = this.store.select(selectCartTotal);
  clickCounts$ = this.store.select(selectClickCounts);

  onItemAdded(item: CartItem): void {
    this.store.dispatch(addToCart({ item }));
  }

  onRemoveItem(index: number): void {
    this.store.dispatch(removeFromCart({ index }));
  }

  onCheckout(): void {
    this.store.dispatch(checkout());
  }
}
