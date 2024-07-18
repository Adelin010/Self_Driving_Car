class Level{
    /**
     * 
     * @param {Number} inputCount 
     * @param {Number} outCount 
     */
    constructor(inputCount, outCount){
        //Using simple empty arrays of numbers
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outCount);
        this.biases = new Array(outCount);

        this.weights = [];
        for(let i = 0; i < inputCount; ++i){
            this.weights.push(new Array(outCount));
        }

        Level.#randomize(this);
    }


    /**
     * 
     * @param {Level} level 
     * Init the value of each neuron with a random value from (-1, 1)
     * where negative values offer us the posibility of knowing the direction which we change to avoid collision
     */
    static #randomize(level){
        for(let i = 0; i < level.inputs.length; ++i){
            for(let j = 0; j < level.outputs.length; ++j){
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for(let i = 0; i < level.outputs.length; ++i){
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    /**
     * 
     * @param {Number[]} sensorsInputs 
     * @param {Level} level 
     * @returns {Number[]}
     * Uses feedForward method to create a new output array of the active/nonactive neurons
     */
    static feedForward(sensorsInputs, level){

        if(level == null || level == undefined)
            return null;

        //assign the sensors computed values to the input array
        for(let i = 0; i < level.inputs.length; ++i){
            level.inputs[i] = sensorsInputs[i];
        }

        //compute the value that is sent to the output network
        //the value will be a sum of all the inputs * weights(of the neuronal link)
        for(let i = 0; i < level.outputs.length; ++i){
            let sum = 0;
            for(let j = 0; j < level.inputs.length; ++j){
                sum += level.inputs[j] * level.weights[j][i];
            }

            //Turn the neuron on if the threshold is passed
            if(sum > level.biases[i])
                level.outputs[i] = 1;
            else 
                level.outputs[i] = 0;
        }
        return level.outputs;
    }
}