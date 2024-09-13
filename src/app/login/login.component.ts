import { Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient) {}


  //api request setup
  readonly ROOT_URL = 'https://backmind.icinoxis.net';


  //dragdrop variables
  dragging: number = -1;
  panning: boolean = false;
  startx:number = 0;
  starty:number = 0;
  paneldrag: number = -1;


  //viewport variables
  viewportTransform = {
    x: 0,
    y: 0,
    scale: 1
  }
  transx: number = 0;
  transy: number = 0;

  moved:boolean = false;

  //api request handling
  get(){
    let url = `${this.ROOT_URL}/`;
    this.http.get(url).subscribe((response: any) => {console.log('Response:', response);});
  }



  onSubmit(event: any) {
    event.preventDefault();
    this.get();
  }
}
