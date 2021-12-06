# Digit Recognition

A neural network model trained on the [The MNIST Database of Handwritten Digits](http://yann.lecun.com/exdb/mnist/)

While this particular model is trained specifically on the MNIST data, and this repository contains modules for loading and training on the MNIST data set, the Neural Network infrastructure created in this repository can be trained on any dataset. 

## Training a Model

```
$ npm run train <dataPoints> <learningRate> <iterations> <filename?>
```
`dataPoints` - the number of digit datapoints to use from the MNIST data set. The data points are chosen in order

`learningRate` - the rate at which to adjust the weights and biases after each data point is tested

`iterations` - how many times the model should run through all of the data points

`filename` (optional) - the filename to store the model. Files will be stored as json in the `models` directory. If no filename is specified, the model will be stored as `NN-${dataPoints}-${learningRate}-${iterations}.json`

## Running a Model

When started, the models will be hosted at `localhost:8080`. Testing data from the MNIST data set can be tested at `localhost:8080/index.html` and user inputted drawings can be tested at `localhost:8080/drawing.html`

Host a model

```
$ npm run start <filename>
```

Filename is the name of the file within the `models` directory that the program will load. 
