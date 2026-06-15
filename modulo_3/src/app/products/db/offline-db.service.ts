import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OfflineDatabaseService extends Dexie {
  products!: Table<Product, number>;

  constructor() {
    super('ProductCatalogDB');
    this.version(1).stores({
      products: 'id, name, price, stock, category'
    });
  }
}
