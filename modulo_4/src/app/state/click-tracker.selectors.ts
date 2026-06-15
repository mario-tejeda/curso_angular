import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackerState } from './click-tracker.reducer';

export const selectTrackerState = createFeatureSelector<TrackerState>('tracker');

export const selectClickCounts = createSelector(
  selectTrackerState,
  (state) => state.clickCounts
);

export const selectCart = createSelector(
  selectTrackerState,
  (state) => state.cart
);

export const selectCartCount = createSelector(
  selectCart,
  (cart) => cart.length
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart) => cart.reduce((sum, item) => sum + item.price, 0)
);
