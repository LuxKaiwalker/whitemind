import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
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

  canvasInstance!: Canvas;

  connectionArrow: {type:string, box?: Box, toPos:{x:number, y:number}} = {type: "", toPos: {x:0, y:0}}//empty string means no draw arrow mode, box_id = -1 = no box currently selected


  //dragdrop variables
  dragging: number = -1;
  panning: boolean = false;
  startx:number = 0;
  starty:number = 0;
  paneldrag: number = -1;


  //viewport variables
  viewportTransform = {
    x: 0,
    y: 0,
    scale: 1
  }
  transx: number = 0;
  transy: number = 0;

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = (window.innerHeight - 60);//60 = header area.
      console.log(canvas.width, canvas.height);


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

    this.workspace.set(this.box_count, new Box(typ, this.box_count, this.zindex_count, position));

    this.box_count++;

    const lastBox = this.workspace.get(this.box_count - 1);

    if (lastBox) {
      lastBox.position = position;
    }
    this.zindex_count++;
  }

  deleteBox(box: Box){

    console.log("deleting box");

    let indexcount = 0;
    for(const [_, b] of this.workspace){
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

  dragStart(box: Box){

    if(box.in_panel)
    {
      this.newPanelBox(box.typ);
    }
    
    box.zIndex = ++this.zindex_count;
  }

  dragEnd(box: Box) {

    /*
    if(box.position.x < 170){
      if(!box.in_panel){
        this.deleteBox(box);
        this.updateCanvas(box);
      }
      else{
        box.position.x = 170;
      }
    }
    */

    box.in_panel = false;
  }


  //arrow handling

  drawConnectionArrow(handle: Handle, box: Box){

    //connection arrow guard for panel boxes
    if(box.in_panel){
      return;
    }

    if(this.connectionArrow.type === ""){//if empty, handle the arrow updates in updatecanvas

      if(handle.type === "output"){
        this.connectionArrow.type = handle.type;

        this.connectionArrow.box = box;
        return;
      }
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
    this.updateCanvas();
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

      console.log(fromBox, toBox);
    }
    else{
      throw new Error(`Invalid handle froms and tos, given ${typeFrom} and ${typeTo} so no new arrow is added`);
    }

    this.updateCanvas(from);
  }


  //canvas handling
  updateCanvas(current?: Box, pos?: {x: number, y: number}){

    //render viewport transformation

    this.canvasInstance.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.canvasInstance.clearCanvas();
    this.canvasInstance.ctx.setTransform(this.viewportTransform.scale, 0, 0, this.viewportTransform.scale, this.viewportTransform.x, this.viewportTransform.y);

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

        console.log(workspace_lineto);

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

          console.log(pos1, pos2);
        
          this.canvasInstance.drawLine(pos1.x, pos1.y, pos2.x, pos2.y);
        }
      }
    }

    //draw boxes
    for(const [key, box] of this.workspace){
      if(box.in_panel){
        continue;
      }
      this.canvasInstance.drawBox(box, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale);
      this.canvasInstance.drawHandles(box, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale);
    }

    //draw connection arrow
    if(this.connectionArrow.type !== ""){
      if (this.connectionArrow.box) {

        const posx = this.connectionArrow.box.position.x + this.connectionArrow.box.handles[0].box_pos.x;//here output is definetly at index 0. probably altering further alter
        const posy = this.connectionArrow.box.position.y + this.connectionArrow.box.handles[0].box_pos.y;

        this.canvasInstance.drawLine(posx, posy, this.connectionArrow.toPos.x, this.connectionArrow.toPos.y);
      }
    }

    //draw bar
    this.canvasInstance.drawBar(this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale);

    //draw boxes in panel
    for(const [key, box] of this.workspace){
      if(!box.in_panel){
        continue;
      }
      this.canvasInstance.drawBox(box, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale);
      this.canvasInstance.drawHandles(box, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale);
    }
  }

  //dragdrop implemenrtation
  mouseMove(event: MouseEvent) {
    
    if(this.dragging !== -1){

      let clx = (event.clientX - this.viewportTransform.x)/this.viewportTransform.scale;
      let cly = (event.clientY - this.viewportTransform.y)/this.viewportTransform.scale;//60 = header area.

      let headermargin = 60/this.viewportTransform.scale;//60 = header area.

      if(this.paneldrag === 1){
        clx = event.clientX;
        cly = event.clientY;

        headermargin = 60;
      }

      console.log("dragging");
      let moveX = clx - this.startx;
      let moveY = cly - headermargin - this.starty;//60 = header area.
      this.startx = clx;
      this.starty = cly - headermargin;//60 = header area.

      let box = this.workspace.get(this.dragging);
      if (box) {
        box.position.x += moveX;
        box.position.y += moveY;
      }
    }

    if(this.connectionArrow.type !== ""){
      const clx = (event.clientX - this.viewportTransform.x)/this.viewportTransform.scale;
      const cly = (event.clientY - this.viewportTransform.y)/this.viewportTransform.scale;//60 = header area.
      this.connectionArrow.toPos = {x: clx, y: cly - 60/this.viewportTransform.scale};//60 = header area.
    }

    if(this.panning){
      console.log("panning");

      const localX = event.clientX;
      const localY = event.clientY - 60;//60 = header area.

      this.viewportTransform.x += localX - this.transx;
      this.viewportTransform.y += localY - this.transy;

      this.transx = localX;
      this.transy = localY;
    }

    this.updateCanvas();
  }

  onMouseDown(event: MouseEvent){

    this.transx = event.clientX;
    this.transy = event.clientY-60;

    this.startx = (event.clientX - this.viewportTransform.x)/this.viewportTransform.scale;
    this.starty = (event.clientY - 60 - this.viewportTransform.y)/this.viewportTransform.scale;//60 = header area.

    if(event.clientX<170){
      this.paneldrag = 1;
      this.startx = event.clientX;
      this.starty = event.clientY - 60;//60 = header area.
    }

    if(event.button == 0){//left button clicked

      let isInBox = (box: Box) => {
        return box.position.x < this.startx && this.startx < box.position.x + box.width && box.position.y < this.starty && this.starty < box.position.y + box.height;
      }

      let isOnHandle = (box:Box) => {
        for(const handle of box.handles){
          let x = box.position.x + handle.left;
          let y = box.position.y + handle.top;
          let width = 20;//handle dimensions, probybly to change
          let height = 20;

          if(x < this.startx && this.startx < x + width && y < this.starty && this.starty < y + height){
            return handle.type;
          }
        }
        return false;
      }
      
      for(let box of this.workspace.values()){
        if(isInBox(box)){//drag started!

          if(!isOnHandle(box)){

            this.abortConnectionArrow();

            this.dragStart(box);//initiate drag start

            this.dragging = box.id;
            console.log(this.dragging);
            return;
          }
          else{
            let handleType = isOnHandle(box);
            if(handleType == "output" || handleType == "input"){
              let index = box.handles.findIndex((handle) => handle.type === handleType);
              this.drawConnectionArrow(box.handles[index], box);
              return;
            }
            else if(handleType == "config"){
              this.deleteBox(box);
              this.updateCanvas();
              return;
            }
          }
        }
      }
      //if nothing clicked:
      this.abortConnectionArrow();
      this.panning = true; //enable pannign for other mouse movements
    }
    else if(event.button == 2){
      return;//nothing
    }
    
  }

  onMouseUp(event: MouseEvent){

    if(event.button == 0){//left button clicked
      if(this.dragging === -1){
        this.panning = false;//abort pannign!
        return;
      }
      else{
        let box = this.workspace.get(this.dragging);
        if (box) {
          if(this.paneldrag === 1){
            box.position.x = (box.position.x-this.viewportTransform.x)/this.viewportTransform.scale;
            box.position.y = (box.position.y-this.viewportTransform.y)/this.viewportTransform.scale;
          }
          this.dragEnd(box);
        }
        this.dragging = -1;
        this.paneldrag = -1;
      }
    }
    else if(event.button == 2){
      return;//nothing
    }

    this.updateCanvas();
  }

  onMouseOut(event: MouseEvent){
    this.onMouseUp(event);
  }

  onScroll(event: WheelEvent){

    console.log("scrolling");
    console.log(event.deltaY);

    const oldX = this.viewportTransform.x;
    const oldY = this.viewportTransform.y;

    const localX = event.clientX;
    const localY = event.clientY;

    const previousScale = this.viewportTransform.scale;

    const newScale = this.viewportTransform.scale += event.deltaY * -0.00050;

    console.log("new scale:");
    console.log(newScale);

    if(newScale < 0.1 || newScale > 10){//prevent bugs
      this.viewportTransform.scale = previousScale;
      return;
    }

    const newX = localX - (localX - oldX) * (newScale / previousScale);
    const newY = localY - (localY - oldY) * (newScale / previousScale);

    this.viewportTransform.x = newX;
    this.viewportTransform.y = newY;
    this.viewportTransform.scale = newScale;

    this.updateCanvas();
  }

  onContextMenu(event: MouseEvent){
    return;
  }
}