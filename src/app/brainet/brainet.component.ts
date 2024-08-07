import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { Canvas } from './canvas/brainet.canvas'
import { Box } from './draggables/brainet.draggable';
import { __setFunctionName } from 'tslib';


//adding stuff so i can merge

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
  workspace: Box[][] = [];//dim 1: type of box; dim 2: num of box

  box_count: number = 0;
  zindex_count: number = 0;

  canvasInstance!: Canvas;

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


      this.newPanelBox(0);
      this.newPanelBox(1);
      this.newPanelBox(2);


      this.canvasInstance = new Canvas(ctx);
  }

  ngOnChanges(){}


  // box handling
  newBox(typ: number, position: {x: number, y: number}) {
    if (!this.workspace[typ]) {//constructor for new box category if not initialized
      this.workspace[typ] = [];
    }
    this.workspace[typ].push(new Box(typ, this.box_count++,this.zindex_count , position));
    this.workspace[typ][this.workspace[typ].length - 1].position = position;
    this.zindex_count++;
  }

  deleteBox(box: Box){
    this.workspace[box.typ].splice(this.workspace[box.typ].indexOf(box), 1);
  }

  newPanelBox(typ: number)
  {
    this.newBox(typ, {x: 20, y: typ*110 + 20});
  }


  //drag handling

  dragStart($event: CdkDragStart, box: Box){
    if(!box.dragged){
      this.newPanelBox(box.typ);
    }
    box.zIndex = this.zindex_count;
    box.dragged = true;
  }

  dragMoved($event: CdkDragMove, box: Box) {}

  dragEnd($event: CdkDragEnd, box: Box) {

    box.position = $event.source.getFreeDragPosition();

    box.message= $event.source.element.nativeElement.innerText;

    // const divElement = document.querySelector('.ui');
    // const divHeight:number = divElement?.clientHeight || 0;
    
    if(box.position.x < 170){//ajusting to bin height, bit crappy. +50 because if half of box inside
      this.deleteBox(box);
    }
  }
}