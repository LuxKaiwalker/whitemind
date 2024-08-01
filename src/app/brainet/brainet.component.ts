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
  usedBoxes: ExampleBox[][] = [[],[],[]];//dim 1: type of box; dim 2: num of box ; all boxes in use
  unusedBoxes: ExampleBox[] = []; // all boxes ready to be used
  message: string = '';
  position: {x: number, y: number} = {x: 0, y: 0};

  canvasInstance!: Canvas;

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


      //should work later
      this.addBox(0);
      this.addBox(1);
      this.addBox(2);


      this.canvasInstance = new Canvas(ctx);
  
  }

  ngOnChanges(){//nothing yet
  }

  /**
   * @brief function to add a new box to the screen
   * @param typ 
   * @note typ is the type of box to be added
   */
  addBox(typ: number){
    const newBox = new ExampleBox(typ, this.usedBoxes[typ].length + 1);
    this.unusedBoxes[typ] = newBox;
  }

  removeBox(box: ExampleBox){
    const typ:number = box.typ;
    const num:number = box.id;
    this.usedBoxes[typ].splice(num-1, 1);
    for (let i = num-1; i < this.usedBoxes[typ].length; i++) {
      this.usedBoxes[typ][i].id = i+1;
    }
  }

  /**
   * @brief function to be called when a drag event is detected
   * @param $event 
   * @param box
   * @note used to pass down component data to canvas
   */
  dragEnd($event: CdkDragEnd, box: ExampleBox) {
    console.log($event.source.getFreeDragPosition());

    this.message= $event.source.element.nativeElement.innerText;
    this.position= $event.source.getFreeDragPosition();

    const divElement = document.querySelector('.ui');
    const divHeight:number = divElement?.clientHeight || 0;
    
    const typ:number = box.typ;
    const num:number = box.id;
    if(this.unusedBoxes[typ] == box){
      this.usedBoxes[typ].push(box);
      this.addBox(typ);
    }
    if(this.position.x < 12) {
      this.removeBox(box);
    }
    // this.canvasInstance.drawBox(this.position.x, this.position.y, this.message);
  }

 /**
 * @brief function to be called when a drag event is detected
 * @param $event 
 * @param box
 * @note may be useful for drag and drop animations later
 */
  dragMoved($event: CdkDragMove, box: ExampleBox) {

    //this.canvasInstance.deleteLine(box, this.boxes[0][0]);

    box.position = $event.source.getFreeDragPosition();
    console.log(box.position);
    console.log(window.innerHeight)

    //this.canvasInstance.drawLine(box, this.boxes[0][0]);
  }

  /**
   * @brief function to be called when a drag event starts.
   * mainly used to update drag panel to check if we need to spawn new box
   * @param $event 
   * @param box 
   */
  dragStart($event: CdkDragStart, box: ExampleBox){

    
  }

  newBoxStart($event: CdkDragStart, typ: number){
    
  }
}