import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { Canvas } from './canvas/brainet.canvas'
import { Box } from './draggables/brainet.draggable';

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
  workspace: Box[] = [];//dim 1: num of box.
  arrows: {lineTo: number, lineFrom: number}[][] = [];//dim 1: different lines, dim2: if multiple boxes have same line

  box_count: number = 0;
  zindex_count: number = 10;

  canvasInstance!: Canvas;
  

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


      this.canvasInstance = new Canvas(ctx);

      this.newPanelBox(0);
      this.newPanelBox(1);
      this.newPanelBox(2);
      console.log(this.workspace);
  }

  ngOnChanges(){
  }


  // box handling
  newBox(typ: number, position: {x: number, y: number}) {
    this.workspace.push(new Box(typ, this.box_count++, this.zindex_count, position));
    this.workspace[this.workspace.length - 1].position = position;
    this.zindex_count++;
  }

  deleteBox(box: Box){
    this.workspace.splice(this.workspace.indexOf(box), 1);
  }

  newPanelBox(typ: number)
  {
    this.newBox(typ, {x: 20, y: typ*110 + 20});//60 = header area.
  }


  //drag handling

  dragStart($event: CdkDragStart, box: Box){
    if(box.in_panel)
    {
      this.newPanelBox(box.typ);
      box.in_panel = false;
    }
    
    box.zIndex = ++this.zindex_count;
  }

  dragMoved($event: CdkDragMove, box: Box) {

    this.canvasInstance.clearCanvas();//clear all that have been drawn

    const pos = $event.source.getFreeDragPosition();

    for (const arrow of this.arrows) {
      const lineTo = arrow.lineTo;
      const lineFrom = arrow.lineFrom;

      let pos1 = this.workspace[lineFrom].position;
      let pos2 = this.workspace[lineTo].position;
      if (lineFrom === box.id) {
        pos1 = pos;
      }
      if (lineTo === box.id) {
        pos2 = pos;
      }

      this.canvasInstance.drawArrow(pos1.x, pos1.y, pos2.x, pos2.y);
    }
  }

  dragEnd($event: CdkDragEnd, box: Box) {

    box.position = $event.source.getFreeDragPosition();
    
    if(box.position.x < 170){//170 = constant for panel width
      this.deleteBox(box);
    }
  }


  //arrow handling
  addArrow(from: Box, to: Box){

    //here is still some space

    this.arrows.push({lineTo: to.id, lineFrom: from.id});
  }
}