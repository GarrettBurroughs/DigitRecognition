import { createMatrix, elementWiseMultiply, generateMatrix, Matrix, matrixAdd, matrixMultiply, matrixSubtract } from './matrix';
import * as fs from "fs";

const activation = (x: number) => 1 / (1 + Math.exp(-x));
const activationPrime = (x: number) => activation(x) * (1 - activation(x));

export class NN {
    layers: number;
    weights: Matrix[];
    biases: Matrix[];
    nodeConfig: number[];

    constructor(...nodeConfig: number[]) {
        this.nodeConfig = nodeConfig;
        this.layers = nodeConfig.length - 1;
        this.weights = [];
        this.biases = [];

        for (let i = 1; i < nodeConfig.length; i++){
            this.weights.push(generateMatrix(nodeConfig[i - 1], nodeConfig[i], () => (Math.random() - 0.5) * 0.1));
            this.biases.push(generateMatrix(1, nodeConfig[i], () => 0.1));
        }
    }

    saveModel(file: fs.PathOrFileDescriptor) {
        const jsonData = JSON.stringify({
            nodeConfig: this.nodeConfig,
            weights: this.weights.map(w => w.matrixData),
            biases: this.biases.map(b => b.matrixData)
        });
        fs.writeFileSync(file, jsonData);
    }

    setParams(weights: Matrix[], biases: Matrix[]) {
        this.weights = weights;
        this.biases = biases;
    }

    predict(input: Matrix) {
        if (input.cols != this.nodeConfig[0]) throw new Error("Input size must match first layer");
        let output = input;
        for (let i = 0; i < this.layers; i++) {
            output = matrixMultiply(output, this.weights[i]);
            //output = matrixAdd(output, this.biases[i]);
            output.apply(activation); 
        }
        return output;
    }

    computeGradients(input: Matrix, expected: Matrix) {
        let output = input;
        let layerValues = [];
        let layerActivity = [];
        let deltas = [];
        let gradients = [];
        layerValues.push(input.copy());
        layerActivity.push(input.copy());

        for (let i = 0; i < this.layers; i++) {
            output = matrixMultiply(output, this.weights[i]);
            output = matrixAdd(output, this.biases[i]);
            layerValues.push(output.copy());
            output.apply(activation);
            layerActivity.push(output.copy());
        }
        const lastDelta = elementWiseMultiply(
            matrixSubtract(output, expected),
            layerValues[layerValues.length - 1].copy().apply(activationPrime)
        );
        deltas.push(lastDelta);
        gradients.push(matrixMultiply(layerActivity[layerActivity.length - 2].transpose(), lastDelta));

        for (let i = this.layers - 1; i > 0; i--) {
            let delta = elementWiseMultiply(
                matrixMultiply(deltas[0], this.weights[i].transpose()),
                layerValues[i].copy().apply(activationPrime)
            );
            deltas.unshift(delta);
            gradients.unshift(matrixMultiply(layerActivity[i - 1].transpose(), delta));
        }
        return [gradients, deltas];
    }

    updateParameters(weightGradients: Matrix[], biasGradients: Matrix[], rate: number) {
        if (weightGradients.length !== this.layers) throw new Error("number of gradient matricies need to match number of layers");
        for (let i = 0; i < weightGradients.length; i++){
            this.weights[i] = matrixSubtract(this.weights[i], weightGradients[i].copy().apply(x => x * rate));
            this.biases[i] = matrixSubtract(this.biases[i], biasGradients[i].copy().apply(x => x * rate));
        }
    }

    calculateError(input: Matrix, expected: Matrix) {
        let output = this.predict(input);
        const errMatrix = matrixSubtract(expected, output).matrixData[0];
        let err = 0;
        for (let num of errMatrix) {
            err += num * num;
        }
        return 0.5 * err;
    }

    train(input: Matrix, expected: Matrix, rate: number) {
        let [weightGradients, biasGradients] = this.computeGradients(input, expected);
        this.updateParameters(weightGradients, biasGradients, rate);
    }
}

export const importFromFile = (file: fs.PathOrFileDescriptor) => {
    const NNData = JSON.parse(fs.readFileSync(file).toString());
    const nodeConfig = NNData.nodeConfig;
    const weightMatrixData: number[][][] = NNData.weights;
    const biasMatrixData: number[][][] = NNData.biases;
    const network = new NN(...nodeConfig);
    const weights = weightMatrixData.map(w => createMatrix(w));
    const biases = biasMatrixData.map(b => createMatrix(b));
    network.setParams(weights, biases);

    console.log(`Loaded neural network from ${file}`);
    console.log(`Input Nodes: ${nodeConfig[0]}`);
    for (let i = 1; i < nodeConfig.length - 1; i++) {
        console.log(`Hidden Layer ${i} nodes: ${nodeConfig[i]}`);
    }
    console.log(`Output Nodes: ${nodeConfig[nodeConfig.length - 1]}`);
    return network;

}