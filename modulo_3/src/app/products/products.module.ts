import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { ProductListComponent } from './product-list.component';
import { ProductAddComponent } from './product-add.component';
import { ProductRepository } from './repositories/product.repository';
import { HttpProductRepository } from './repositories/http-product.repository';
import { OfflineDatabaseService } from './db/offline-db.service';
import { productReducer } from './state/product.reducer';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StoreModule.forFeature('products', productReducer)
  ],
  providers: [
    OfflineDatabaseService,
    // Requirement 4: useClass configuration linking base class/interface to concrete subclass
    { provide: ProductRepository, useClass: HttpProductRepository }
  ],
  exports: [
    ProductListComponent,
    ProductAddComponent
  ]
})
export class ProductsModule { }
