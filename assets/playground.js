let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
let ballX;
let ballY;
let hDirection;
let vDirection;

let chorus;
let synth;
let reverb;

let membraneSynth;

let notes = ["A", "B", "C", "D", "E", "F", "G"];

window.addEventListener("load", () => {
    chorus = new Tone.Chorus(6, 2, 0.5).toDestination().start();
    reverb = new Tone.Reverb(8.0).connect(chorus);
    synth = new Tone.PolySynth().connect(reverb);
    synth.set({
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

});

function randomNote() {
    notes[Math.round(random(0, 6))] + "4"
}

function setup() {
    bgColor = color(255, 255, 255);
    bgColor.setAlpha(255);
    createCanvas(innerWidth, innerHeight);

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

    // stroke(0, 0, 0);
    // line(vectorArr[0].x, vectorArr[0].y, vectorArr[1].x, vectorArr[1].y);

    // for (let i = 0; i < vectorArr.length - 1; i++) {

    //     // FOR DEBUGGING 
    //     // if (i >= 2) {
    //     //     noStroke()
    //     //     text("p" + (i - 2), vectorArr[i].x + 10, vectorArr[i].y - 10)
    //     // }

    //     stroke(0, 0, 0);
    //     line(vectorArr[i].x, vectorArr[i].y, vectorArr[i + 1].x, vectorArr[i + 1].y)
    // }
    // line(vectorArr[vectorArr.length - 1].x, vectorArr[vectorArr.length - 1].y, vectorArr[0].x, vectorArr[0].y)

    noStroke();
    fill(255, 0, 0);
    ellipse(ballX, ballY, 10, 10);

    for (let i = 0; i < vectorArr.length; i++) {
        if (ballY + 5 == vectorArr[i].y) {
            if (ballX < vectorArr[i].x && ballX > vectorArr[i + 1].x) {
                vDirection = 'up';
                synth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
        else if (ballY - 5 == vectorArr[i].y) {
            if (ballX < vectorArr[i].x && ballX > vectorArr[i - 1].x) {
                vDirection = 'down';
                synth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
    }

    for (let i = 0; i < vectorArr.length; i++) {
        if (ballX - 5 == vectorArr[i].x) {
            if (vectorArr[i + 1] != undefined) {
                if (ballY < vectorArr[i].y && ballY > vectorArr[i + 1].y) {
                    hDirection = 'right';
                    synth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
                }
            }
            else {
                hDirection = 'right'
                synth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
            }
        }
        if (ballX + 5 == vectorArr[i].x) {
            if (ballY < vectorArr[i].y && ballY > vectorArr[i - 1].y) {
                hDirection = 'left';
                synth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
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
}

setInterval(() => {
    console.log("test");
    // synth.triggerAttackRelease([notes[Math.round(random(0, 6))] + "4", notes[Math.round(random(0, 6))] + "3"], "4n");
    membraneSynth.triggerAttackRelease("C2", "8n");
}, 1000);

window.addEventListener("click", () => {
    Tone.start();
});