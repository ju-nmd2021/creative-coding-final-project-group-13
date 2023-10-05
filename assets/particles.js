let canvasWidth = innerWidth;
let canvasHeight = innerHeight;

let age;

// let video;
// let handpose;
// let predictions = [];

// let XOfIndex;
// let XOfThumb;
// let YOfIndex;
// let YOfThumb;

// let oscillator;

// window.addEventListener("load", () => {
//     oscillator = new Tone.Oscillator(440, "sawtooth").toDestination();
// })

class Particle {
    constructor(x, y) {
        this.position = createVector(x, y);
        const a = Math.random() * Math.PI * 2;
        const v = 0.2 + Math.random();
        this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v);
        this.lifespan = 100 + Math.random() * 100;
    }

    update() {
        this.lifespan--;
        this.velocity.mult(0.99);
        this.position.add(this.velocity);
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        noStroke();
        fill(0, 0, 255);
        ellipse(0, 0, 6);
        pop();
    }

    isDead() {
        return this.lifespan <= 0;
    }
}


function setup() {
    bgColor = color(255, 255, 255);
    bgColor.setAlpha(60);
    createCanvas(innerWidth, innerHeight);

    // video = createCapture(VIDEO);
    // video.size(width, height);
    // video.hide();

    // options = {
    //     detectionConfidence: 0.05,
    //     flipHorizontal: true

    // }

    // handpose = ml5.handpose(video, options, modelLoaded);

    // handpose.on("hand", (results) => {
    //     predictions = results;
    // });
    // background(255, 255, 255);

};

function draw() {
    // image(video, 0, 0);
    background(bgColor);

    // window.addEventListener("click", () => {
    //     fill(0, 0, 255);
    //     noStroke();
    //     createParticle(mouseX, mouseY, 10, 10)
    // })

    // for (let hand of predictions) {
    //     const x1 = hand.boundingBox.topLeft[0];
    //     const y1 = hand.boundingBox.topLeft[1];
    //     const x2 = hand.boundingBox.bottomRight[0];
    //     const y2 = hand.boundingBox.bottomRight[1];

    //     gesture_Pinch()

    //     XOfIndex = hand.annotations.indexFinger[3][0];
    //     YOfIndex = hand.annotations.indexFinger[3][1];
    //     XOfThumb = hand.annotations.thumb[3][0];
    //     YOfThumb = hand.annotations.thumb[3][1];

    //     window.addEventListener("keyup", (e) => {
    //         if (e.key == 'h') {
    //             console.log("X Dist = " + (XOfIndex - XOfThumb) + ", Y Dist = " + (YOfThumb - YOfIndex));
    //         }
    //     })
    // }

    window.addEventListener("resize", () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
    })
};

function generateParticles(x, y) {
    // for (let i = 0; i < 400; i++) {
    const px = x
    const py = y
    const particle = new Particle(px, py);
    particles.push(particle);
    // }
}

let particles = [];

function mouseClicked() {
    generateParticles(mouseX, mouseY);
}

// function gesture_Pinch() {
//     if (XOfIndex - XOfThumb < 50 && YOfThumb - YOfIndex < 50) {
//         fill(0, 0, 255);
//         noStroke();
//         ellipse(XOfIndex, YOfIndex, 10, 10);

//         oscillator.frequency.value = YOfIndex;
//         oscillator.volume.value = XOfIndex * 0.5;
//     }
// }

// function modelLoaded() {
//     console.log("Model Loaded!");
// }

// window.addEventListener("click", () => {
//     Tone.start();
//     oscillator.start();
// });