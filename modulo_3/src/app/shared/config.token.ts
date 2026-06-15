import { InjectionToken } from '@angular/core';

export interface StoreConfig {
  storeName: string;
  apiEndpoint: string;
  defaultCurrency: string;
}

export const STORE_CONFIG = new InjectionToken<StoreConfig>('store.config');

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Catálogo de Inventario Premium',
  apiEndpoint: 'http://localhost:3000/api',
  defaultCurrency: 'USD'
};
