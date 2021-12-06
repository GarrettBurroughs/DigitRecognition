import { readFileSync, PathOrFileDescriptor } from 'fs';

export class DataLoader {
    images: MNISTImage[]
    
    constructor(imageDataFile: PathOrFileDescriptor, labelDataFile: PathOrFileDescriptor) {
        const imageData = readFileSync(imageDataFile);
        const labelData = readFileSync(labelDataFile);
        const numImages = imageData.readInt32BE(4);
        const numLabels = labelData.readInt32BE(4);
        const imageHeight = imageData.readInt32BE(8);
        const imageWidth = imageData.readInt32BE(12);
        const totalPixels = imageHeight * imageWidth;
        if (numImages !== numLabels) throw new Error('Mismatch between number of images and labels in data set');
        
        this.images = [];
        
        for (let i = 0; i < numImages; i++) {
            const label = labelData.readUInt8(8 + i);
            const data = [];
            for (let j = 0; j < totalPixels; j++){
                data.push(imageData.readUInt8(16 + i * totalPixels + j) > 50 ? 255 : 0);
            }
            this.images.push({
                height: imageHeight,
                width: imageWidth,
                data: data,
                label: label
            })
        }
    }

    getImage(idx: number) {
        return this.images[idx];
    }
}

export interface MNISTImage {
    height: number;
    width: number;
    data: number[];
    label: number;
}