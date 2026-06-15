import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggerService } from '../shared/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      this.logger.log('Acceso concedido por AuthGuard.');
      return true;
    }
    
    this.logger.warn('Acceso denegado por AuthGuard. Redirigiendo a /login.');
    return this.router.parseUrl('/login');
  }
}
