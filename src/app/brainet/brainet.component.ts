import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})
export class BrainetComponent{
  @ViewChild('canvas')
  private canvas: ElementRef = {} as ElementRef;

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 500;
    canvas.height = 500;

    // Draw a random rectangle
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const width = Math.random() * 100;
    const height = Math.random() * 100;
    if (context) {
      context.fillStyle = 'red';
    }
    if (context) {
      context.fillRect(x, y, width, height);
    }
  }
}


