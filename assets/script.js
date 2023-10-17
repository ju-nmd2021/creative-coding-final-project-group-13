// GLOBAL VARIABLES

let canvasWidth = innerWidth;
let canvasHeight = innerHeight;

let notes = ["A", "B", "C", "D", "E", "F", "G", "A"];

// HANDPOSE VARIABLES
let video;
let handpose;
let predictions = [];

let XOfIndex;
let XOfThumb;
let YOfIndex;
let YOfThumb;

// SOUND VARIABLES
let oscillator;

let pinchSynth;

let membraneSynth;

let bounceSynth;
let bounceReverb;
let bounceChorus;


// BALL VARIABLES
let ballX;
let ballY;
let hDirection;
let vDirection;

window.addEventListener("load", () => {
    pinchChorus = new Tone.Chorus(4, 2, 0.5).toDestination().start();
    pinchSynth = new Tone.PolySynth().connect(pinchChorus);

    bounceChorus = new Tone.Chorus(6, 2, 0.5).toDestination().start();
    bounceReverb = new Tone.Reverb(8.0).connect(bounceChorus);
    bounceSynth = new Tone.PolySynth().connect(bounceReverb);
    bounceSynth.set({
        oscillator: {
            type: 'triangle'
        },
        attack: 0.4,
        decay: 0.6,
        sustain: 0.5,
        release: 0.8
    })

    membraneSynth = new Tone.MembraneSynth().toDestination();
    membraneSynth.volume.value = -100;
})

class Particle {
    constructor(x, y) {
        this.position = createVector(x, y);
        const a = Math.random() * Math.PI * 2;
        const v = 0.2 + Math.random();
        this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v);
        this.lifespan = 30;
    }

    update() {
        this.lifespan--;

        this.velocity.mult(0.9);
        this.position.add(this.velocity);
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        // stroke(0, 0, this.lifespan * 6);
        stroke(0, 0, 255);
        noFill();
        // fill(0, 0, 255);
        ellipse(0, 0, this.lifespan);
        pop();
    }

    isDead() {
        return this.lifespan <= 0;
    }
}


function setup() {
    bgColor = color(0, 0, 90);
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

    ballX = innerWidth / 2 + 200;
    ballY = 400;

    vDirection = "down"
    hDirection = "left"

    vectorArr = [];

    let originPoint = {
        x: 100,
        y: 100
    };

    let firstPoint = {
        x: innerWidth - 100,
        y: 100
    };

    vectorArr.push(originPoint, firstPoint);

    for (let i = 0; i < 20; i++) {
        //First 10 Points
        if (i <= 10) {
            if (i % 2 == 0) {
                let newPoint = {
                    x: vectorArr[vectorArr.length - 1].x,
                    y: round(random(vectorArr[vectorArr.length - 1].y + 50, vectorArr[vectorArr.length - 1].y + 100)),
                }

                vectorArr.push(newPoint);
            }
            else {
                let newPoint = {
                    x: round(random(vectorArr[vectorArr.length - 1].x - 200, innerWidth - 100)),
                    y: vectorArr[vectorArr.length - 1].y,
                }

                vectorArr.push(newPoint);
            }
        }

        else if (i == 11) {
            let newPoint = {
                x: innerWidth - vectorArr[vectorArr.length - 1].x,
                y: vectorArr[vectorArr.length - 1].y
            }

            vectorArr.push(newPoint);
        }

        else if (i == 19) {
            let newPoint = {
                x: 100,
                y: vectorArr[vectorArr.length - 1].y
            }

            vectorArr.push(newPoint)
        }

        // Last 10 Points
        else {
            if (i % 2 == 0) {
                let newPoint = {
                    x: vectorArr[vectorArr.length - 1].x,
                    y: round(random(vectorArr[vectorArr.length - 1].y - 50, vectorArr[vectorArr.length - 1].y - 100)),
                }

                vectorArr.push(newPoint);
            }
            else {
                let newPoint = {
                    x: round(random(vectorArr[vectorArr.length - 1].x - 50, vectorArr[vectorArr.length - 1].x + 150)),
                    y: vectorArr[vectorArr.length - 1].y,
                }

                vectorArr.push(newPoint);
            }
        }
    }

};

function draw() {
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

        for (let particle of particles) {
            particle.update();
            particle.draw();

            if (particle.isDead()) {
                particles.splice(particles.indexOf(particle), 1);
            }
        }
    }

    window.addEventListener("resize", () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
    })

    noStroke();
    stroke(125, 11, 11);
    noFill();
    ellipse(ballX, ballY, 10, 10);

    for (let i = 0; i < vectorArr.length; i++) {
        if (ballY + 5 == vectorArr[i].y) {
            if (ballX < vectorArr[i].x && ballX > vectorArr[i + 1].x) {
                vDirection = 'up';
                bounceSynth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
        else if (ballY - 5 == vectorArr[i].y) {
            if (ballX < vectorArr[i].x && ballX > vectorArr[i - 1].x) {
                vDirection = 'down';
                bounceSynth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
    }

    for (let i = 0; i < vectorArr.length; i++) {
        if (ballX - 5 == vectorArr[i].x) {
            if (vectorArr[i + 1] != undefined) {
                if (ballY < vectorArr[i].y && ballY > vectorArr[i + 1].y) {
                    hDirection = 'right';
                    bounceSynth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
                }
            }
            else {
                hDirection = 'right'
                bounceSynth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
        if (ballX + 5 == vectorArr[i].x) {
            if (ballY < vectorArr[i].y && ballY > vectorArr[i - 1].y) {
                hDirection = 'left';
                bounceSynth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
    }

    if (vDirection == "down") {
        ballY = ballY + 1;
    }
    else if (vDirection == "up") {
        ballY = ballY - 1;
    }
    if (hDirection == "left") {
        ballX = ballX - 1;
    }
    else if (hDirection == "right") {
        ballX = ballX + 1;
    }
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

function gesture_Pinch() {
    if (XOfIndex - XOfThumb < 50 && YOfThumb - YOfIndex < 50) {
        fill(0, 0, 255);
        generateParticles(XOfIndex, YOfIndex);

        pinchSynth.triggerAttackRelease(notes[Math.ceil((YOfIndex) / 100)] + "4", "4n");

        if (XOfIndex > ballX) {
            membraneSynth.volume.value = Math.round((ballX - XOfIndex) / 10 + 2);
        }

        else {
            membraneSynth.volume.value = Math.round((XOfIndex - ballX) / 10 + 2);
        }
    }
}

function modelLoaded() {
    console.log("Model Loaded!");
}

setInterval(() => {
    membraneSynth.triggerAttackRelease("C2", "8n");
}, 1000);

window.addEventListener("click", () => {
    Tone.start();
    // oscillator.start();
});