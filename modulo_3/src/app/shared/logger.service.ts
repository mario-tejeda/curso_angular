import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string): void {
    console.log(`[Base Logger] ${message}`);
  }
  
  warn(message: string): void {
    console.warn(`[Base Logger WARNING] ${message}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedLoggerService extends LoggerService {
  override log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`%c[ADVANCED LOG] %c${timestamp} %c- ${message}`, 'color: #3b82f6; font-weight: bold;', 'color: #10b981;', 'color: inherit;');
  }

  override warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`%c[ADVANCED WARN] %c${timestamp} %c- ${message}`, 'color: #f59e0b; font-weight: bold;', 'color: #10b981;', 'color: inherit;');
  }
}
