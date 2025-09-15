import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, distinctUntilChanged, shareReplay } from 'rxjs';
import { User } from '@models/user.model';

export interface AppState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  // Private state subjects
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  readonly user$ = this.userSubject.asObservable().pipe(distinctUntilChanged());
  readonly isLoading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());
  readonly error$ = this.errorSubject.asObservable().pipe(distinctUntilChanged());
  
  // Computed observables
  readonly isAuthenticated$ = this.user$.pipe(
    map(user => user !== null),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // Combined app state
  readonly appState$: Observable<AppState> = combineLatest([
    this.user$,
    this.isLoading$,
    this.isAuthenticated$,
    this.error$
  ]).pipe(
    map(([user, isLoading, isAuthenticated, error]) => ({
      user,
      isLoading,
      isAuthenticated,
      error
    })),
    shareReplay(1)
  );

  // Getters for current values
  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  get currentError(): string | null {
    return this.errorSubject.value;
  }

  // State update methods
  setUser(user: User | null): void {
    this.userSubject.next(user);
    this.clearError();
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // Reset state (for logout)
  resetState(): void {
    this.userSubject.next(null);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }

  // Update user partially
  updateUser(updates: Partial<User>): void {
    const currentUser = this.currentUser;
    if (currentUser) {
      this.setUser({ ...currentUser, ...updates });
    }
  }
}