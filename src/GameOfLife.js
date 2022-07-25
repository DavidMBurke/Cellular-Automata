let cols = 400;
let rows = 250;
let canvasNow = makeGrid(cols, rows);
let canvasNext = makeGrid(cols, rows);

function makeGrid(cols,rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function randomizeGrid(arr, cols, rows) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            arr[i][j] = Math.floor(Math.random()*2);
        }
    }
}