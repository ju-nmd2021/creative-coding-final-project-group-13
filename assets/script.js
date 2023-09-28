let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

window.addEventListener("resize", () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
})

function setup() {
    createCanvas(canvasWidth, canvasHeight)
};

function draw() {
    background(0, 0, 255);
};