import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CanvasShapes } from './canvas.shapes';



@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  @Input() message: string = '';
  @Input() position: {x: number, y: number} = {x: 0, y: 0};
  
  ngOnInit(){
    const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  ngOnChanges(changes: SimpleChanges){
      const ctx = this.myCanvas.nativeElement.getContext('2d');

      if(ctx){
          CanvasShapes.drawExampleBox(ctx, this.position.x, this.position.y, this.message);
      }
  }

}
