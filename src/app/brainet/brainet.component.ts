import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../header/header.component';
import { Canvas } from './canvas/brainet.canvas'

import { Box } from './draggables/brainet.box';
import { Handle } from './draggables/brainet.handle';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, DragDropModule, NgFor, CommonModule, FormsModule],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})

export class BrainetComponent implements OnInit, OnChanges {

  @ViewChild('canvas', { static: true })
  myCanvas!: ElementRef;

  //list of all boxes on screen or available
  workspace: Box[] = [];//dim 1: num of box.

  box_count: number = 0;
  zindex_count: number = 10;

  mousePos: {x: number, y: number} = {x: 0, y: 0};

  canvasInstance!: Canvas;

  connectionArrow: {type:string, box?: Box} = {type: ""}//empty string means no draw arrow mode, box_id = -1 = no box currently selected
  

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 60;//60 = header area.


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
    this.newBox(typ, {x: 5, y: typ*150 + 20});//60 = header area.
  }


  //drag handling

  dragStart($event: CdkDragStart, box: Box){
    if(box.in_panel)
    {
      this.newPanelBox(box.typ);
    }
    
    box.zIndex = ++this.zindex_count;
  }

  dragMoved($event: CdkDragMove, box: Box) {
    const pos = $event.source.getFreeDragPosition();
    this.updateCanvas(box, pos);
  }

  dragEnd($event: CdkDragEnd, box: Box) {

    box.position = $event.source.getFreeDragPosition();

    if(box.position.x < 170){
      if(!box.in_panel){
        this.removeArrows(box);
        this.deleteBox(box);
        this.updateCanvas(box);
      }
      else{
        box.position.x = 170;
      }
    }

    box.in_panel = false;
  }


  //arrow handling

  drawConnectionArrow(handle: Handle, box: Box){
    if(this.connectionArrow.type === ""){//if empty, handle the arrow updates in updatecanvas
      this.connectionArrow.type = handle.type;
      this.connectionArrow.box = box;
      return;
    }
    
    if(this.connectionArrow.type === "output" && handle.type === "input"){
      this.connectionArrow.type = "";

      if(this.connectionArrow.box !== undefined){
        this.addArrow(this.connectionArrow.box, box);
      }
    }
    else{
      this.connectionArrow.type = "";
      this.connectionArrow.box = undefined;
      console.log("the arrow cannot be drawn!");
    }
  }

  addArrow(from: Box, to: Box){

    if(from.connections_out.includes(to.id) || to.connections_in.includes(from.id)){//guard for multiple arrows
      return;
    }
    if(to===from){//guard for self pointing
      return;
    }
    if(from.in_panel || to.in_panel){//guard for pointing to panel
      return;
    }

    this.workspace[from.id].connections_out.push(to.id);
    this.workspace[to.id].connections_in.push(from.id);

    this.updateCanvas(from);
  }

  removeArrows(to: Box){
    for(const box of this.workspace){
      if(box.connections_out.includes(to.id)){
        box.connections_out.splice(box.connections_out.indexOf(to.id), 1);
      }
      if(box.connections_in.includes(to.id)){
        box.connections_in.splice(box.connections_in.indexOf(to.id), 1);
      }
    }
  }


  //canvas handling
  updateCanvas(current?:Box, pos?: {x: number, y: number}){
    this.canvasInstance.clearCanvas();//clear all that have been drawn

    //draw boxes
    for (const box of this.workspace) {
      const lineFrom = box.id;

      for(const lineTo of box.connections_out){

        let pos1 = box.position;
        let pos2 = this.workspace[lineTo].position;
        
        if(current && pos){//include guard if we just want to draw box
          if (lineFrom === current.id) {
            pos1 = pos;
          }
          if (lineTo === current.id) {
            pos2 = pos;
          }
        }

        this.canvasInstance.drawArrow(pos1.x, pos1.y, pos2.x, pos2.y);
      }
    }

    //draw connection arrow
    if(this.connectionArrow.type !== "" && this.connectionArrow.box){
      console.log("drawing arrow");
      this.canvasInstance.drawArrow(this.connectionArrow.box.position.x, this.connectionArrow.box.position.y, this.mousePos.x, this.mousePos.y);
    }
  }

  //mouse handling
  MouseMove(event: MouseEvent) {
    this.mousePos.x = event.clientX;
    this.mousePos.y = event.clientY;

    if(this.connectionArrow.type !== "" && this.connectionArrow.box){//somehow ugly, needs fix
      this.updateCanvas()
    }
  }
}