class Road{

    #INF = 100000;

    /**
     * 
     * @param {Number} x 
     * @param {Number} width 
     * @param {Number | null} laneCount 
     */

    constructor(x, width, laneCount = 3){
        //Properties that describe the road
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        //Coordinate points that are useful
        this.left = x - width/2;
        this.right = x + width/2;
        this.top = -this.#INF;
        this.bottom = this.#INF;

        //Util border cache
        const topLeft = {x: this.left, y: this.top};
        const topRight = {x: this.right, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const bottomRight = {x: this.right, y: this.bottom};
        
        this.borders = [[topLeft, bottomLeft], [topRight, bottomRight]];

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        context.strokeStyle = "white";
        context.lineWidth = 5;

        
        //Draw all the lanes 
        for(let i = 1; i <= this.laneCount-1; ++i){

            const x = liniarInterpol(this.left, this.right, i/this.laneCount)
            //Design the lanes 
            context.setLineDash([15,15]);

            //Draw
            context.beginPath();
            context.moveTo(x, this.top);
            context.lineTo(x, this.bottom);
            context.stroke();
        }

        //Draw the borders
        context.setLineDash([]);
        this.borders.forEach(borderSet => {
            context.beginPath();
            context.moveTo(borderSet[0].x, borderSet[0].y);
            context.lineTo(borderSet[1].x, borderSet[1].y);
            context.stroke();

        });
        
    }

    /**
     * 
     * @param {Number} laneNum - Number of the lane
     * @returns {Number} the position of the middle of the lane where the car will be placed
     */
    getlanePosition(laneNum){

        //Safe guard your variable 
        if(laneNum > this.laneCount-1) laneNum = this.laneCount-1;
        if(laneNum < 0) laneNum = 0;

        let startingPoint = this.left;
        let widthPerLane = this.width/this.laneCount;
        
        //Computing the middle of the first lane
        startingPoint += widthPerLane/2;
        //Adding the offset of the Nth lane
        startingPoint += laneNum * widthPerLane;
        return startingPoint;
    }
}