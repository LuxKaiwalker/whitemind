export class ExampleBox {
    typ: number;
    num: number;
    position: {x: number, y: number};
    dragged: boolean;
    message: string;

    constructor(typ: number, num: number){
        this.typ = typ;
        this.num = num;
        this.position = {x: 0, y: 0};
        this.dragged = false;
        this.message = 'Box ' + this.num + ' of type ' + this.typ;
    }
}