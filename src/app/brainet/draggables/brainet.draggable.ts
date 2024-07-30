export class ExampleBox {
    typ: number;
    num: number;
    dragged: boolean;
    message: string;

    constructor(typ: number, num: number){
        this.typ = typ;
        this.num = num;
        this.dragged = false;
        this.message = 'Box ' + this.num + ' of type ' + this.typ;
    }


}