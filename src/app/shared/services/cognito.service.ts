import { Injectable } from '@angular/core';

import {
  signUp,
  confirmSignUp,
  type ConfirmSignUpInput,
  autoSignIn,
  SignUpOutput,
  SignInInput,
  signIn,
  signOut,
  getCurrentUser,
  JWT,
  fetchAuthSession,
  ConfirmSignUpOutput,
  SignInOutput,
  GetCurrentUserOutput,
} from '@aws-amplify/auth';

interface SignUpParameters {
  username: string;
  password: string;
  email: string;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  public async handleSignUp({
    username,
    password,
    email,
    name,
  }: SignUpParameters): Promise<SignUpOutput> {
    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
          autoSignIn: true,
        },
      });

      return result;
    } catch (error) {
      console.log('error signing up:', error);
      throw error;
    }
  }
  public async handleSignUpConfirmation({
    username,
    confirmationCode,
  }: ConfirmSignUpInput): Promise<ConfirmSignUpOutput> {
    try {
      const result = await confirmSignUp({
        username,
        confirmationCode,
      });
      console.log('Sign up confirmed:', result);
      
      return result;

    } catch (error) {
      console.log('error confirming sign up', error);
      throw error;
    }
  }

  public async handleAutoSignIn(): Promise<SignInOutput> {
    try {
      const result = await autoSignIn();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  public async handleSignIn({
    username,
    password,
  }: SignInInput): Promise<SignInOutput> {
    try {
      const result = await signIn({
        username,
        password,
      });
      return result;
    } catch (error) {
      console.log('error signing in', error);
      throw error;
    }
  }

  async handleSignOut() {
    try {
      await signOut();
      return true;
    } catch (error) {
      console.log('error signing out', error);
      throw error;
    }
  }

  async currentAuthenticatedUser(): Promise<GetCurrentUserOutput> {
    try {
      // const { username, userId /* , signInDetails */ } = await getCurrentUser();
      // const userInfo = {
      //   username,
      //   userId,
      // };
       const result = await getCurrentUser();
       console.log('Current authenticated user:', result);
       

     
      return result;
    } catch (error) {
      console.error('Error fetching current authenticated user:', error);
      throw error;
    }
  }

  async currentSession(): Promise<JWT> {
    try {
      const { /* accessToken, */ idToken } =
        (await fetchAuthSession()).tokens ?? {};
      return idToken as JWT;
    } catch (error) {
      console.error('Error fetching current session:', error);
      throw error;
    }
  }
}
