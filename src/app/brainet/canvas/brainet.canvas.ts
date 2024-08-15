import { Box } from "../draggables/brainet.box";

export class Canvas{
    ctx: any;

    constructor(ctx: any){
        this.ctx = ctx;
    }

    drawLine(box1: Box, box2: Box, highest: number): [arrowFrom: number, arrowTo: number, arrowId: number]{
        this.ctx.beginPath();
        this.ctx.moveTo(box1.position.x, box1.position.y);
        this.ctx.lineTo(box2.position.x, box2.position.y);
        this.ctx.stroke();

        box1.connections_out.push(box2.id);
        box2.connections_in.push(box1.id);

        return [box1.id, box2.id, highest + 1]; // Replace 1 with the appropriate lineId value
    }

    deleteLine(){//to do

    }

    drawArrow(startX: number, startY: number, endX: number, endY: number) {

        // Control points for the cubic bezier curve (can be adjusted for the desired curve shape)
        const controlX1 = startX + Math.abs((endX - startX)/2);
        const controlY1 = startY + (endY - startY)/4;  // Adjust these values to change the curve
        const controlX2 = endX - Math.abs((endX - startX)/2);
        const controlY2 = endY - (endY-startY)/4;  // Adjust these values to change the curve
    
        // Draw the cubic bezier curve
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
        this.ctx.stroke();
        
        // Calculate arrowhead angle based on the tangent to the curve at the end point
        const angle = Math.atan2(endY - controlY2, endX - controlX2);
        
        // Draw arrowhead
        const arrowLength = 10;
        const arrowWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI / 6),
            endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI / 6),
            endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}