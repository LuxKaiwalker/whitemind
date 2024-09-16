import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';

import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from '../header/header.component';
import { Canvas } from './canvas/brainet.canvas'

import { Box } from './draggables/brainet.box';
import { Handle } from './draggables/brainet.handle';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NgFor, CommonModule, FormsModule, MatMenuModule, OverlayModule],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})

export class BrainetComponent implements OnInit, OnChanges {

  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;

  // Access the context menu element
  @ViewChild('contextMenu') contextMenu!: ElementRef<HTMLDivElement>;

  // Access the share menu element inside the context menu
  @ViewChild('shareMenu') shareMenu!: ElementRef<HTMLDivElement>;

  @ViewChild('datasetForm') datasetForm!: ElementRef<HTMLDivElement>;
  @ViewChild('denseLayerForm') denseLayerForm!: ElementRef<HTMLDivElement>;
  @ViewChild('lossModuleForm') lossModuleForm!: ElementRef<HTMLDivElement>;
  @ViewChild('trainingPredictForm') trainingPredictForm!: ElementRef<HTMLDivElement>;

  @ViewChild('contextmenu', { read: ElementRef, static: true }) contextmenu!: ElementRef;


constructor(private http: HttpClient, private tokenService: TokenService) {}


  //api request setup
  readonly ROOT_URL = 'https://backmind.icinoxis.net';

  //login data

  token:string = "";


  //list of all boxes on screen or available
  workspace = new Map<number, Box>();//id  = number. probably we can even wipe out the id of the box.
  workspace_params = new Map<number, any>();//id  = number. probably we can even wipe out the id of the box.

  box_count: number = 0;
  zindex_count: number = 10;

  canvasInstance!: Canvas;

  connectionArrow: {type:string, box?: Box, toPos:{x:number, y:number}} = {type: "", toPos: {x:0, y:0}}//empty string means no draw arrow mode, box_id = -1 = no box currently selected

  //for context menu

  onBox: boolean = false;

  //TODO make this somehow better
  neuron_count: number = 0;
  previous_count: number = 0;
  option: string = "";
  dataset: string = "";
  current_box: Box = new Box(0, 0, 0, {x: 0, y: 0});
    //for training
  batch_size: number = 0;
  epochs: number = 0;
  early_stopping_distance: number = 0;

  training_alg = {
    type: "sgd",
    value: 0.1,
    parameters: [
      {
        type: "parameter",
        value: 0.1
      },
      {
        type: "parameter",
        value: 500
      }
    ]
  }


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

  moved:boolean = false;

  //handle variable
  inputHandle:Handle = new Handle("input");

  ngOnInit(){
      const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
      const ctx = this.myCanvas.nativeElement.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = (window.innerHeight - 60);//60 = header area.

      this.canvasInstance = new Canvas(ctx);

      this.newPanelBox(0);
      this.newPanelBox(1);
      this.newPanelBox(2);

      this.token = this.tokenService.getToken();//get user token

      console.log("token for the api: ");
      console.log(this.token);


      //manage api calls etc. etc.

      this.get();

      this.loadBoxes();
  }

  ngOnChanges(){
  }

  //file handling

  onSave(event:MouseEvent){
    event.preventDefault();
      
    let data = {
      "operations": [],
      "general-information1": "This is a test file"
    }

    //push data to the data object
  }

  load(){
    console.log("this will be loaded now!");//TODO: implement
  }

  export(){
    console.log("this will be exported now!");//TODO: implement
  }

  //api request handling
  get(){
    let url = `${this.ROOT_URL}/`;
    this.http.get(url).subscribe((response: any) => {console.log('Response:', response);});
  }

  loadBoxes(){
    this.get();//get the box data

    //parse the data

    let exapmledata = {"operations":[{"type":"add","modules":[{"type":"dense","parameters":[{"type":"relu","param0":0.01},{"value":200},{"value":"module1"}]},{"type":"input","parameters":[{"value":100},{"value":"module2"}]},{"type":"output","parameters":[{"type":"softmax"},{"value":10},{"type":"error_rate"},{"value":"module3"}]}],"connections":[{"from":"module2","to":"module1"},{"from":"module1","to":"module3"}]},{"type":"train","parameters":[{"value":10},{"value":32},{"type":"adam","param0":0.01},{"value":10}]},{"type":"predict","parameters":[]}],"general-information1":"This is a test file"};//example data

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

    console.log(typ);

    switch(typ){
    
      //TODO:case 0
      case 1:
        this.workspace_params.set(this.box_count - 1, {
          type: "dense",
          parameters: [
            {
              type: "relu",
              value: 0.01
            },
            {
              value: 100
            },
            {
              value: `module${this.box_count}`
            }
          ]
        });
        break;
      case 2:
        this.workspace_params.set(this.box_count, {
          type: "loss",
          parameters: [
            {
              type: "object",
              value: "error_rate"
            },
            {
              type: "parameter",
              value: `module${this.box_count}`
            }
          ]
        });
        break;

      default:
        this.workspace_params.set(this.box_count, {
          type: "unknown", value: 0
        });
        break;
    }
  }

