import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from './models/product.model';
import { ProductRepository } from './repositories/product.repository';
import { selectAllProducts, selectProductsLoading, selectProductsError } from './state/product.selectors';
import * as ProductActions from './state/product.actions';
import { STORE_CONFIG, StoreConfig } from '../shared/config.token';
import { OfflineDatabaseService } from './db/offline-db.service';
import { LoggerService } from '../shared/logger.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  template: `
    <div class="list-container">
      <header class="list-header">
        <div>
          <h1>{{ config.storeName }}</h1>
          <p class="subtitle">Catálogo de Productos en Tiempo Real</p>
        </div>
        <div class="actions">
          <a routerLink="/products/add" class="btn-primary">
            <span class="icon">+</span> Agregar Producto
          </a>
        </div>
      </header>

      <!-- Dexie database metrics panel -->
      <div class="metrics-panel">
        <div class="metric-card">
          <div class="metric-icon">💾</div>
          <div class="metric-info">
            <span class="metric-value">{{ localCacheCount }}</span>
            <span class="metric-label">Productos en Caché Local (Dexie)</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🌐</div>
          <div class="metric-info">
            <span class="metric-value">{{ (products$ | async)?.length || 0 }}</span>
            <span class="metric-label">Productos en Servidor (API Express)</span>
          </div>
        </div>
      </div>

      <!-- State views -->
      <div *ngIf="loading$ | async" class="loading-spinner">
        Cargando catálogo...
      </div>

      <div *ngIf="error$ | async as error" class="error-banner">
        Error al cargar catálogo: {{ error }}
      </div>

      <div class="products-grid" *ngIf="!(loading$ | async)">
        <div class="product-card" *ngFor="let product of products$ | async">
          <div class="product-badge">{{ product.category }}</div>
          <h3 class="product-title">{{ product.name }}</h3>
          
          <div class="product-details">
            <div class="detail-row">
              <span class="detail-label">Precio:</span>
              <span class="detail-value price">{{ product.price | currency: config.defaultCurrency }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stock:</span>
              <span class="detail-value stock" [class.low-stock]="product.stock < 10">
                {{ product.stock }} unidades
              </span>
            </div>
          </div>
        </div>
        
        <div *ngIf="((products$ | async)?.length === 0)" class="empty-state">
          <p>No hay productos registrados en el catálogo.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1.5rem;
    }
    h1 {
      margin: 0;
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      margin: 0.25rem 0 0 0;
      font-size: 1rem;
    }
    .actions .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .actions .btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .metrics-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .metric-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .metric-icon {
      font-size: 2.2rem;
    }
    .metric-info {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }
    .metric-label {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .loading-spinner {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
      font-size: 1.1rem;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.5rem;
      position: relative;
      transition: all 0.2s ease;
      text-align: left;
    }
    .product-card:hover {
      transform: translateY(-3px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .product-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .product-title {
      margin: 0 0 1.25rem 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      padding-right: 4.5rem;
    }
    .product-details {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    .detail-label {
      color: #64748b;
    }
    .detail-value {
      color: #e2e8f0;
      font-weight: 500;
    }
    .price {
      color: #10b981;
      font-weight: 700;
      font-size: 1.05rem;
    }
    .stock.low-stock {
      color: #f59e0b;
      font-weight: 600;
    }
    .empty-state {
      grid-column: 1 / -1;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #64748b;
      text-align: center;
      font-size: 1.1rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  localCacheCount = 0;

  constructor(
    private store: Store,
    // Requirement 4: ProductRepository abstract injection (which uses HttpProductRepository through useClass)
    private productRepository: ProductRepository,
    // Requirement 9: Dexie Database injection
    private dexieDb: OfflineDatabaseService,
    // Requirement 3: custom config token injection
    @Inject(STORE_CONFIG) public config: StoreConfig,
    private logger: LoggerService
  ) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
  }

  async ngOnInit(): Promise<void> {
    this.logger.log('Inicializando ProductListComponent...');
    
    // Load products from API and update Redux Store
    this.store.dispatch(ProductActions.loadProducts());
    this.productRepository.getProducts().subscribe({
      next: (products) => {
        this.store.dispatch(ProductActions.loadProductsSuccess({ products }));
        // Also update local cache counts
        this.updateDexieCount();
      },
      error: (err) => {
        this.store.dispatch(ProductActions.loadProductsFailure({ error: err.message || 'Error desconocido' }));
        this.logger.warn(`Error al cargar catálogo en componente: ${err.message}`);
        // Fallback: load from Dexie if offline
        this.loadFromDexieFallback();
      }
    });
  }

  async updateDexieCount(): Promise<void> {
    try {
      this.localCacheCount = await this.dexieDb.products.count();
      this.logger.log(`Total de productos guardados localmente en Dexie: ${this.localCacheCount}`);
    } catch (err: any) {
      this.logger.warn(`Error al contar Dexie DB: ${err.message}`);
    }
  }

  async loadFromDexieFallback(): Promise<void> {
    this.logger.log('Cargando productos de la base de datos local Dexie como respaldo...');
    try {
      const offlineProducts = await this.dexieDb.products.toArray();
      this.localCacheCount = offlineProducts.length;
      this.store.dispatch(ProductActions.loadProductsSuccess({ products: offlineProducts }));
      this.logger.log(`Cargados ${offlineProducts.length} productos de respaldo de Dexie.`);
    } catch (err: any) {
      this.logger.warn(`Error al cargar respaldo de Dexie: ${err.message}`);
    }
  }
}
