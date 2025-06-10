import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoService } from '../../shared/services/cognito.service';
import { ProfileService } from '../../shared/services/profile.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule, // O ReactiveFormsModule si usas formularios reactivos
    ReactiveFormsModule, // Usaremos ReactiveFormsModule en este ejemplo
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public hidePassword = true;

  public loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  private readonly router = inject(Router);
  private readonly cognitoService = inject(CognitoService);
  private readonly userProfileS = inject(ProfileService);
  private readonly profile = this.userProfileS.userProfile;

  public async onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const { username, password } = this.loginForm.value;
      if (username && password) {
        const isSignedIn: any = await this.cognitoService.handleSignIn({
          username,
          password,
        });

        this.assignUserValues(isSignedIn);
      }
    }
  }

  public goToRegister() {
    this.router.navigate(['/register']);
  }

  async assignUserValues(isSignedIn: boolean) {
    if (isSignedIn) {
      const token = await this.cognitoService.currentSession();
      sessionStorage.setItem('session_token', token.toString());

      const user = await this.cognitoService.currentAuthenticatedUser();

      sessionStorage.setItem('user_id', user.userId);
      sessionStorage.setItem('user_username', user.username);

      const { username } = this.loginForm.value;
      const userProfile = {
        id: user.userId,
        email: username!,
        name: user.username,
      };
      this.profile.set(userProfile);

      this.router.navigate(['home']);
    }
  }
}
