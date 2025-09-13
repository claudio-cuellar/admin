import { inject } from '@angular/core';
import { AppInitializationService } from '../services/app-initialization/app-initialization.service';

export function appInitializerFactory() {
  const appInitService = inject(AppInitializationService);
  
  return (): Promise<void> => {
    return appInitService.initialize();
  };
}