  deleteBox(box: Box){

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
    this.newBox(typ, {x: 10 + 15/2, y: typ*100 + 30});//bit messy, needs imporvement
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

      /*TODO: remove handle option
      if(handle.type === "input"){//remove handle!

        box.connections_in = box.connections_in.filter((value) => value !== this.connectionArrow.box?.id);

        this.connectionArrow.type = handle.type;

        this.connectionArrow.box = box;
        return
      }
      */
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
        
          this.canvasInstance.drawLine(pos1.x, pos1.y, pos2.x, pos2.y);
        }
      }
    }

    //draw boxes
    for(const [key, box] of this.workspace){
      if(box.in_panel){
        continue;
      }
      if(box.connections_in.length === 0){//input handle is meant here.
        box.handles[1].connected = false;
      }
      else {
        box.handles[1].connected = true;
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
        this.canvasInstance.drawInputHandle(this.connectionArrow.toPos.x - this.inputHandle.height/2, this.connectionArrow.toPos.y - this.inputHandle.height/2, this.inputHandle, this.viewportTransform.scale);
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

      const localX = event.clientX;
      const localY = event.clientY - 60;//60 = header area.

      this.moved = true;

      this.viewportTransform.x += localX - this.transx;
      this.viewportTransform.y += localY - this.transy;

      this.transx = localX;
      this.transy = localY;
    }

    this.updateCanvas();
  }

  onMouseDown(event: MouseEvent){

    this.cancelConfig(event);

    this.moved = false;

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

        let on_box:boolean = box.position.x < this.startx && this.startx < box.position.x + box.width && box.position.y < this.starty && this.starty < box.position.y + box.height;

        return on_box;
      }

      let isOnHandle = (box:Box) => {
        for(const handle of box.handles){
          let x = box.position.x + handle.left;
          let y = box.position.y + handle.top;
          let width = handle.width;//handle dimensions, probybly to change
          let height = handle.height;

          if(x < this.startx && this.startx < x + width && y < this.starty && this.starty < y + height){
            return handle.type;
          }
        }
        return false;
      }
      
      for(let box of this.workspace.values()){
        if(isInBox(box)){//drag started!

          if(!isOnHandle(box)){

            if(this.paneldrag === -1 && box.in_panel){
              //edge case: dragging from box position but box is not in panel
              return;
            }

            this.abortConnectionArrow();

            this.dragStart(box);//initiate drag start

            this.dragging = box.id;
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
              if(!box.in_panel && this.connectionArrow.type === ""){
                this.deleteBox(box);
              }
              else{
                this.abortConnectionArrow();
              }
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

      this.panning = true;
      return;//nothing
    }
    
  }

  onMouseUp(event: MouseEvent){

    let isInBox = (box: Box) => {

      let on_box:boolean = box.position.x < this.startx && this.startx < box.position.x + box.width && box.position.y < this.starty && this.starty < box.position.y + box.height;

      return on_box;
    }


    if(event.button == 0){//left button clicked
      if(this.dragging === -1){
        this.panning = false;//abort pannign!
        return;
      }
      else{
        let box = this.workspace.get(this.dragging);
        if (box) {
          if(this.paneldrag === 1){
            box.position.x = (box.position.x-this.viewportTransform.x)/this.viewportTransform.scale;//TODO modify here to center boxes on drop
            box.position.y = (box.position.y-this.viewportTransform.y)/this.viewportTransform.scale;
          }
          this.dragEnd(box);
        }
        this.dragging = -1;
        this.paneldrag = -1;
      }
    }
    else if(event.button == 2){
      if(this.dragging === -1){
        this.panning = false;//abort pannign!
      }

      if(!this.moved){

        for(let box of this.workspace.values()){
          if(isInBox(box)){

            if(box.in_panel){
              this.onContextMenu(event, true);//prevent context menu for panel boxes
              return;
            }

            this.onBox = true;
            this.current_box = box;
            if (this.workspace_params.has(box.id)) {
              this.previous_count = this.workspace_params.get(box.id).parameters[1].value;
            }

            switch(box.typ){
              case 0:
                this.onDatasetForm(event, box);
                break;
              case 1:
                this.onDenseLayerForm(event, box);
                break;
              case 2:
                this.onLossModuleForm(event, box);
                break;
              default:
                this.onContextMenu(event, false);
                break;
            }
            return;
          }
        }
        this.onContextMenu(event, false);
      }
    }

    this.updateCanvas();
  }

  onMouseOut(event: MouseEvent){
    this.onMouseUp(event);
  }

  onScroll(event: WheelEvent){

    const oldX = this.viewportTransform.x;
    const oldY = this.viewportTransform.y;

    const localX = event.clientX;
    const localY = event.clientY;

    const previousScale = this.viewportTransform.scale;

    const newScale = this.viewportTransform.scale += event.deltaY * -0.00050;

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

  showBoxConfig(){
    console.log("show box config");//TODO: implement
  }

  //context menu handling for every type of block

  onTrainPredictForm(event: MouseEvent){
    console.log("train predict form");//TODO: implement
    let form = this.trainingPredictForm.nativeElement;

    form.style.visibility = "visible";


  }

  onDatasetForm(event: MouseEvent, box: Box){
    console.log("dataset form");//TODO: implement

    let form = this.datasetForm.nativeElement;

    let x = event.offsetX, y = event.offsetY,
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    cmWidth = form.offsetWidth,
    cmHeight = form.offsetHeight;

    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;
    
    form.style.left = `${x}px`;
    form.style.top = `${y}px`;
    form.style.visibility = "visible";
  }

  onDenseLayerForm(event: MouseEvent, box: Box){
    console.log("dense layer form");//TODO: implement

    console.log("box before: ");
    console.log(this.current_box);

    console.log("box after: ");
    console.log(this.current_box);

    console.log("box typ: ");
    console.log(box.typ);

    let form = this.denseLayerForm.nativeElement;

    let x = event.offsetX, y = event.offsetY,
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    cmWidth = form.offsetWidth,
    cmHeight = form.offsetHeight;

    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;
    
    form.style.left = `${x}px`;
    form.style.top = `${y}px`;
    form.style.visibility = "visible";
  }

  onLossModuleForm(event: MouseEvent, box: Box){
    console.log("loss module form");//TODO: implement

    let form = this.lossModuleForm.nativeElement;

    let x = event.offsetX, y = event.offsetY,
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    cmWidth = form.offsetWidth,
    cmHeight = form.offsetHeight;

    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;
    
    form.style.left = `${x}px`;
    form.style.top = `${y}px`;
    form.style.visibility = "visible";
  }

  onContextMenu(event: MouseEvent, moved:boolean){

    event.preventDefault();

    if(moved){
    }
    else{

      let contextMenu = this.contextMenu.nativeElement;
      let shareMenu = this.shareMenu.nativeElement;

      let x = event.offsetX, y = event.offsetY,
      winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      cmWidth = contextMenu.offsetWidth,
      cmHeight = contextMenu.offsetHeight;
      if(x > (winWidth - cmWidth - shareMenu.offsetWidth)) {
          shareMenu.style.left = "-200px";
      } else {
          shareMenu.style.left = "";
          shareMenu.style.right = "-200px";
      }
      x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
      y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;
      
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
      contextMenu.style.visibility = "visible";
      
      return;
    }
  }

  onContextContext(event: MouseEvent){
    event.preventDefault();
  }

  cancelConfig(event: MouseEvent){//later, do better handling via reset!

    let trainingPredictForm = this.trainingPredictForm.nativeElement;
    trainingPredictForm.style.visibility = "hidden";

    let contextMenu = this.contextMenu.nativeElement;
    contextMenu.style.visibility = "hidden";

    let denseLayerForm = this.denseLayerForm.nativeElement;
    denseLayerForm.style.visibility = "hidden";

    let lossModuleForm = this.lossModuleForm.nativeElement;
    lossModuleForm.style.visibility = "hidden";

    let datasetForm = this.datasetForm.nativeElement;
    datasetForm.style.visibility = "hidden";


    const resetEvent = new MouseEvent('reset', { bubbles: true });
    this.trainingPredictForm.nativeElement.dispatchEvent(resetEvent);
    this.contextMenu.nativeElement.dispatchEvent(resetEvent);
    this.denseLayerForm.nativeElement.dispatchEvent(resetEvent);
    this.lossModuleForm.nativeElement.dispatchEvent(resetEvent);
    this.datasetForm.nativeElement.dispatchEvent(resetEvent);
  }



  //handle form data updates

  updateTrainPredictForm(event: any){
    console.log("update train predict form");//TODO: implement

    let form = this.trainingPredictForm.nativeElement;

    this.cancelConfig(event);

  }

  updateDataset(event: any){
    console.log("update dataset");

    let dataset = this.dataset;

    //TODO: write to database

    this.cancelConfig(event);
  }

  updateDenseLayer(event: any){

    let num = this.neuron_count;
    let option = this.option;

    console.log(this.current_box.typ);
    
    //print all of workspace.oarams

    for(const [key, value] of this.workspace_params){
      console.log(key, value);
    }

    console.log(this.current_box.id, this.workspace_params.get(this.current_box.id));

    if(num){
      this.workspace_params.get(this.current_box.id).parameters[1].value = num;
    }
    if(option){
      this.workspace_params.get(this.current_box.id).parameters[0].type = option;
    }

    this.neuron_count = 0;

    this.cancelConfig(event);
  
  }

  updateLossModule(event: any){
  
    let option = this.option;

    if(option){
      this.workspace_params.get(this.current_box.id).parameters[0].type = option;
    }

    this.cancelConfig(event);

  }


  //file handling


  //action!!!

  train(event: any) {
    console.log("start training"); //TODO: implement
  }

}
