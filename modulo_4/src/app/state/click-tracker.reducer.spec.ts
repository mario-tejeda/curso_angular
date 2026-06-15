import { clickTrackerReducer, initialState, TrackerState } from './click-tracker.reducer';
import * as ClickTrackerActions from './click-tracker.actions';

describe('Click Tracker Reducer (Pure Functions Testing)', () => {
  it('should return the initial state for an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;
    const state = clickTrackerReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it('should track clicks and increment counts without mutating the original state', () => {
    const tag = 'marker-click-pizza-1';
    const action = ClickTrackerActions.trackClick({ tag });

    // Freeze the input states to guarantee immutability (purity test)
    Object.freeze(initialState);
    Object.freeze(initialState.clickCounts);

    const firstState = clickTrackerReducer(initialState, action);
    expect(firstState.clickCounts[tag]).toBe(1);
    expect(firstState.clickCounts).not.toBe(initialState.clickCounts); // Checks new reference

    // Freeze firstState and track again
    Object.freeze(firstState);
    Object.freeze(firstState.clickCounts);

    const secondState = clickTrackerReducer(firstState, action);
    expect(secondState.clickCounts[tag]).toBe(2);
  });

  it('should add food items to the cart list without mutating state', () => {
    const item: ClickTrackerActions.CartItem = {
      id: 'p-1',
      name: 'Pizza Margherita',
      price: 12.99,
      restaurantId: 'pizza-1',
      restaurantName: 'Pizzería Bella'
    };
    const action = ClickTrackerActions.addToCart({ item });

    Object.freeze(initialState);
    Object.freeze(initialState.cart);

    const nextState = clickTrackerReducer(initialState, action);
    expect(nextState.cart.length).toBe(1);
    expect(nextState.cart[0]).toEqual(item);
    expect(nextState.cart).not.toBe(initialState.cart);
  });

  it('should remove items from the cart list by index without mutating state', () => {
    const item1: ClickTrackerActions.CartItem = { id: 'p-1', name: 'Pizza', price: 10, restaurantId: 'r-1', restaurantName: 'R1' };
    const item2: ClickTrackerActions.CartItem = { id: 'b-1', name: 'Burger', price: 8, restaurantId: 'r-2', restaurantName: 'R2' };
    
    const preState: TrackerState = {
      clickCounts: {},
      cart: [item1, item2]
    };

    Object.freeze(preState);
    Object.freeze(preState.cart);

    const action = ClickTrackerActions.removeFromCart({ index: 0 });
    const nextState = clickTrackerReducer(preState, action);

    expect(nextState.cart.length).toBe(1);
    expect(nextState.cart[0]).toEqual(item2);
    expect(nextState.cart).not.toBe(preState.cart);
  });

  it('should clear the cart list on checkout without mutating state', () => {
    const item: ClickTrackerActions.CartItem = { id: 'p-1', name: 'Pizza', price: 10, restaurantId: 'r-1', restaurantName: 'R1' };
    const preState: TrackerState = {
      clickCounts: { 'some-tag': 5 },
      cart: [item]
    };

    Object.freeze(preState);
    Object.freeze(preState.cart);

    const action = ClickTrackerActions.checkout();
    const nextState = clickTrackerReducer(preState, action);

    expect(nextState.cart.length).toBe(0);
    expect(nextState.clickCounts['some-tag']).toBe(5); // Clicks should remain
    expect(nextState.cart).not.toBe(preState.cart);
  });
});
