import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ProductRepository } from './product.repository';
import { Product } from '../models/product.model';
import { STORE_CONFIG, StoreConfig } from '../../shared/config.token';
import { OfflineDatabaseService } from '../db/offline-db.service';
import { LoggerService } from '../../shared/logger.service';
import * as ProductActions from '../state/product.actions';

@Injectable({
  providedIn: 'root'
})
export class HttpProductRepository extends ProductRepository {
  constructor(
    private http: HttpClient,
    @Inject(STORE_CONFIG) private config: StoreConfig,
    private dexieDb: OfflineDatabaseService,
    private logger: LoggerService,
    private store: Store
  ) {
    super();
    this.logger.log('HttpProductRepository instanciado.');
  }

  getProducts(): Observable<Product[]> {
    this.logger.log('Obteniendo productos desde el API HTTP...');
    return this.http.get<Product[]>(`${this.config.apiEndpoint}/products`).pipe(
      tap(products => {
        this.logger.log(`Se obtuvieron ${products.length} productos del servidor.`);
      })
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    this.logger.log(`Agregando producto al servidor: ${JSON.stringify(product)}`);
    return this.http.post<Product>(`${this.config.apiEndpoint}/products`, product).pipe(
      tap({
        next: async (newProduct) => {
          this.logger.log(`Producto guardado en API. Guardando asíncronamente en Dexie: ${newProduct.name}`);
          try {
            // Asynchronously add to Dexie DB (Requirement 10)
            await this.dexieDb.products.put(newProduct);
            this.logger.log(`Producto '${newProduct.name}' agregado con éxito en Dexie (ID: ${newProduct.id}).`);
            
            // Dispatch to Redux from the service (Requirement 8)
            this.store.dispatch(ProductActions.addProductSuccess({ product: newProduct }));
            this.logger.log(`Acción addProductSuccess despachada a Redux desde el servicio.`);
          } catch (err: any) {
            this.logger.warn(`Error al procesar el guardado del producto: ${err.message}`);
          }
        }
      })
    );
  }
}

