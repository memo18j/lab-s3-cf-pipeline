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
    FormsModule, 
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public hidePassword = true;

  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  private readonly router = inject(Router);
  private readonly cognitoService = inject(CognitoService);
  
  public onSubmit():void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      const { username, password, name } = this.registerForm.value;
      this.cognitoService
        .handleSignUp({
          username: username!,
          password: password!,
          email: username!,
          name: name!,
        })
        .then((result) => {
          console.log('Sign up result:', result);
          if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
            this.router.navigate(['/confirm', username]);
          }
        })
        .catch((error) => {
          console.error('Error signing up:', error);
        });
    }
  }
  public goToLogin():void {
    this.router.navigate(['/']);
  }
}
