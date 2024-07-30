export class Canvas{
    ctx: any;
    x: number;
    y: number;
    message: string;

    constructor(ctx: any, x: number, y: number, message: string){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.message = message;
    }

    /**
     * @brief draw the og test draggable box onto the canvas
     * @param ctx 
     * @param x 
     * @param y 
     * @note TODO: ajust type of ctx
     */
    draw() {
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
    
        this.ctx.save();
    
        // Draw box shadow
        boxShadow.forEach(shadow => {
        this.ctx.shadowOffsetX = shadow.x;
        this.ctx.shadowOffsetY = shadow.y;
        this.ctx.shadowBlur = shadow.blur;
        this.ctx.shadowColor = shadow.color;
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(this.x, this.y, width, height);
        this.ctx.shadowOffsetY = shadow.y;
        this.ctx.shadowBlur = shadow.blur;
        this.ctx.shadowColor = shadow.color;
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(this.x, this.y, width, height);
        });
    
        this.ctx.restore();
        
        // Draw border and background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + borderRadius, this.y);
        this.ctx.lineTo(this.x + width - borderRadius, this.y);
        this.ctx.quadraticCurveTo(this.x + width, this.y, this.x + width, this.y + borderRadius);
        this.ctx.lineTo(this.x + width, this.y + height - borderRadius);
        this.ctx.quadraticCurveTo(this.x + width, this.y + height, this.x + width - borderRadius, this.y + height);
        this.ctx.lineTo(this.x + borderRadius, this.y + height);
        this.ctx.quadraticCurveTo(this.x, this.y + height, this.x, this.y + height - borderRadius);
        this.ctx.lineTo(this.x, this.y + borderRadius);
        this.ctx.quadraticCurveTo(this.x, this.y, this.x + borderRadius, this.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw centered text
        this.ctx.fillStyle = textColor;
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.message, this.x + width / 2, this.y + height / 2);
    }
}