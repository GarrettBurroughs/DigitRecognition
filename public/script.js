const url = "http://garrettburroughs.com:8080/";
const canvas = document.querySelector('#display');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const counter = document.querySelector('#num');
const label = document.querySelector('#label');
const predict = document.querySelector('#predict');
const prediction = document.querySelector('#prediction');

let currentImg = 0;
let currentImgData;

const loadImage = async (id) => {
    const imageData = await fetch(url + `testImage/${id}`).then(data => data.json());
    const ctx = canvas.getContext("2d");

    const pixelWidth = ctx.canvas.width / imageData.width;
    const pixelHeight = ctx.canvas.height / imageData.height;

    for (let i = 0; i < imageData.height; i++){
        for (let j = 0; j < imageData.width; j++){
            const hexValue = Number(imageData.data[i * imageData.width + j]).toString(16);
            ctx.fillStyle = `#${hexValue}${hexValue}${hexValue}`;
            ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight);
        }
    }

    label.innerHTML = imageData.label;
    currentImgData = imageData;
    
}

loadImage(currentImg);

prevBtn.onclick = () => {
    currentImg--;
    currentImg = currentImg < 0 ? 0 : currentImg;
    loadImage(currentImg);
    counter.innerHTML = currentImg;
}

nextBtn.onclick = () => {
    currentImg++;
    currentImg = currentImg > 10000 ? 10000 : currentImg;
    loadImage(currentImg);
    counter.innerHTML = currentImg;
}

predict.onclick = async () => {
    const result = await fetch(url + `prediction`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageData: currentImgData.data,
            label: currentImgData.label
        })
    }).then(res => res.json());
    console.log(result);
    prediction.innerHTML = result.prediction;
}
