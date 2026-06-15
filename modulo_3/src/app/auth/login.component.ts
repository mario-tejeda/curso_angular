import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Accede al panel de administración de inventario</p>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="username" 
              required 
              placeholder="Ej. admin"
              autocomplete="username">
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              placeholder="••••••••"
              autocomplete="current-password">
          </div>
          
          <div class="error-message" *ngIf="error">
            Credenciales inválidas. Usa <strong>admin</strong> / <strong>admin</strong>.
          </div>
          
          <button type="submit" [disabled]="!loginForm.valid" class="btn-primary">
            Ingresar
          </button>
        </form>
        <div class="info-box">
          <p><strong>Info de acceso:</strong> admin / admin</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    .login-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
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
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    input {
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
    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    .error-message {
      color: #f87171;
      font-size: 0.85rem;
      background: rgba(248, 113, 113, 0.1);
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(248, 113, 113, 0.2);
    }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
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
    .btn-primary:active:not(:disabled) {
      transform: scale(0.98);
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .info-box {
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: #64748b;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1rem;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = false;
    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/products/add']);
    } else {
      this.error = true;
    }
  }
}
