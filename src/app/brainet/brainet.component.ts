import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CanvasComponent, DragDropModule, NgFor, CommonModule],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})

export class BrainetComponent{

  //list of all boxes on screen or available
  boxes: string[][] = [];//dim 1: type of box; dim 2: num of box
  message: string = '';
  position: {x: number, y: number} = {x: 0, y: 0};

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

    this.message = $event.source.element.nativeElement.innerText;
    this.position = $event.source.getFreeDragPosition();
  }

 /**
 * @brief function to be called when a drag event is detected
 * @param $event 
 * @note may be useful for drag and drop animations later
 */
  dragMoved($event: CdkDragMove) {
    console.log($event.source.getFreeDragPosition());
  }

}