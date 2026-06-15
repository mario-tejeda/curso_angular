import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductRepository } from './repositories/product.repository';
import { LoggerService } from '../shared/logger.service';

@Component({
  selector: 'app-product-add',
  standalone: false,
  template: `
    <div class="form-container">
      <div class="form-card">
        <header class="form-header">
          <h2>Agregar Nuevo Producto</h2>
          <p class="subtitle">Panel de Control de Inventario Protegido</p>
        </header>

        <form (ngSubmit)="onSubmit()" #productForm="ngForm">
          <div class="form-group">
            <label for="name">Nombre del Producto</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              [(ngModel)]="product.name" 
              required 
              placeholder="Ej. Silla de Escritorio Ergonómica">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Precio (USD)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                [(ngModel)]="product.price" 
                required 
                min="0.01" 
                step="0.01" 
                placeholder="0.00">
            </div>

            <div class="form-group">
              <label for="stock">Cantidad en Stock</label>
              <input 
                type="number" 
                id="stock" 
                name="stock" 
                [(ngModel)]="product.stock" 
                required 
                min="0" 
                placeholder="0">
            </div>
          </div>

          <div class="form-group">
            <label for="category">Categoría</label>
            <select id="category" name="category" [(ngModel)]="product.category" required>
              <option value="" disabled selected>Selecciona una categoría</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Audio">Audio</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Muebles">Muebles</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div class="actions">
            <button type="button" class="btn-secondary" routerLink="/products">
              Cancelar
            </button>
            <button type="submit" [disabled]="!productForm.valid" class="btn-primary">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      display: flex;
      justify-content: center;
      padding: 1rem 0;
    }
    .form-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 550px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      text-align: left;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    input, select {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    select option {
      background: #0f172a;
      color: #fff;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
    }
    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s ease, filter 0.2s ease;
    }
    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.1);
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class ProductAddComponent {
  product = {
    name: '',
    price: 0,
    stock: 0,
    category: ''
  };

  constructor(
    private productRepository: ProductRepository,
    private router: Router,
    private logger: LoggerService
  ) {}

  onSubmit(): void {
    this.logger.log(`Enviando formulario de producto: ${this.product.name}`);
    this.productRepository.addProduct(this.product).subscribe({
      next: (savedProduct) => {
        this.logger.log(`Producto guardado exitosamente: ${savedProduct.id}`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.logger.warn(`Error al guardar producto a través del repositorio: ${err.message}`);
      }
    });
  }
}
