import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  readonly ROOT_URL = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) { }

  login() {
    this.router.navigate(['/brainet']);
  }

  onSubmit() {
    
  }

}
