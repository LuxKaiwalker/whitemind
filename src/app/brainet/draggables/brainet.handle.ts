export class Handle {
    type: string;
    left: number;
    top: number;
    height: number = 25;
    width: number = 40;

    connected: boolean;

    box_pos: {x: number, y: number} = {x: 0, y: 0};//the relative position to the box where the arrow should spawn

    color: string = "black";

    constructor(typ: string){
        this.type = typ.toString();
        if(this.type == "output"){//declares new handle
            this.left = 120;
            this.top = 10;
            this.color = "#FF9914";//princeton orange
            //this.color = "#BB4430";//persian red
            this.box_pos.x = 160;

            this.connected = true;
        }
        else if(this.type == "input"){
            this.left = 0;
            this.top = 10;
            this.color = "#FF9914";//princeton orange
            //this.color = "#008080";//teal
            this.box_pos.x = 0;

            this.connected = false;
        }
        else if(this.type == "special_output"){
            this.left = 120;
            this.top = 45;
            this.color = "#bad29f";//Celadon
            this.box_pos.x = 0;

            this.connected = true;
        }
        else if(this.type == "special_input"){
            this.left = 0;
            this.top = 45;
            this.color = "#BB4430";//Persian Red
            this.box_pos.x = 0;

            this.connected = false;
        }
        else if(this.type == "delete"){
            this.left = 68;
            this.top = 75;
            this.color = "#123456";//Cdunno what this is
            this.box_pos.x = 0;

            this.connected = true;

            this.width = this.height = 24;
        }
        else{
            throw new Error(`Invalid handle type, given ${this.type}`);
        }
        this.box_pos.y = this.top + 10;
    }
}