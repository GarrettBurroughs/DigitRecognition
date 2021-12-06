import { DataLoader, MNISTImage } from './dataLoader';
import * as path from "path";
import { NN } from './NN';
import { createMatrix } from './matrix';
import { createInterface }from "readline";

const trainImages = new DataLoader(
    path.join(__dirname, '../data/train-images-idx3-ubyte'),
    path.join(__dirname, '../data/train-labels-idx1-ubyte')
);

const createTargetMatrix = (label: number) => {
    const targetMatrixData = [];

    for (let i = 0; i < 10; i++) {
        if (i === label) {
            targetMatrixData.push(1);
        } else {
            targetMatrixData.push(0);
        }
    }
    return createMatrix([targetMatrixData]);
}

const createTrainingInput = (image: MNISTImage) => {
    let data = createMatrix([image.data]).apply(n => n > 100 ? 1 : 0);
    let targetMatrix = createTargetMatrix(image.label);
    return [data, targetMatrix];
}

export const trainNetwork = (network: NN, iterations: number, data: number, rate: number) => {
    console.log(`Training network with ${data} data points over ${iterations} iterations`);
    for (let j = 0; j < iterations; j++) {
        let error = 0;
        for (let i = 0; i < data; i++) {
            const [data, targetMatrix] = createTrainingInput(trainImages.getImage(i));
            error += network.calculateError(data, targetMatrix);
            network.train(data, targetMatrix, rate);
        }
        console.log(`Error after iteration ${j} : ${error / data}`);
    }
    return network;
}

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = async (prompt: string) => {
    const response = await new Promise<string>((resolve, reject) => {
        readline.question(prompt, res => {
            resolve(res);
            readline.close()
        });
    });
    return response; 
}


let dataPoints = +process.argv[2] || 1;
let iterations = +process.argv[3] || 1;
let learningRate = +process.argv[4] || 1;
let fileName = process.argv[5] || `NN-${dataPoints}-${learningRate}-${iterations}`;

const network = trainNetwork(new NN(28 * 28, 32, 10), iterations, dataPoints, learningRate);
console.log(`Saving model to ${path.join(__dirname, `../models/${fileName}.json`)}`);
network.saveModel(path.join(__dirname, `../models/${fileName}.json`));


