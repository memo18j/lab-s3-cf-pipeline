import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
import { CognitoService } from '../../shared/services/cognito.service';
import { ConfirmSignUpOutput, SignInOutput } from '@aws-amplify/auth';
import { Router } from '@angular/router';
import { ProfileService } from '../../shared/services/profile.service';
@Component({
  selector: 'app-confirm',
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
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
  @Input() public username: string = '';

  public hidePassword = true;
  public confirmForm = new FormGroup({
    confirmationCode: new FormControl('', Validators.required),
  });
  private readonly cognitoService = inject(CognitoService);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);

  public userProfile = this.profileService.userProfile;
  public async onSubmit(): Promise<void> {
    if (this.confirmForm.valid) {
      const { confirmationCode } = this.confirmForm.value;

      try {
        const confirm: ConfirmSignUpOutput =
          await this.cognitoService.handleSignUpConfirmation({
            username: this.username,
            confirmationCode: confirmationCode!,
          });

        if (!confirm.isSignUpComplete) {
          const isSignedIn: SignInOutput =
            await this.cognitoService.handleAutoSignIn();
          this.assignUserValues(isSignedIn.isSignedIn);
        } else {
          this.assignUserValues(true);
        }
      } catch (error) {
        console.error('Error processing confirmation code:', error);
        return;
      }
    }
  }
  async assignUserValues(isSignedIn: boolean) {
    if (isSignedIn) {
      const token = await this.cognitoService.currentSession();
      sessionStorage.setItem('session_token', token.toString());

      const user =
        await this.cognitoService.currentAuthenticatedUser();

      sessionStorage.setItem('user_id', user.userId);
      sessionStorage.setItem('user_username', user.username);

      const userProfile = {
        id: user.userId,
        email: this.username,
        name: user.username,
      };
      this.userProfile.set(userProfile);

      this.router.navigate(['home']);
    }
  }
}
