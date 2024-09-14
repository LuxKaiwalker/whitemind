import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // This makes the service available globally
})
export class TokenService {

  constructor() { }

  private token: string = '';

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
}
