import { Box } from "../draggables/brainet.box";
import { Handle } from "../draggables/brainet.handle"; 

export class Canvas{
    ctx: any;

    constructor(ctx: any){
        this.ctx = ctx;
    }

    drawBar(transformx: number, transformy: number, scale: number, dark: boolean){
        const x = (10-transformx) / scale; // x-coordinate of the bar
        const y = (10-transformy) / scale; // y-coordinate of the bar
        const width = 115 / scale; // width of the bar
        const height = (this.ctx.canvas.height-20) / scale; // height of the bar
        const radius = 5/scale; // Radius for rounded corners
    
        // Set shadow properties for a floating effect
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Light shadow for floating effect
    
        // Create a path for the rounded rectangle
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.arcTo(x, y, x + radius, y, radius);
        
        // Fill the bar with color
        if(dark){
            this.ctx.fillStyle = "#101010";
        }
        else{
            this.ctx.fillStyle = "#f8f9fa";
        }
        this.ctx.fill();
        
        // Add a border with rounded corners
        this.ctx.lineWidth = 0.5;
        if(dark){
            this.ctx.strokeStyle = "#337ab7"; // Border color
        }
        else{
            this.ctx.strokeStyle = "#333"; // Border color
        }
        this.ctx.stroke();
    
        // Reset shadow settings after drawing
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
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
        this.ctx.strokeStyle = "#FF9914"; // Set arrow color
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
        this.ctx.strokeStyle = "#FF9914"; // Set arrow color
        this.ctx.stroke();
    }

    drawLine(startX: number, startY: number, endX: number, endY: number){
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;

        const midX = (startX + endX) / 2;

        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(midX, startY);

        this.ctx.lineTo(midX, endY);

        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = "#FF9914";
        this.ctx.stroke();

        this.drawArrowhead(startX + (endX-startX)/4, startY, endX - startX);
        this.drawArrowhead(startX + (endX-startX)*3/4, endY, endX - midX);
    }
    
    drawArrowhead(x:number, y:number, dx:number) {
        let angle = 0;
        if(dx  <= 0){
            angle = Math.PI;
        }
        const length = 10; // Arrowhead size
    
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - length * Math.cos(angle - Math.PI / 6),
            y - length * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - length * Math.cos(angle + Math.PI / 6),
            y - length * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.strokeStyle = "#FF9914"; // Set arrow color
        this.ctx.stroke();
    }   

    drawBox(box: Box, transformx: number, transformy: number, scale: number){
        let width = box.width;
        let height = box.height;
        let x = box.position.x; // Centered on the canvas
        let y = box.position.y; // Centered on the canvas
        let fontsize = 16;
        let borderRadius = 4;
        const color = box.color;

        if(box.in_panel){
            x = (x-transformx)/scale;
            y = (y-transformy)/scale;

            width = box.width_in_panel/scale;
            height = box.height_in_panel/scale;

            borderRadius = 4/scale;

            fontsize = 14/scale;
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
        this.ctx.lineWidth = 1/scale;
        this.ctx.strokeStyle = "#333";
        this.ctx.stroke();
      
        // Draw the shadow
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 3;
      
        // Draw the inner content (centered text)
        this.ctx.font = `${fontsize}px Arial`;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.87)";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(box.message, x + width / 2, y + height / 2);
      
        // Reset the shadow
        this.ctx.shadowColor = "transparent";
    }

    drawPixel(x:number, y: number, transformx: number, transformy: number, scale: number){
        x = (x-transformx)/scale;
        y = (y-transformy)/scale;

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(x, y, 1/scale, 1/scale,);
    }

