class NeuronalNetwork{

    /**
     * 
     * @param {Number[]} levelNeuronCount 
     */
    constructor(levelNeuronCount){
        this.levels = [];
        for(let i = 0; i < levelNeuronCount.length - 1; i++){
            this.levels.push(new Level(levelNeuronCount[i], levelNeuronCount[i+1]));
        }
    }

    /**
     * 
     * @param {Number[]} sensorInputs 
     * @param {NeuronalNetwork} network 
     */
    static feedForward(sensorInputs, network){
        let outputs = Level.feedForward(sensorInputs, network.levels[0]);
        for(let i = 1; i < network.levels.length; ++i){
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

/**
 * 
 * @param {NeuronalNetwork} network 
 * @param {Number} amount 
 * The Mutation work on a best model which is saved in the web -local storage 
 * This best model allows us to built an inherited behaviour (genetically based)
 * The Mutation works by interpolating a new value between the old best one and a random new one 
 * based on a slightly offset
 */
    static mutate(network, amount=1){
        network.levels.forEach(level => {
            for(let i = 0; i < level.biases.length; i++){
                level.biases[i] = liniarInterpol(level.biases[i], Math.random()*2 -1, amount);
            }

            for(let i = 0; i < level.weights.length; ++i){
                for(let j = 0; j < level.weights[i].length; ++j){
                    level.weights[i][j] = liniarInterpol(level.weights[i][j], Math.random()*2 - 1, amount);
                }
            }
        });


    }
};




