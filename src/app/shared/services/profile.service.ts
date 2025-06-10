import { Injectable, signal, WritableSignal } from '@angular/core';

export interface UserProfile {
  id:string;
  email: string;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public userProfile: WritableSignal<UserProfile| null> = signal<UserProfile | null>(
    null
  );
}
