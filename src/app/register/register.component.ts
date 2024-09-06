import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterOutlet, FooterComponent, HeaderComponent ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  readonly ROOT_URL = 'http://localhost:3000';

  username: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private router: Router, private http: HttpClient) { }

  register() {
    this.router.navigate(['/login']);
  }

  onSubmit(username: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      this.http.post(this.ROOT_URL + '/register', {
        username: username,
        password: password
      }).subscribe((data) => {
        console.log(data);
      });
    }
    
  }

}
