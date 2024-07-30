import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Canvas } from './brainet.canvas'

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DragDropModule, NgFor, CommonModule],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})

export class BrainetComponent implements OnInit, OnChanges {

  @ViewChild('canvas', { static: true })
  myCanvas!: ElementRef;

  //list of all boxes on screen or available
  boxes: string[][] = [];//dim 1: type of box; dim 2: num of box
  message: string = '';
  position: {x: number, y: number} = {x: 0, y: 0};

  canvasInstance!: Canvas;

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


      this.canvasInstance = new Canvas(ctx);
  
  }

  ngOnChanges(){//nothing yet
  }

  addBox(typ: number){
    if(!this.boxes[typ]){//constructor for new box category if not initialized
      this.boxes[typ] = [];
    }
    const newBox = `box nummer ${this.boxes[typ].length + 1}, typ:${typ}`;
    this.boxes[typ].push(newBox);
  }

  /**
   * @brief function to be called when a drag event is detected
   * @param $event 
   * @note used to pass down component data to canvas
   */
  dragEnd($event: CdkDragEnd) {
    console.log($event.source.getFreeDragPosition());

    this.message= $event.source.element.nativeElement.innerText;
    this.position= $event.source.getFreeDragPosition();

    this.canvasInstance.draw(this.position.x, this.position.y, this.message);
  }

 /**
 * @brief function to be called when a drag event is detected
 * @param $event 
 * @note may be useful for drag and drop animations later
 */
  dragMoved($event: CdkDragMove) {
   //console.log($event.source.getFreeDragPosition());
  }

    /**
     * @brief draw the og test draggable box onto the canvas
     * @param ctx 
     * @param x 
     * @param y 
     * @note TODO: ajust type of ctx
     */
    /*draw(ctx: any, x:number, y:number, message: string) {
        const width = 200;
        const height = 200;
        const borderRadius = 4;
        const borderColor = '#ccc';
        const borderWidth = 1;
        const backgroundColor = '#fff';
        const textColor = 'rgba(0, 0, 0, 0.87)';
        const boxShadow = [
        { x: 0, y: 3, blur: 1, spread: -2, color: 'rgba(0, 0, 0, 0.2)' },
        { x: 0, y: 2, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.14)' },
        { x: 0, y: 1, blur: 5, spread: 0, color: 'rgba(0, 0, 0, 0.12)' }
        ];
    
        ctx.save();
    
        // Draw box shadow
        boxShadow.forEach(shadow => {
        ctx.shadowOffsetX = shadow.x;
        ctx.shadowOffsetY = shadow.y;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowColor = shadow.color;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, x, width, height);
        ctx.shadowOffsetY = shadow.y;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowColor = shadow.color;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, x, width, height);
        });
    
        ctx.restore();
        
        // Draw border and background
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, x);
        ctx.lineTo(x + width - borderRadius, x);
        ctx.quadraticCurveTo(x + width, x, x + width, x + borderRadius);
        ctx.lineTo(x + width, x + height - borderRadius);
        ctx.quadraticCurveTo(x + width, x + height, x + width - borderRadius, x + height);
        ctx.lineTo(x + borderRadius, x + height);
        ctx.quadraticCurveTo(x, x + height, x, x + height - borderRadius);
        ctx.lineTo(x, x + borderRadius);
        ctx.quadraticCurveTo(x, x, x + borderRadius, x);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw centered text
        ctx.fillStyle = textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.message, x + width / 2, x + height / 2);
    }*/

}