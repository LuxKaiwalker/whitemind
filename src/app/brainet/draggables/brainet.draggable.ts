export class Box {
    typ: number;
    id: number;
    position: {x: number, y: number};
    dragged: boolean;
    message: string;
    in_panel: boolean = true;
    zIndex: number;
    connectedFrom: number[] = [];//list of all box ids connected from
    connectedTo: number[] = [];//list of all box ids connected to

    constructor(typ: number, num: number, zIndex: number, position: {x: number, y: number} = {x: 100, y: 100}){
        this.typ = typ;
        this.id = num;
        this.position = {x: 0, y: 0};
        this.dragged = false;
        this.message = 'ID: ' + this.id + ', type: ' + this.typ;
        this.zIndex = zIndex;
    }
}