    drawBinIcon(x: number, y: number, w: number, h: number, transformx: number, transformy: number, scale: number){
        var canvas = document.getElementById("binCanvas");
        var ctx = this.ctx.getContext("2d");

        x = (x-transformx)/scale;
        y = (y-transformy)/scale;

        w = w/scale;
        h = h/scale;

        // Calculate the proportional sizes based on width and height
        var lidHeight = h * 0.15; // Height for the lid (15% of total height)
        var bodyHeight = h * 0.85; // Height for the body (85% of total height)
        var handleHeight = lidHeight * 0.5; // Handle height (50% of lid height)

        // Draw the trash can body
        ctx.fillStyle = "#555"; // Grey color for the body
        ctx.fillRect(x, y + lidHeight, w, bodyHeight); // x, y, width, height

        // Draw the lid
        ctx.fillStyle = "#777"; // Slightly lighter grey for the lid
        ctx.fillRect(x - w * 0.1, y, w * 1.2, lidHeight); // Extend lid beyond body

        // Draw the lid handle
        ctx.fillStyle = "#333"; // Dark grey for the handle
        ctx.fillRect(x + w * 0.3, y - handleHeight * 0.5, w * 0.4, handleHeight); // Center handle

        // Draw bin lines to represent depth or bin openings
        ctx.strokeStyle = "#333"; // Dark grey lines
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + lidHeight + bodyHeight * 0.5); // First line (middle of body)
        ctx.lineTo(x + w, y + lidHeight + bodyHeight * 0.5); // Ending point of first line
        ctx.moveTo(x, y + lidHeight + bodyHeight * 0.75); // Second line (near bottom)
        ctx.lineTo(x + w, y + lidHeight + bodyHeight * 0.75);
        ctx.stroke();

    }

    drawHandles(box: Box, transformx: number, transformy: number, scale: number){

        if(box.in_panel){
            return;
        }

        for (const handle of box.handles) {

            let handletype: number = 0; //0 = nil, 1 = left, 2 = right, 3 = top


            let x = box.position.x + handle.left;
            let y = box.position.y + handle.top;
            let height = handle.height;
            let width = handle.width;
            let color = handle.color;
            let cornerRadius = 10;

            const connected = handle.connected;//custom handler needed later

            //if(!connected){
            //    color = "#aaa"; 
            //}


            switch (handle.type){
                case "output":
                    handletype = 2;
                break;

                case "special_output":
                    handletype = 2;
                break;
                
                case "input":
                    handletype = 1;
                break;

                case "special_input":
                    handletype = 1;
                break;

                case "delete":
                    handletype = 3;
                break;

                default: handletype = 0;
            }

            if(handletype === 1){//left 
                if(!connected){
                    x -= 1;
                }
            }
            else if (handletype === 2){//right
                if(!connected){
                    x += 1;
                }
            }
            else 

            if(box.in_panel){//transformation handle
                x = (x-transformx)/scale;
                y = (y-transformy)/scale;
    
                width = width/scale;
                height = height/scale;

                cornerRadius = 5/scale;
            }

            // Draw handle
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = "#333";
            this.ctx.lineWidth = 1/scale;
            this.ctx.beginPath();

            if(handletype === 1){//left 
                this.ctx.moveTo(x , y);                               // Top left corner
                this.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);  // Top-right corner
                this.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius); // Bottom-right corner
                this.ctx.lineTo(x, y + height);
            }
            else if(handletype === 2){//right
                this.ctx.moveTo(x + width , y);                               // Top left corner
                this.ctx.arcTo(x, y, x, y + height, cornerRadius);  // Top-right corner
                this.ctx.arcTo(x, y + height, x + width, y + height, cornerRadius); // Bottom-right corner
                this.ctx.lineTo(x + width, y + height);
            }
            else if(handletype === 3){
                //this.drawBinIcon(x, y, width, height, transformx, transformy, scale); something like that
            }

            if(!connected){//if empty!
                this.ctx.stroke();
            }
            this.ctx.closePath();
            this.ctx.fill();
            if(connected){
                this.ctx.stroke();
                // Draw arrow inside the box
                this.ctx.fillStyle = 'white'; // Arrow color (white)
                this.ctx.beginPath();
                this.ctx.moveTo(x + handle.width/4, y + handle.height/4);  // Arrow start (left)
                this.ctx.lineTo(x + handle.width/2, y + handle.height/2); // Arrow tip (center right)
                this.ctx.lineTo(x + handle.width/4, y + (3/4)*handle.height); // Arrow end (bottom left)
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
    }

    drawInputHandle(x: number, y: number, handle: Handle, scale: number){
        let height = handle.height;
        let width = handle.width;
        let color = handle.color;
        let cornerRadius = 10;

        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = "#333";
        this.ctx.lineWidth = 1/scale;
        this.ctx.beginPath();

        this.ctx.moveTo(x , y);                               // Top left corner
        this.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);  // Top-right corner
        this.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius); // Bottom-right corner
        this.ctx.lineTo(x, y + height);

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        // Draw arrow inside the box
        this.ctx.fillStyle = 'white'; // Arrow color (white)
        this.ctx.beginPath();
        this.ctx.moveTo(x + handle.width/4, y + handle.height/4);  // Arrow start (left)
        this.ctx.lineTo(x + handle.width/2, y + handle.height/2); // Arrow tip (center right)
        this.ctx.lineTo(x + handle.width/4, y + (3/4)*handle.height); // Arrow end (bottom left)
        this.ctx.closePath();
        this.ctx.fill();
    }

    showContextMenu(event: MouseEvent){//TODO

    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}