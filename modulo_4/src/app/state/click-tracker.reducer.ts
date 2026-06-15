import { createReducer, on } from '@ngrx/store';
import * as ClickTrackerActions from './click-tracker.actions';

export interface TrackerState {
  clickCounts: { [tag: string]: number };
  cart: ClickTrackerActions.CartItem[];
}

export const initialState: TrackerState = {
  clickCounts: {},
  cart: [],
};

export const clickTrackerReducer = createReducer(
  initialState,
  on(ClickTrackerActions.trackClick, (state, { tag }) => {
    const clickCounts = { ...state.clickCounts };
    clickCounts[tag] = (clickCounts[tag] || 0) + 1;
    return {
      ...state,
      clickCounts,
    };
  }),
  on(ClickTrackerActions.addToCart, (state, { item }) => {
    return {
      ...state,
      cart: [...state.cart, item],
    };
  }),
  on(ClickTrackerActions.removeFromCart, (state, { index }) => {
    return {
      ...state,
      cart: state.cart.filter((_, i) => i !== index),
    };
  }),
  on(ClickTrackerActions.checkout, (state) => {
    return {
      ...state,
      cart: [],
    };
  })
);
