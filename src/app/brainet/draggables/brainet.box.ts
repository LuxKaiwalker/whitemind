
import { Handle } from './brainet.handle';

export class Box {

    typ: number;
    id: number;
    position: {x: number, y: number};
    dragged: boolean;
    message: string;
    in_panel: boolean = true;
    zIndex: number;
    
    connections_out: number[] = [];//for html interactivity: pointing to a box
    connections_in: number[] = [];//for html interactivity: pointing to a box
    connections_special: number[] = [];//for html interactivity: pointing to a box
    connections_config: number[] = [];//for html interactivity: pointing to a box


    handles: Handle[] = [];


    pointTo: number = 0;//for html interactivity: pointing to a box

    constructor(typ: number, id: number, zIndex: number, position: {x: number, y: number}){
        this.typ = typ;
        this.id = id;
        this.position = {x: position.x, y: position.y};
        this.dragged = false;
        this.message = 'ID: ' + this.id + ' type: ' + this.typ;
        this.zIndex = zIndex;


        //handles init
        this.handles.push(new Handle('output'));
        this.handles.push(new Handle('input'));
    }
}