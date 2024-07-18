class Sensor{

    /**
     * 
     * @param {Car} car 
     * 
     */
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayRange = 150;
        this.raySpread = Math.PI / 4;

        this.rays = [];
        this.borderCollisionRecords = [];
    }

    /**
     * 
     * @param {{x: Number, y: Number}[][]} borders 
     * @param {Car[]} traffic
     */
    update(borders, traffic){
        this.#updateRays();
        this.#checkBorderColision(borders, traffic);
    }

    /**
     * 
     * @param {{x: Number, y: Number}[][]} borders 
     * @param {Car[]} traffic
     */
    #checkBorderColision(borders, traffic){
        this.borderCollisionRecords = [];

        this.rays.forEach(rayObj => {
            this.borderCollisionRecords.push(
                this.#getBorderCollision(rayObj, borders, traffic)
            );
        });
    }

    /**
     * 
     * @param {{x: Number, y: Number}[]} rayObj 
     * @param {{x: Number, y: Number}[][]} borders 
     * @param {Car[]} traffic
     * Collision type will be {x: number, y: number, offset: number}
     * offset - the most important is the distance between the collision point and the ray starting point(car itself)
     * offset - tells us how far the collision has occured and also allows us to extract the min{collision} = min{offset}
     */
    #getBorderCollision(rayObj, borders, traffic){
        let collisions = [];

        borders.forEach(border => {
            const collision = getIntersection(rayObj[0], rayObj[1], border[0], border[1]);
            
            if(collision) collisions.push(collision);
        });

        for(let i = 0 ; i < traffic.length; ++i){
            let polygon = traffic[i].polygon;
            for(let j = 0; j < polygon.length; ++j){
                const collision = getIntersection(rayObj[0], rayObj[1], polygon[j], polygon[(j+1) % polygon.length]);
                if(collision)
                    collisions.push(collision);
            } 
            
        }

        if(collisions.length == 0)
            return null;
        
        
        //Extract all the offsets 
        const offsets = collisions.map(coll => coll.offset);
        //Find the minimum
        const minOffset = Math.min(...offsets);
        //Return the Collision with the minimum offset
        return collisions.find(coll => coll.offset == minOffset);

    }

    

    /**
     * Method used to update the position of the rays
     * The update must be stored in the this.rays[] vector 
     * The updated rays' positions will be used to redrow the sensors after each frame 
     */
    #updateRays(){
        this.rays = [];
        for(let i = 0; i < this.rayCount; i++){
            const angle = liniarInterpol(this.raySpread, -this.raySpread, i/ (this.rayCount-1)) + this.car.angle;

            const start = {x: this.car.x, y:this.car.y};
            const end = {x: this.car.x - Math.sin(angle)*this.rayRange, y:this.car.y - Math.cos(angle)*this.rayRange};

            /*
                For consistance in the code we are gonna save the rays as a vector of lines
                Each line being a vector of an starting and ending point
            */
            this.rays.push([start, end]);
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        this.rays.forEach((rayArray, index) => {
            let endPoint = rayArray[1];
            if(this.borderCollisionRecords[index]){
                endPoint = this.borderCollisionRecords[index];
            }

            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "blue";
            context.moveTo(rayArray[0].x, rayArray[0].y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();

            //Drow the line where it could have been if not collided
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.moveTo(rayArray[1].x, rayArray[1].y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
        });
    }
};