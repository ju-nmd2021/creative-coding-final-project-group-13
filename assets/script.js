let canvasWidth = innerWidth;
let canvasHeight = innerHeight;

let video;
let handpose;
let predictions = [];

let XOfIndex;
let XOfThumb;
let YOfIndex;
let YOfThumb;


function setup() {
    bgColor = color(255, 255, 255);
    bgColor.setAlpha(60);
    createCanvas(innerWidth, innerHeight);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    options = {
        detectionConfidence: 0.95,
        flipHorizontal: true

    }

    handpose = ml5.handpose(video, options, modelLoaded);

    handpose.on("hand", (results) => {
        predictions = results;
    });

};

function draw() {
    // image(video, 0, 0);
    background(bgColor);


    for (let hand of predictions) {
        const x1 = hand.boundingBox.topLeft[0];
        const y1 = hand.boundingBox.topLeft[1];
        const x2 = hand.boundingBox.bottomRight[0];
        const y2 = hand.boundingBox.bottomRight[1];

        XOfIndex = hand.annotations.indexFinger[3][0];
        YOfIndex = hand.annotations.indexFinger[3][1];
        XOfThumb = hand.annotations.thumb[3][0];
        YOfThumb = hand.annotations.thumb[3][1];


        // push();
        // noFill();
        // stroke(0, 255, 0);
        // rectMode(CORNERS);
        // rect(x1, y1, x2, y2);
        // pop();

        // const landmarks = hand.landmarks;
        // for (let landmark of landmarks) {
        //     push();
        //     noStroke();
        //     fill(0, 255, 0);
        //     ellipse(landmark[0], landmark[1], 10);
        //     pop();
        // }

        if (XOfIndex - XOfThumb < 50 && YOfThumb - YOfIndex < 50) {
            console.log("It Works");
            fill(0, 0, 255);
            noStroke();
            ellipse(XOfIndex, YOfIndex, 10, 10);
        }

        window.addEventListener("keyup", (e) => {
            if (e.key == 'h') {
                console.log("X Dist = " + (XOfIndex - XOfThumb) + ", Y Dist = " + (YOfThumb - YOfIndex));
            }
        })
    }

    window.addEventListener("resize", () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
    })
};

function modelLoaded() {
    console.log("Model Loaded!");
}