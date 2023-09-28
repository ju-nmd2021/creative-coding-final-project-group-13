let canvasWidth = innerWidth;
let canvasHeight = innerHeight;

let video;
let handpose;
let predictions = [];

let XOfIndex;
let XOfThumb;
let YOfIndex;
let YOfThumb;

let oscillator;

window.addEventListener("load", () => {
    oscillator = new Tone.Oscillator(440, "sawtooth").toDestination();
})


function setup() {
    bgColor = color(255, 255, 255);
    bgColor.setAlpha(60);
    createCanvas(innerWidth, innerHeight);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    options = {
        detectionConfidence: 0.05,
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

        gesture_Pinch()

        XOfIndex = hand.annotations.indexFinger[3][0];
        YOfIndex = hand.annotations.indexFinger[3][1];
        XOfThumb = hand.annotations.thumb[3][0];
        YOfThumb = hand.annotations.thumb[3][1];

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

function gesture_Pinch() {
    if (XOfIndex - XOfThumb < 50 && YOfThumb - YOfIndex < 50) {
        fill(0, 0, 255);
        noStroke();
        ellipse(XOfIndex, YOfIndex, 10, 10);

        oscillator.frequency.value = YOfIndex;
        oscillator.volume.value = XOfIndex * 0.5;
    }
}

function modelLoaded() {
    console.log("Model Loaded!");
}

window.addEventListener("click", () => {
    Tone.start();
    oscillator.start();
});