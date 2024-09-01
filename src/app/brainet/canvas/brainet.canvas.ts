import { Box } from "../draggables/brainet.box";

export class Canvas{
    ctx: any;

    constructor(ctx: any){
        this.ctx = ctx;
    }

    drawBar(transformx: number, transformy: number, scale: number){
        const x = -1*transformx/scale; // x-coordinate of the bar
        const y = -1*transformy/scale; // y-coordinate of the bar
        const width = 170/scale; // width of the bar
        const height = this.ctx.canvas.height/scale; // height of the bar

        // Draw the bar
        this.ctx.fillStyle = "#666";
        this.ctx.fillRect(x, y, width, height);
    }

    drawArrow(startX: number, startY: number, endX: number, endY: number) {

        // Control points for the cubic bezier curve (can be adjusted for the desired curve shape)
        const controlX1 = startX + Math.abs((endX - startX)/2);
        const controlY1 = startY + Math.abs((endY - startY)/4);  // Adjust these values to change the curve
        const controlX2 = endX - Math.abs((endX - startX)/2);
        const controlY2 = endY - Math.abs((endY-startY)/4);  // Adjust these values to change the curve
    
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

    drawLine(startX: number, startY: number, endX: number, endY: number){
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        // Calculate arrowhead angle based on the tangent to the line at the end point
        const angle = Math.atan2(endY - startY, endX - startX);

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

    drawBox(box: Box, transformx: number, transformy: number, scale: number){
        let width = box.width*scale;
        let height = box.height*scale;
        let x = box.position.x; // Centered on the canvas
        let y = box.position.y; // Centered on the canvas
        const borderRadius = 4;
        const color = box.color;

        if(box.in_panel){
            x -= transformx;
            y -= transformy;

            width *= scale;
            height *= scale;
        }
        
        // Draw the box with rounded corners
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
      
        // Fill the box
        this.ctx.fillStyle = color;
        this.ctx.fill();
      
        // Add a border
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#333";
        this.ctx.stroke();
      
        // Draw the shadow
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 3;
      
        // Draw the inner content (centered text)
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.87)";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(box.message, x + width / 2, y + height / 2);
      
        // Reset the shadow
        this.ctx.shadowColor = "transparent";
    }

    drawHandles(box: Box, transformx: number, transformy: number, scale: number){

        for (const handle of box.handles) {

            let x = box.position.x + handle.left;
            let y = box.position.y + handle.top;
            let height = handle.height;
            let width = handle.width;
            const color = handle.color;

            if(box.in_panel){
                x -= transformx;
                y -= transformy;
    
                width *= scale;
                height *= scale;
            }

            // Draw rounded box
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 5, y);                 // Top left corner
            this.ctx.arcTo(x + 20, y, x + 20, y + 20, 5); // Top-right corner
            this.ctx.arcTo(x + 20, y + 20, x, y + 20, 5); // Bottom-right corner
            this.ctx.arcTo(x, y + 20, x, y, 5);           // Bottom-left corner
            this.ctx.arcTo(x, y, x + 20, y, 5);           // Top-left corner
            this.ctx.closePath();
            this.ctx.fill();

            // Draw arrow inside the box
            this.ctx.fillStyle = 'white'; // Arrow color (white)
            this.ctx.beginPath();
            this.ctx.moveTo(x + 7, y + 6);  // Arrow start (left)
            this.ctx.lineTo(x + 13, y + 10); // Arrow tip (center right)
            this.ctx.lineTo(x + 7, y + 14); // Arrow end (bottom left)
            this.ctx.lineTo(x + 7, y + 12); // Back to the arrow line
            this.ctx.lineTo(x + 11, y + 10); // Arrow tip again
            this.ctx.lineTo(x + 7, y + 8); // Back to the arrow line
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}