export class ExampleBox {
    typ: number;
    id: number;
    position: {x: number, y: number};
    message: string;
    unused: boolean = true;

    constructor(typ: number, id: number){
        this.typ = typ;
        this.id = id;
        this.position = {x: 0, y: 0};
        this.message = 'Box ' + this.id + ' of type ' + this.typ;
    }

    moveBox(x: number, y: number){
        this.position = {x: x, y: y};
        
    }
}