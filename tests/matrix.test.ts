import { Matrix, createUniformMatrix, matrixAdd, matrixSubtract, createMatrix, elementWiseMultiply, elementWiseDivide, matrixMultiply, generateMatrix } from "../server/matrix";



test('Creating a null matrix with createUniformMatrix', () => {
    const a = new Matrix(3, 3, [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    const b = createUniformMatrix(3, 3);
    expect(b).toStrictEqual(a);
});

test('Creating a filled matrix with createUniformMatrix', () => {
    const a = new Matrix(3, 3, [[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
    const b = createUniformMatrix(3, 3, 1);
    expect(b).toStrictEqual(a);
});

test('Creating a copy of a matrix', () => {
    const testMatrixA = createUniformMatrix(3, 3, 1);
    const a = testMatrixA.copy();
    expect(a).toStrictEqual(testMatrixA);
    expect(a).not.toBe(testMatrixA);
});

test('Element wise apply a function to a matrix', () => {
    const a = createMatrix([[1, 2], [3, 4]]);
    a.apply(x => x * x);
    const b = createMatrix([[1 * 1, 2 * 2], [3 * 3, 4 * 4]])
    expect(a).toStrictEqual(b);
});

test('Matrix inverse', () => {
    const a = createMatrix([[1, 2], [3, 4], [5, 6]]);
    const b = createMatrix([[1, 3, 5], [2, 4, 6]]);
    expect(a.transpose()).toStrictEqual(b);
})

test('Matrix Addition', () => {
    const a = createMatrix([[1, 2], [3, 4]]);
    const b = createMatrix([[4, 5], [6, 7]]);
    const c = createMatrix([[5, 7], [9, 11]]);
    expect(matrixAdd(a, b)).toStrictEqual(c);
});

test('Matrix Subtraction', () => {
    const a = createMatrix([[1, 2], [3, 4]]);
    const b = createMatrix([[1, 1], [1, 1]]);
    const c = createMatrix([[0, 1], [2, 3]]);
    expect(matrixSubtract(a, b)).toStrictEqual(c);
});

test('element wise multiplication', () => {
    const a = createMatrix([[1, 2], [3, 4]]);
    const b = createMatrix([[2, 2], [2, 2]]);
    const c = createMatrix([[2, 4], [6, 8]]);
    expect(elementWiseMultiply(a, b)).toStrictEqual(c);
});

test('element wise division', () => {
    const a = createMatrix([[2, 4], [6, 8]]);
    const b = createMatrix([[2, 2], [2, 2]]);
    const c = createMatrix([[1, 2], [3, 4]]);
    expect(elementWiseDivide(a, b)).toStrictEqual(c);
});

test('Matrix Dimension Checking', () => {
    const a = createUniformMatrix(3, 3);
    const b = createUniformMatrix(2, 2);
    expect(() => matrixAdd(a, b)).toThrow();
    expect(() => matrixSubtract(a, b)).toThrow();
    expect(() => elementWiseMultiply(a, b)).toThrow();
    expect(() => elementWiseDivide(a, b)).toThrow();
    expect(() => matrixMultiply(a, b)).toThrow();

})

test('Matrix Multiplication', () => {
    const a = createMatrix([[1, 2], [3, 4], [5, 6]]);
    const b = createMatrix([[1, 2, 3], [4, 5, 6]]);
    const c = createMatrix([[9, 12, 15], [19, 26, 33], [29, 40, 51]]);
    expect(matrixMultiply(a, b)).toStrictEqual(c);

});

test('Matrix Generation Test', () => {
    const a = createMatrix([[1, 1 * 2], [2 * 1, 2 * 2]]);
    expect(generateMatrix(2, 2, (i, j) => (i + 1) * (j + 1))).toStrictEqual(a);
})
