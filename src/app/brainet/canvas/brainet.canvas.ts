import { Box } from "../draggables/brainet.draggable";

export class Canvas{
    ctx: any;

    constructor(ctx: any){
        this.ctx = ctx;
    }

    /**
     * @brief draw the og test draggable box onto the canvas
     * @param x 
     * @param y 
     * @note TODO: ajust type of ctx
     */
    drawBox(x: number, y: number, message: string) {
        const width = 200;
        const height = 400;
        const borderRadius = 4;
        const borderColor = '#ccc';
        const borderWidth = 1;
        const backgroundColor = '#fff';
        const textColor = 'rgba(0, 0, 0, 0.87)';
        const boxShadow = [
        { x: 0, y: 3, blur: 1, spread: -2, color: 'rgba(0, 0, 0, 0.2)' },
        { x: 0, y: 2, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.14)' },
        { x: 0, y: 1, blur: 5, spread: 0, color: 'rgba(0, 0, 0, 0.12)' }
        ];
    
        y += 60;//ajust to header height

        this.ctx.save();
    
        // Draw box shadow
        boxShadow.forEach(shadow => {
        this.ctx.shadowOffsetX = shadow.x;
        this.ctx.shadowOffsetY = shadow.y;
        this.ctx.shadowBlur = shadow.blur;
        this.ctx.shadowColor = shadow.color;
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.shadowOffsetY = shadow.y;
        this.ctx.shadowBlur = shadow.blur;
        this.ctx.shadowColor = shadow.color;
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        });
    
        this.ctx.restore();
        
        // Draw border and background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.beginPath();
        this.ctx.beginPath();
        this.ctx.moveTo(x + borderRadius, y);
        this.ctx.lineTo(x + width - borderRadius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        this.ctx.lineTo(x + width, y + height - borderRadius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        this.ctx.lineTo(x + borderRadius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        this.ctx.lineTo(x, y + borderRadius);
        this.ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        this.ctx.closePath();
        this.ctx.lineTo(x + width - borderRadius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        this.ctx.lineTo(x + width, y + height - borderRadius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        this.ctx.lineTo(x + borderRadius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        this.ctx.lineTo(x, y + borderRadius);
        this.ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        // Draw centered text
        this.ctx.fillStyle = textColor;
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(message, x + width / 2, y + height / 2);
    }

    drawLine(box1: Box, box2: Box, highest: number): [arrowFrom: number, arrowTo: number, arrowId: number]{
        this.ctx.beginPath();
        this.ctx.moveTo(box1.position.x, box1.position.y);
        this.ctx.lineTo(box2.position.x, box2.position.y);
        this.ctx.stroke();

        box1.connectedTo.push(box2.id);
        box2.connectedTo.push(box1.id);

        return [box1.id, box2.id, highest + 1]; // Replace 1 with the appropriate lineId value
    }

    deleteLine(){//to do

    }

    drawArrow(startX: number, startY: number, endX: number, endY: number) {

        startY+=60;
        endY+=60;//ajust for wrong canvas size 

        // Control points for the cubic bezier curve (can be adjusted for the desired curve shape)
        const controlX1 = startX + (endX - startX) / 3;
        const controlY1 = startY - 50;  // Adjust these values to change the curve
        const controlX2 = endX - (endX - startX) / 3;
        const controlY2 = endY - 50;  // Adjust these values to change the curve
    
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
    
    

    deleteArrow() {//need to write
        
    }
}