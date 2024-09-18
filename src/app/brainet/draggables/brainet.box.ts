
import { Handle } from './brainet.handle';

export class Box {

    typ: number;
    id: number;
    position: {x: number, y: number};
    dragged: boolean;
    message: string;
    in_panel: boolean = true;
    zIndex: number;
    color: string = 'white';
    height: number = 100;
    height_in_panel: number = 50;
    width: number = 160;
    width_in_panel: number = 100;
    
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
        //this.message = 'ID: ' + this.id + ' type: ' + this.typ;
        this.zIndex = zIndex;

        switch(this.typ){
            case 0: 
                this.message = 'Dataset';
                this.color = "#008080";//input
                this.handles.push(new Handle('output'));
                this.handles.push(new Handle('special_output'))
            break;
            case 1:
                this.message = 'Dense';
                this.color = "#FF6347";//output
                this.handles.push(new Handle('output'));
                this.handles.push(new Handle('input'));
            break;
            case 2: 
                this.message = 'Loss';
                this.color = "#FFD700";//processing
                this.handles.push(new Handle('special_input'));//quick fix of a harder problem!
                this.handles.push(new Handle('input'));
            break;
            case 3: 
                this.message = 'Special';
                this.color = "#FFA07A";//special
            break;
            default: 
                this.message = 'Unknown';
                this.color = "#fff";
        }


        //handles init
        this.handles.push(new Handle('delete'));
    }
}