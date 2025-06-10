import { Routes } from '@angular/router';
import { guardGuard } from './shared/guards/guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'confirm/:username',
    loadComponent: () =>
      import('./pages/confirm/confirm.component').then(
        (m) => m.ConfirmComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [guardGuard],
  },
];
