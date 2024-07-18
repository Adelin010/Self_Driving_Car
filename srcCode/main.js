/**
 * @var {Canvas} frame - the main canvas
 * It will represent the developing area of the app
 */
const frame = document.getElementById("main_frame");
frame.width = 300;
const networkFrame = document.getElementById("network_frame");
networkFrame.width = 500;


/**
 * context - the context 
 * is the driver object of the canvas that allows modifications to the frame
 * @var {CanvasRenderingContext2D} context
 */
const context = frame.getContext("2d");
const networkContext = networkFrame.getContext("2d");
const road = new Road(frame.width/2, frame.width*0.9);
const cars = generateCars(50);
let bestCar  = cars[0];
const players = [...cars];
const traffic = [
    new Car(road.getlanePosition(1), -100, 30, 50, "BOOT", 3),
    new Car(road.getlanePosition(0), -300, 30, 50, "BOOT", 3),
    new Car(road.getlanePosition(2), -300, 30, 50, "BOOT", 3),
    new Car(road.getlanePosition(1), -500, 30, 50, "BOOT", 3),
    new Car(road.getlanePosition(2), -500, 30, 50, "BOOT", 3),
    new Car(road.getlanePosition(1), -700, 30, 50, "BOOT", 3),
    new Car(road.getlanePosition(0), -700, 30, 50, "BOOT", 3)


];


/*
    For cars[0] we will be holding the best model up until now
    For each cars[i] we will slightly mutate the best model to descover maybe another model 
    which surpass the current one
 */
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length; ++i){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if(i != 0){
            NeuronalNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}



/**
 * 
 * @param {Number} N
 * @returns {Car[]} 
 * Generates N cars used for modelling the genetic inheritance of the algorithm
 */
function generateCars(N){
    let cars = [];
    for(let i = 0; i < N; ++i){
        cars[i] = new Car(road.getlanePosition(1), 100, 30, 50, "AUTOMATIC", 5);
    }
    return cars;
}


function saveBestBrain(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}


/**
 * 
 * @param {*} time 
 * animation function is the main driver function that repeates the code inside a animation loop
 * many times per frame to automatic create the illusion of continuous functionality
 */

function animation(time){


    for(let i = 0 ; i < traffic.length; ++i){
        traffic[i].updateState(road.borders, players);
    }

    cars.forEach(car => car.updateState(road.borders, traffic));

    //Extract the best car as a best model for our network
    //As a feature trait used for delegeting the best car is our advance onto the Oy axis
    bestCar = cars.find(car => car.y == Math.min(
        ...cars.map(car2 => car2.y)
    ));

    //The Canvas will be updated each time per frame animation 
    //Updating will cause the Canvas to be cleared thus having only a car drawn
    frame.height = window.innerHeight;
    networkFrame.height = window.innerHeight; 

    

    context.save();
    context.translate(0, -bestCar.y + frame.height * 0.7);


    road.draw(context);
    traffic.forEach(trafficCar => {
        trafficCar.draw(context);
    })
    cars.forEach(car => car.draw(context, "brown"));
    bestCar.draw(context, "brown", true);
    context.restore();

    networkContext.lineDashOffset = -time/50;

    Displayer.activateNetwork(networkContext, bestCar.brain);
    requestAnimationFrame(animation);
}

animation();

