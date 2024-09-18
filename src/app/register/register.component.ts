import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { TokenService } from '../token.service';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterOutlet, FooterComponent, HeaderComponent, FormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService) { }

  //api request setup
  readonly ROOT_URL = 'https://backmind.icinoxis.net';

  email: string = "";
  password: string = "";
  username: string = "";
  confirmPassword: string = "";

  token: string = "";

  register() {
    this.router.navigate(['/login']);
  }

  onSubmit(event: any, email: string, username:string, password: string, confirmPassword: string) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {

      const payload = {
        user: {
          email: `${email}`,
          brainet_tag: `${username}`,
          plain_password: `${password}`
        }
      };

      fetch(`${this.ROOT_URL}/api/user/is-taken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: {
          email: `${email}`,
          brainet_tag: `${username}`
        }}),
      })
        .then((response) => response.json())
        .then((data) => {console.log('Success:', data); if (data.taken) {alert("Username is taken.");}
    });
      
      fetch(`${this.ROOT_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {console.log('Success:', data); this.token = data.token; 
          this.tokenService.setToken(this.token);});
    }
  }
  }
