import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Canvas } from './canvas/brainet.canvas'

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

}