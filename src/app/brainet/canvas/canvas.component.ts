import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  ngOnInit(){
    const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      this.#drawRectangle(context);
      this.#drawTriangle(context);
    }
  }
  #drawRectangle(context: CanvasRenderingContext2D) {
    context.fillStyle = 'red';
    context.fillRect(10, 10, 100, 100);
    context.clearRect(20, 20, 50, 50);
  }

  #drawTriangle(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(150,70);
    context.lineTo(200,20);
    context.lineTo(200, 120);
    context.lineTo(150,70);
    context.fill();
  }
}
