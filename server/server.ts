import * as express from 'express';
import { DataLoader } from './dataLoader';
import * as path from "path";
import { createMatrix, Matrix } from './matrix';
import { trainNetwork } from './NNTrainer';
import { importFromFile, NN } from './NN';

const app = express();
const port = process.env.PORT || 8080;

const testImages = new DataLoader(
    path.join(__dirname, '../data/t10k-images-idx3-ubyte'),
    path.join(__dirname, '../data/t10k-labels-idx1-ubyte')
);

const network = importFromFile(path.join(__dirname, `../models/${process.argv[2] || "NN1.json"}`));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get('/testImage/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        res.send(testImages.getImage(id));
    } catch (e) {
        res.status(404).send('invalid id');
    }
});


app.post('/prediction', (req, res) => {
    const input = req.body.imageData;
    const inputMatrix = createMatrix([input]).apply(x => x / 255.0);    
    
    const predictionData = network.predict(inputMatrix);

    res.send({
        predictionData: predictionData,
        prediction: getPrediction(predictionData)
    });
});

const getPrediction = (m: Matrix) => {
    const row = m.matrixData[0];
    let max = 0;
    for (let i = 0; i < row.length; i++) {
        if (row[i] > row[max]) max = i;
    }
    return max;
}



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

