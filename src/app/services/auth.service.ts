import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    // Subscribe to auth state changes
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Register new user
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(this.auth);
      // redirect to login page
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
} 