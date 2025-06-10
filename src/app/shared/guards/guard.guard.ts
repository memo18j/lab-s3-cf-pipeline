import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = () => {
  const router$ = inject(Router);
  const storage$ = sessionStorage.getItem('session_token');
  if (storage$) return true;
  router$.navigate(['/']);
  return false;
};
