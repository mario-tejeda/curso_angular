import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STORE_CONFIG, DEFAULT_STORE_CONFIG } from './config.token';
import { LoggerService, AdvancedLoggerService } from './logger.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: STORE_CONFIG, useValue: DEFAULT_STORE_CONFIG },
    AdvancedLoggerService,
    // Requirement 5: useExisting configurations
    { provide: LoggerService, useExisting: AdvancedLoggerService }
  ]
})
export class SharedModule { }
