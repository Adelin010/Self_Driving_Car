class Displayer{
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {NeuronalNetwork} network 
     */
    static activateNetwork(context, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = context.canvas.width - margin*2;
        const height = context.canvas.height - margin*2;


        const levelHeight = height / network.levels.length;
        for(let i = network.levels.length - 1; i >= 0; --i){
            const levelTop = top + liniarInterpol(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i/(network.levels.length - 1));
            Displayer.activateLevel(context, network.levels[i], left, levelTop, width, levelHeight, i == network.levels.length-1 ? ["Up", 'L', "R", "Dw"] : []);
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Level} level 
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} width 
     * @param {Number} height 
     * @param {String[]} outputLabels 
     */
    static activateLevel(context, level, left, top, width, height, outputLabels){
        const right = left + width;
        const bottom = top + height;
        const nodeRadius = 18;
        const {inputs, outputs, weights, biases} = level;

        
        /*
            Draw the lines that connects our Neurons
            which are weighted and serves as Axons connections
        */
        for(let i = 0; i < inputs.length; ++i){
            for(let j = 0; j < outputs.length; ++j){
                context.beginPath();
                context.setLineDash([7, 3]);
                context.moveTo(Displayer.#getCoordX(inputs, i, left, right), bottom);
                context.lineTo(Displayer.#getCoordX(outputs, j, left, right), top);
                context.lineWidth = 2;
                context.strokeStyle = rgbaFromValue(weights[i][j]);
                context.stroke();
            }
        }
        //Input Neurons 
        for(let i = 0; i < inputs.length; ++i){
            const x = Displayer.#getCoordX(inputs, i, left, right);
            context.beginPath();
            context.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            context.fillStyle = "rgb(23, 23, 23)";
            context.fill();

            context.beginPath();
            context.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI*2);
            context.fillStyle = rgbaFromValue(inputs[i]);
            context.fill();
        }
        //Output Neurons
        for(let i = 0; i < outputs.length; ++i){
            const x = Displayer.#getCoordX(outputs, i, left, right);
            context.beginPath();
            context.arc(x, top, nodeRadius , 0, Math.PI*2);
            context.fillStyle = "rgb(23, 23, 23)";
            context.fill();

            context.beginPath();
            context.arc(x, top, nodeRadius * 0.6, 0, Math.PI*2);
            context.fillStyle = rgbaFromValue(outputs[i]);
            context.fill();

            context.beginPath();
            context.lineWidth = 2;
            context.arc(x, top, nodeRadius * 0.9, 0, Math.PI*2);
            context.strokeStyle = rgbaFromValue(biases[i]);
            context.setLineDash([3, 3]);
            context.stroke();
            context.setLineDash([]);

            if(outputLabels[i]){
                context.beginPath();
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "white";
                context.strokStyle = "white";
                context.font = (nodeRadius * 1.5) + "px Arial";
                context.fillText(outputLabels[i], x, top - 30);
                context.lineWidth = 0.5;
                context.strokeText(outputLabels[i], x, top - 30);
            }
        }
    }

    /**
     * 
     * @param {Number[]} nodes 
     * @param {Number} index 
     * @param {Number} left 
     * @param {Number} right 
     * @returns {Number}
     */
    static #getCoordX(nodes, index, left, right){
        return liniarInterpol(left, right, nodes.length == 1? 0.5: index/(nodes.length-1));
    }
}