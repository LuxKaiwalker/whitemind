import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { TokenService } from '../token.service';


import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private http: HttpClient, private tokenService: TokenService) {}


  //api request setup
  readonly ROOT_URL = 'https://backmind.icinoxis.net';

  //viewport variables
  viewportTransform = {
    x: 0,
    y: 0,
    scale: 1
  }
  transx: number = 0;
  transy: number = 0;

  moved:boolean = false;

  token:string = "";

  //api request handling
  get(){
    let url = `${this.ROOT_URL}/`;
    this.http.get(url).subscribe((response: any) => {console.log('Response:', response);});
  }



  onSubmit(event: any) {
    event.preventDefault();
    this.get();

    this.token = "0a98vzfwhio3ruqjn";//this is a placeholder token

    this.tokenService.setToken(this.token);
  }
}
