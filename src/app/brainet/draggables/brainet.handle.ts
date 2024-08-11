export class Handle {
    type: string;
    left: number;
    top: number;

    color: string = "black";

    constructor(typ: string){
        this.type = typ.toString();
        if(this.type == "output"){//declares new handle
            this.left = 135;
            this.color = "red";
        }
        else if(this.type == "input"){
            this.left = 5;
            this.color = "blue";
        }
        else if(this.type == "special"){
            this.left = 0;
            this.color = "green";
        }
        else if(this.type == "config"){
            this.left = 0;
            this.color = "yellow";
        }
        else{
            throw new Error(`Invalid handle type, given ${this.type}`);
        }
        this.top = 10;
    }
}