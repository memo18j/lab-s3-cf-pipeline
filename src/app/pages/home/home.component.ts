import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../shared/services/profile.service';
import { CognitoService } from '../../shared/services/cognito.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink, // Necesario para routerLink
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public isLoggedIn: boolean = false;
 

  private readonly cognitoService = inject(CognitoService);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  public userProfile = this.profileService.userProfile;

  public ngOnInit(): void {
    console.log(this.userProfile());
    
    if (this.userProfile()) {
      this.isLoggedIn = true;
    }
  }
  public logout(): void {
    console.log('Cerrando sesión...');
    this.isLoggedIn = false;
     sessionStorage.removeItem('session_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_username');
    this.cognitoService.handleSignOut().then (() => {
       console.log('Sesión cerrada correctamente');
       this.router.navigate(['/']);
    }
    ).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    }
    );

    // Aquí puedes implementar la lógica de cierre de sesión
  }
}
