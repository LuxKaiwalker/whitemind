import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { TokenService } from '../token.service';
import { FormsModule } from '@angular/forms';


import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  email:string = "";
  username:string = "";
  password:string = "";

  //api request setup
  readonly ROOT_URL = 'https://backmind.icinoxis.net';

  token:string = "";

  //api request handling (experiment)
  get(){
    let url = `${this.ROOT_URL}/`;
    this.http.get(url).subscribe((response: any) => {console.log('Response:', response);});
  }



  onSubmit(event: any, email:string, password:string){
    event.preventDefault();

    
    const payload = {
      user: {
        email: `${email}`,
        plain_password: `${password}`
      }
    };
    
    fetch(`${this.ROOT_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
  })
      .then((response) => response.json())
      .then((data) => {console.log(data); this.token = data.token; 
        this.tokenService.setToken(this.token);});
  }
}
