import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CartItem } from '../../state/click-tracker.actions';
import { ClickTrackerDirective } from '../../shared/click-tracker.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ClickTrackerDirective],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  animations: [
    // 1. Badge Animation: triggers when the cart count updates
    trigger('badgePulse', [
      transition('* => *', [
        animate('300ms ease-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.4)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1.0 })
        ]))
      ])
    ]),
    // 2. List Animation: for items entering and leaving the cart list
    trigger('itemFadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('250ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-30px)' }))
      ])
    ]),
    // 3. Success Message Animation: slides down when order is checked out
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class CartComponent implements OnChanges {
  @Input() cartItems: CartItem[] = [];
  @Input() cartTotal = 0;
  @Input() clickCounts: { [tag: string]: number } = {};

  @Output() removeItem = new EventEmitter<number>();
  @Output() checkoutCart = new EventEmitter<void>();

  checkoutSuccess = false;
  badgeState = 0;

  ngOnChanges(changes: SimpleChanges): void {
    // Increment badgeState to trigger the badgePulse animation on cartItems length change
    if (changes['cartItems']) {
      this.badgeState = this.cartItems.length;
    }
  }

  onCheckout(): void {
    if (this.cartItems.length === 0) return;
    this.checkoutCart.emit();
    this.checkoutSuccess = true;
    
    // Auto-dismiss checkout success notification after 4 seconds
    setTimeout(() => {
      this.checkoutSuccess = false;
    }, 4000);
  }

  // Convert click counts dictionary into key-value pairs for template rendering
  get clickStats() {
    return Object.keys(this.clickCounts).map(key => ({
      tag: key,
      count: this.clickCounts[key]
    }));
  }
}
