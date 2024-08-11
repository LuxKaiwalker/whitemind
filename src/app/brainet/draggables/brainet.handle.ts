export class Handle {
    left: number;
    top: number;

    constructor(type: string){
        if(type === "output"){//declares new handle
            this.left = 0;
        }
        if(type === "input"){
            this.left = 5;
        }
        else{
            throw new Error("Invalid handle type");
        }
        this.top = 0;
    }
}