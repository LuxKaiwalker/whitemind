/**
 * here the drawn shapes are implemented andf this file is exported to brainet.component.ts
 */

export class CanvasShapes{
    /**
     * @brief draw the og test draggable box onto the canvas
     * @param ctx 
     * @param x 
     * @param y 
     * @note TODO: ajust type of ctx
     */
    static drawExampleBox(ctx: any, x: number, y: number, message: string) {
        const width = 200;
        const height = 200;
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
    
        ctx.save();
    
        // Draw box shadow
        boxShadow.forEach(shadow => {
        ctx.shadowOffsetX = shadow.x;
        ctx.shadowOffsetY = shadow.y;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowColor = shadow.color;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, y, width, height);
        });
    
        ctx.restore();
        
        // Draw border and background
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw centered text
        ctx.fillStyle = textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, x + width / 2, y + height / 2);
    }
}

