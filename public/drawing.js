const url = "http://garrettburroughs.com:8080/";

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");
const clear = document.querySelector('#clear');

const predict = document.querySelector('#predict');
const prediction = document.querySelector('#prediction');

const pixelWidth = ctx.canvas.width / 28;
const pixelHeight = ctx.canvas.height / 28;

let canvasData = [];
for (let i = 0; i < 28 * 28; i++){
    canvasData.push(0);
}


const clearCanvas = () => {

    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            ctx.fillStyle = `#000000`;
            ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight);
        }
    }
    for (let i = 0; i < 28 * 28; i++) {
        canvasData[i] = 0;
    }

}
clearCanvas();
canvas.onmousedown = (eC) => {

    console.log(eC);
    window.onmousemove = (eW) => {
        let x1 = Math.floor((eW.clientX) / pixelWidth);
        let y1 = Math.floor((eW.clientY) / pixelWidth);
        // console.log({ x, y });
        ctx.fillStyle = `#FFFFFF`;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++){
                let x = x1 + i;
                let y = y1 + j;
                if (x > 0 && x < 28 && y > 0 && y < 28) {
                    ctx.fillRect(x * pixelWidth, y * pixelWidth, pixelWidth, pixelHeight);
                    canvasData[y * 28 + x] = 255;
                }
                
            }
        }
        
    };
    window.onmouseup = (eW) => {
        window.onmousemove = () => { };
    } 
}

clear.onmousedown = clearCanvas;


predict.onclick = async () => {
    console.log(canvasData);
    const result = await fetch(url + `prediction`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageData: canvasData
        })
    }).then(res => res.json());
    console.log(result);
    prediction.innerHTML = result.prediction;
}