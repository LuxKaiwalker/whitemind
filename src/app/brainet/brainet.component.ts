import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { Canvas } from './canvas/brainet.canvas'
import { ExampleBox } from './draggables/brainet.draggable';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, DragDropModule, NgFor, CommonModule],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})

export class BrainetComponent implements OnInit, OnChanges {

  @ViewChild('canvas', { static: true })
  myCanvas!: ElementRef;

  //list of all boxes on screen or available
  boxes: ExampleBox[][] = [];//dim 1: type of box; dim 2: num of box
  message: string = '';
  position: {x: number, y: number} = {x: 0, y: 0};

  canvasInstance!: Canvas;

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      this.addBox(0);
      this.addBox(1);
      this.addBox(2);


      this.canvasInstance = new Canvas(ctx);
  
  }

  ngOnChanges(){//nothing yet
  }

  addBox(typ: number){
    if(!this.boxes[typ]){//constructor for new box category if not initialized
      this.boxes[typ] = [];
    }
    const newBox = new ExampleBox(typ, this.boxes[typ].length + 1);
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

  dragStart($event: CdkDragStart){



    const typ:string = $event.source.element.nativeElement.innerText.slice(-1);//ajust later, quick workaround rn 
    if(this.boxes[+typ][-1].dragged === false){
    this.addBox(+typ);
    this.boxes[+typ][-1].dragged = true;
    }
  }
}