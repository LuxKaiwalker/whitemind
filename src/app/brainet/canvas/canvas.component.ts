import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';



@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  @Input() message: string = '';
  @Input() position: {x: number, y: number} = {x: 0, y: 0};
  
  ngOnInit(){
    const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    if(ctx){
      this.drawText(ctx, this.position.x, this.position.y, this.message);
    }
  
  }
  drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number){
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke
  }
  drawText(ctx: CanvasRenderingContext2D, x: number, y: number, text: string){
    ctx.font = '30px Arial';
    ctx.fillText(text, x, y);
  }
}
