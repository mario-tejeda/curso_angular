// Uncaught exception handler to prevent Mapbox GL or network errors from crashing the tests in headless CI
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Foodie Map E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Test 1: Verification of Map loading and marker click popups
  it('should render the Mapbox map container and open restaurant popups on marker click', () => {
    // Check main title
    cy.get('h1').should('contain.text', 'Foodie Map');

    // Verify map wrapper is rendered
    cy.get('app-map').should('exist');
    cy.get('.map-container').should('exist');

    // Click on Pizzería Bella's marker button
    // Our markup uses button with class map-marker-btn and text 'Pizzería Bella'
    cy.contains('.map-marker-btn', 'Pizzería Bella').click();

    // Verify popup is opened and menu is displayed
    cy.get('.mapboxgl-popup').should('exist');
    cy.get('.popup-title').should('contain.text', 'Pizzería Bella');
    cy.get('.popup-cuisine').should('contain.text', 'Italiana 🍕');
    
    // Verify menu items are visible in popup
    cy.get('.menu-item').should('have.length', 2);
    cy.get('.menu-item').eq(0).should('contain.text', 'Pizza Margherita');
  });

  // Test 2: Click tracking validation using Custom Directive and Redux
  it('should track clicks using the custom directive and reactively update stats using NgRx Redux', () => {
    // Initially, stats should be empty
    cy.get('.empty-stats').should('exist');

    // Click on the header logo to trigger tracking
    cy.get('.header-logo-title').click();

    // Check that stats section is no longer empty and shows the clicked tag
    cy.get('.empty-stats').should('not.exist');
    cy.get('.stat-card').should('have.length', 1);
    cy.get('.stat-tag').should('contain.text', 'logo-header');
    cy.get('.stat-count').should('contain.text', '1');

    // Click the logo header again
    cy.get('.header-logo-title').click();
    cy.get('.stat-count').should('contain.text', '2');

    // Open a restaurant popup (also tracked)
    cy.contains('.map-marker-btn', 'Burger Joint').click();

    // Click counts dashboard should now have 2 unique tracked tag cards (logo-header and marker-burger-1)
    cy.get('.stat-card').should('have.length', 2);
    cy.contains('.stat-tag', 'marker-burger-1').should('exist');
  });

  // Test 3: Shopping cart simulation and checkout with item adding, removal and animations
  it('should support adding, removing items from cart and completing checkout', () => {
    // Verify cart is initially empty
    cy.get('.empty-msg').should('exist');
    cy.get('.badge').should('contain.text', '0');

    // Open restaurant popup
    cy.contains('.map-marker-btn', 'Sushi Zen').click();

    // Add sushi rolls to cart
    cy.contains('.add-item-btn', 'Añadir +').first().click();

    // Cart should not be empty, badge updates to 1
    cy.get('.empty-msg').should('not.exist');
    cy.get('.badge').should('contain.text', '1');
    cy.get('.cart-item').should('have.length', 1);
    cy.get('.cart-item').first().should('contain.text', 'Maki de Salmón');
    cy.get('.total-price').should('contain.text', '$14.49');

    // Add soup to cart
    cy.contains('.add-item-btn', 'Añadir +').last().click();
    cy.get('.badge').should('contain.text', '2');
    cy.get('.cart-item').should('have.length', 2);
    cy.get('.total-price').should('contain.text', '$17.98'); // 14.49 + 3.49

    // Remove the first item
    cy.get('.remove-btn').first().click();
    cy.get('.badge').should('contain.text', '1');
    cy.get('.cart-item').should('have.length', 1);
    cy.get('.total-price').should('contain.text', '$3.49'); // only soup remains

    // Confirm checkout order
    cy.get('.checkout-btn').click();

    // Success banner should show, cart is reset to 0
    cy.get('.success-banner').should('exist').and('contain.text', 'Pedido procesado con éxito');
    cy.get('.badge').should('contain.text', '0');
    cy.get('.empty-msg').should('exist');
  });
});
