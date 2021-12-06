export class Matrix {
    rows: number;
    cols: number;
    matrixData: number[][];

    constructor(rows: number, cols: number, matrixData: number[][]) {
        this.rows = rows;
        this.cols = cols;
        this.matrixData = matrixData;
    }
    
    // MUTATES DATA
    apply(fn: (x: number) => number) {
        for (let i = 0; i < this.matrixData.length; i++) {
            for (let j = 0; j < this.matrixData[i].length; j++) {
                this.matrixData[i][j] = fn(this.matrixData[i][j]);
            }
        }
        return this;
    }

    copy(): Matrix {
        return createMatrix(this.matrixData);
    }

    transpose(): Matrix{
        const data: number[][] = [];
        for (let i = 0; i < this.cols; i++) {
            const row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(this.matrixData[j][i]);
            }
            data.push(row);
        }
        return createMatrix(data);
    }
}

export const createMatrix = (matrixData: number[][]): Matrix => {
    const rows = matrixData.length;
    const cols = matrixData[0].length;
    const data = [];
    for (let i = 0; i < matrixData.length; i++) {
        const row = [];
        for (let j = 0; j < matrixData[0].length; j++) {
            row.push(matrixData[i][j]);
        }
        data.push(row);
    }
    return new Matrix(rows, cols, data);
}

export const createUniformMatrix = (rows: number, cols: number, value?: number ): Matrix => {
    const matrixData = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(value || 0);
        }
        matrixData.push(row);
    }
    return new Matrix(rows, cols, matrixData);
}

export const generateMatrix = (rows: number, cols: number, generator: (i: number, j: number) => number) => {
    const matrixData = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(generator(i, j));
        }
        matrixData.push(row);
    }
    return new Matrix(rows, cols, matrixData);
}

/**
 * Adds two matricies together, does not mutate the data in either matrix
 * 
 * @param a matrix a
 * @param b matrix b
 */
export const matrixAdd = (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) throw new Error(`Matrix Arithmetic Error: Attempt to add a ${a.rows}x${a.cols} and ${b.rows}x${b.cols} matrix`);
    const matrixData: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
        const row = [];
        for (let j = 0; j < a.cols; j++) {
            row.push(a.matrixData[i][j] + b.matrixData[i][j]);
        }
        matrixData.push(row);
    }
    return new Matrix(a.rows, a.cols, matrixData);
}

// Subtract
export const matrixSubtract = (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) throw new Error(`Matrix Arithmetic Error: Attempt to subtract a ${a.rows}x${a.cols} and ${b.rows}x${b.cols} matrix`);
    const matrixData: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
        const row = [];
        for (let j = 0; j < a.cols; j++) {
            row.push(a.matrixData[i][j] - b.matrixData[i][j]);
        }
        matrixData.push(row);
    }
    return new Matrix(a.rows, a.cols, matrixData);
}

// ElementWise Multiply
export const elementWiseMultiply = (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) throw new Error(`Matrix Arithmetic Error: Attempt to element wise multiply a ${a.rows}x${a.cols} and ${b.rows}x${b.cols} matrix`);
    const matrixData: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
        const row = [];
        for (let j = 0; j < a.cols; j++) {
            row.push(a.matrixData[i][j] * b.matrixData[i][j]);
        }
        matrixData.push(row);
    }
    return new Matrix(a.rows, a.cols, matrixData);
}

// Matrix Multiply
export const matrixMultiply = (a: Matrix, b: Matrix): Matrix => {
    if (a.cols !== b.rows) throw new Error(`Matrix Arithmetic Error: Attempt to matrix multiply a ${a.rows}x${a.cols} and ${b.rows}x${b.cols} matrix`);
    const matrixData: number[][] = [];
    for (let i = 0; i < a.rows; i++){
        const row = [];
        for (let j = 0; j < b.cols; j++){
            let value = 0;
            for (let k = 0; k < a.cols; k++){
                value += a.matrixData[i][k] * b.matrixData[k][j];
            }
            row.push(value);
        }
        matrixData.push(row);
    }
    return createMatrix(matrixData)
}


// ElemntWise Divide
export const elementWiseDivide = (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) throw new Error(`Matrix Arithmetic Error: Attempt to element wise divide a ${a.rows}x${a.cols} and ${b.rows}x${b.cols} matrix`);
    const matrixData: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
        const row = [];
        for (let j = 0; j < a.cols; j++) {
            row.push(a.matrixData[i][j] / b.matrixData[i][j]);
        }
        matrixData.push(row);
    }

    return new Matrix(a.rows, a.cols, matrixData);
}


