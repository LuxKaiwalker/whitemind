import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // This makes the service available globally
})
export class TokenService {

  constructor() { }

  private token: string = '';

  setToken(token: string): void {
    this.token = token;

    console.log('Token set:', this.token);
  }

  getToken(): string {

    console.log('Token get:', this.token);
    
    return this.token;
  }
}
