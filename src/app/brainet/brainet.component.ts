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
  workspace = new Map<number, Box>();//id  = number. probably we can even wipe out the id of the box.

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

    this.workspace.set(this.box_count++, new Box(typ, this.box_count, this.zindex_count, position));

    const lastBox = this.workspace.get(this.box_count - 1);
    if (lastBox) {
      lastBox.position = position;
    }
    this.zindex_count++;
  }

  deleteBox(box: Box){

    console.log("deleting box");

    let indexcount = 0;
    for(const [key, b] of this.workspace){
      if(b.connections_out.includes(box.id)){
        b.connections_out.splice(b.connections_out.indexOf(box.id), 1);
      }
      if(b.connections_in.includes(box.id)){
        b.connections_in.splice(b.connections_in.indexOf(box.id), 1);
      }

      this.workspace.delete(box.id);
    }
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
    this.updateCanvas(false, box, pos);
  }

  dragEnd($event: CdkDragEnd, box: Box) {

    box.position = $event.source.getFreeDragPosition();

    if(box.position.x < 170){
      if(!box.in_panel){
        this.deleteBox(box);
        this.updateCanvas(false, box);
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
        this.addArrow(this.connectionArrow.box, box, "output", "input");
      }
    }
    else{
      this.abortConnectionArrow();
    }
  }

  abortConnectionArrow(){
    this.connectionArrow.type = "";
    this.connectionArrow.box = undefined;
    this.updateCanvas(false);
  }

  addArrow(from: Box, to: Box, typeFrom: string, typeTo: string){

    if(from.connections_out.includes(to.id) || to.connections_in.includes(from.id)){//guard for multiple arrows
      return;
    }
    if(to===from){//guard for self pointing
      return;
    }
    if(from.in_panel || to.in_panel){//guard for pointing to panel
      return;
    }

    if(typeFrom === "output" && typeTo === "input"){//we have to enumerate all legit cases here
      const fromBox = this.workspace.get(from.id);
      if (fromBox) {
        fromBox.connections_out.push(to.id);
      }
      const toBox = this.workspace.get(to.id);
      if (toBox) {
        toBox.connections_in.push(from.id);
      }
    }
    else{
      throw new Error(`Invalid handle froms and tos, given ${typeFrom} and ${typeTo} so no new arrow is added`);
    }

    this.updateCanvas(false, from);
  }


  //canvas handling
  updateCanvas(drawMouseArrow: boolean = false, current?: Box, pos?: {x: number, y: number}){


    this.canvasInstance.clearCanvas();//clear all that have been drawn

    //draw in-out-lines
    for (const [key, box] of this.workspace) {
      const lineFrom = box.id;

      for(const lineTo of box.connections_out){

        let pos1 = {
          x: box.position.x + box.handles[0].box_pos.x,
          y: box.position.y + box.handles[0].box_pos.y
        };

        const workspace_lineto = this.workspace.get(lineTo);
        if(workspace_lineto){
          let pos2 = {
            x: workspace_lineto.position.x + workspace_lineto.handles[1].box_pos.x,
            y: workspace_lineto.position.y + workspace_lineto.handles[1].box_pos.y
          };
        
        
          if(current && pos){//include guard if we just want to draw box
            if (lineFrom === current.id) {
              pos1.x = pos.x + box.handles[0].box_pos.x;
              pos1.y = pos.y + box.handles[0].box_pos.y;
            }
            if (lineTo === current.id && workspace_lineto) {
              pos2.x = pos.x + workspace_lineto.handles[1].box_pos.x;
              pos2.y = pos.y + workspace_lineto.handles[1].box_pos.y;
            }
          }
        
          this.canvasInstance.drawArrow(pos1.x, pos1.y, pos2.x, pos2.y);
        }
      }
    }

    //draw connection arrow
    if(drawMouseArrow){
      if (this.connectionArrow.box) {

        const posx = this.connectionArrow.box.position.x + this.connectionArrow.box.handles[0].box_pos.x;//here output is definetly at index 0. probably altering further alter
        const posy = this.connectionArrow.box.position.y + this.connectionArrow.box.handles[0].box_pos.y;

        this.canvasInstance.drawArrow(posx, posy, this.mousePos.x, this.mousePos.y);
      }
    }
  }

  //mouse handling
  MouseMove(event: MouseEvent) {
    this.mousePos.x = event.clientX;
    this.mousePos.y = event.clientY-60;//weird mouse problems again. fit to panel

    if(this.connectionArrow.type !== ""){
      this.updateCanvas(true);
    }
  }
}