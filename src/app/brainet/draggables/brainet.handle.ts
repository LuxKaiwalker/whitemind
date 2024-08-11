export class Handle {
    type: string;
    left: number;
    top: number;

    constructor(typ: string){
        this.type = typ.toString();
        if(this.type == "output"){//declares new handle
            this.left = 135;
        }
        else if(this.type == "input"){
            this.left = 5;
        }
        else if(this.type == "special"){
            this.left = 0;
        }
        else if(this.type == "config"){
            this.left = 0;
        }
        else{
            throw new Error(`Invalid handle type, given ${this.type}`);
        }
        this.top = 0;
    }
}