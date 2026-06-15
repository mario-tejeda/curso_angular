import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../shared/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private logger: LoggerService) {}

  private hasToken(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  login(username: string, password: string): boolean {
    // Simple mock authentication
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      this.loggedInSubject.next(true);
      this.logger.log(`Usuario '${username}' ha iniciado sesión exitosamente.`);
      return true;
    }
    this.logger.warn(`Intento fallido de inicio de sesión para el usuario '${username}'.`);
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.loggedInSubject.next(false);
    this.logger.log('Sesión cerrada por el usuario.');
  }
}
