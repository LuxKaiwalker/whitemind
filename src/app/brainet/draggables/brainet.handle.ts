export class Handle {
    type: string;
    left: number;
    top: number;

    box_pos: {x: number, y: number} = {x: 0, y: 0};//the relative position to the box where the arrow should spawn

    color: string = "black";

    constructor(typ: string){
        this.type = typ.toString();
        if(this.type == "output"){//declares new handle
            this.left = 135;
            this.color = "#BB4430";//persian red
            this.box_pos.x = 160;
        }
        else if(this.type == "input"){
            this.left = 5;
            this.color = "#008080";//teal
            this.box_pos.x = 0;
        }
        else if(this.type == "special"){
            this.left = 0;
            this.color = "#BAD29F";//Celadon
            this.box_pos.x = 0;
        }
        else if(this.type == "config"){
            this.left = 0;
            this.color = "FF9914";//princeton orange
            this.box_pos.x = 0;
        }
        else{
            throw new Error(`Invalid handle type, given ${this.type}`);
        }
        this.top = 10;
        this.box_pos.y = this.top;
    }
}