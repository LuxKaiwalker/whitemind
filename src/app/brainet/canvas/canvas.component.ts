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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    if(ctx){

    }

  }
  drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number){
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke
  }
}
