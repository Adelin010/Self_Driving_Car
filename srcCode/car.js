/**
 * Class Car - the main object on the frame 
 * Composition principles applied on the Sensor, Controller -> Car
 */
class Car{

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {String} controllType
     * @param {Number} maxSpeed
     */
    constructor(x, y, width, height, controllType, maxSpeed = 3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.acceler = 0.1;
        this.friction = 0.047;
        this.angle = 0;
        this.polygon = [];
        this.damaged = false;

        this.controller = new Controller(controllType);

        if(controllType != "BOOT"){
            this.sensor = new Sensor(this);
            //creating a Network with 3 layers
            this.brain = new NeuronalNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }

        this.useNetwork = controllType == "AUTOMATIC";


    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {string} color 
     * @param {boolean} [drawSensor=false] 
     * Used to draw a Rectangle representing the car
     */
    draw(context, color, drawSensor = false) {

        if(this.damaged)
            context.fillStyle = "gray";
        else 
            context.fillStyle = color;

        //Use the points we computed for the corner of the polygon to drow the car 
        context.beginPath();
        context.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; ++i){
            context.lineTo(this.polygon[i].x, this.polygon[i].y);
        }        
        context.fill();
        if(this.sensor != null && drawSensor)
            this.sensor.draw(context);
    }

    /**
     * @param {{x: Number, y: Number}[][]} borders
     * @param {Car[]} traffic
     * Function used to update the position based on the change of the states
     * of the controller attriutes
     */
    updateState(borders, traffic){

        if(!this.damaged){
            this.#motion();
            this.polygon = this.#createPolygon();
            this.damaged = this.#atributeDamage(borders, traffic);
        }
        if(this.sensor != null){
            this.sensor.update(borders, traffic);
            const offsets = this.sensor.borderCollisionRecords.map(record => record == null ? 0 : 1 - record.offset);
            const outputs = NeuronalNetwork.feedForward(offsets, this.brain);
            console.log(outputs);

            if(this.useNetwork){
                this.controller.forward = outputs[0];
                this.controller.left = outputs[1];
                this.controller.right = outputs[2];
                this.controller.back = outputs[3];
            }
        }
       
    }

    #motion(){
        if(this.controller.forward){
            this.speed -= this.acceler;
        }else if(this.controller.back){
            this.speed += this.acceler;
        }

        //Putting limits to the speed of the car
        if(this.speed > this.maxSpeed)this.speed = this.maxSpeed;
        if(this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

        //Adding friction to the movement to make it as natural as possible
        if(this.speed > 0 )this.speed -= this.friction;
        if(this.speed < 0) this.speed += this.friction;

        //If speed < friction there will still be a motion implied by the friction
        //which should be canceled 
        if(Math.abs(this.speed) < this.friction)this.speed = 0;

        /*
            If the direction of the motion changes than 
            the way we stear should reverse also that's why we have 
            let direction to simbolise the change
            ALSO: bare in mind that on web forward means down the screen (REVERSED WAY)
        */
        if(this.speed != 0){
            let direction = this.speed > 0? -1: 1;
            if(this.controller.right)this.angle -= 0.02 * direction;
            if(this.controller.left)this.angle += 0.02 * direction;
            
        }
        this.x += Math.sin(this.angle )*this.speed;
        this.y += Math.cos(this.angle )*this.speed;
    }

    /**
     * @typedef {{x: Number, y: Number}} Point 
     * @returns {Point[]} 
     */
    #createPolygon(){
        const points = [];
        //Rad = the half of the diagonal - as we need to reach the corner from the center point
        const rad = Math.hypot(this.width, this.height) / 2;
        //tan alpha = width / height
        const alpha = Math.atan2(this.width, this.height);

        //Compute the corners
        //Top Right 
        points.push({
            x: this.x - Math.sin(this.angle - alpha)* rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        //Top Left
        points.push({
            x: this.x - Math.sin(this.angle + alpha)* rad,
            y: this.y - Math.cos(this.angle + alpha)* rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha)* rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha)* rad
        });

        return points;
    }

    /**
     * 
     * @param {{x: Number, y: Number}[][]} borders 
     * @param {Car[]} traffic
     */
    #atributeDamage(borders, traffic){
        for(let i = 0; i < borders.length; ++i){
            if(polygonsIntersection(this.polygon, borders[i]))
                return true;
        }

        for(let i = 0; i < traffic.length; ++i){
            if(polygonsIntersection(this.polygon, traffic[i].polygon))
                return true;
        }
        return false;
    }
}