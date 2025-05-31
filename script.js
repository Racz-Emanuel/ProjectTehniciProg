let borderWidth = 0;
let borderHeight = 0;
let boxes = []; 
let playerX = 0;
let playerY = 0;
let gridOffsetX = 0;
let gridOffsetY = 0;
let woodenimage;

let players = [
   { x: 0, y: 0, symbol: "X", color: "#000000", score: 0 }, // galben
    { x: 4, y: 4, symbol: "O", color: "#000000", score: 0 }  // albastru
];

let currentPlayerIndex = 0;
let currentPlayer = "X";
let selectMode = false; 

let options = [""]; 

function preload() {
    woodenimage = loadImage('woodenimage.jpeg'); // asigură-te că fișierul există în folderul proiectului
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    borderWidth = windowWidth;
    borderHeight = windowHeight;
    initBoxes(5, 5); 
    myInput = createInput();
    myInput.position(20, 20);
}

function draw() {
    image(woodenimage, 0, 0, width, height);
    drawColorfulBoxes();

    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text( myInput.value(), 20, 60);

    fill(255);
    textSize(24);
    textAlign(CENTER, TOP);
    text("Rândul jucătorului: " + players[currentPlayerIndex].symbol, width / 2, 10);

    // Afișează scorul fiecărui jucător
    textSize(20);
    text("Scor X: " + players[0].score + " | Scor O: " + players[1].score, width / 2, 40);
}


function drawColorfulBoxes() {
    for (let row = 0; row < boxes.length; row++) {
        for (let col = 0; col < boxes[row].length; col++) {
            let box = boxes[row][col];

            // Verificăm dacă pe această poziție e vreun jucător
            let playerHere = players.find(p => p.x === col && p.y === row);

            // Colorăm caseta
            if (playerHere) {
                fill(playerHere.color);
            } else {
                // checkerboard pattern
                if ((row + col) % 2 === 0) {
                    fill("#ffffff");
                } else {
                    fill("#b3b3b3");
                }
            }

            stroke(80);
            strokeWeight(2);
            rect(box.x, box.y, box.l, box.l, 12);

            // Textul din casetă - dacă e jucător aici, afișăm simbolul lui, altfel textul din box
            textSize(36);
            textAlign(CENTER, CENTER);
            noStroke();

            if (playerHere) {
                fill(255); // culoare text simbol jucător
                text(playerHere.symbol, box.x + box.l / 2, box.y + box.l / 2);
            } else {
                fill(0, 100);
                text(box.text, box.x + box.l / 2 + 2, box.y + box.l / 2 + 2); // shadow
                fill(0);
                text(box.text, box.x + box.l / 2, box.y + box.l / 2);
            }
        }
    }
}

function initBoxes(colNumber, rowNumber) {
    let boxSize = 80;
    let spacing = 12;
    let totalWidth = colNumber * (boxSize + spacing) - spacing;
    let totalHeight = rowNumber * (boxSize + spacing) - spacing;
    gridOffsetX = (windowWidth - totalWidth) / 2;
    gridOffsetY = (windowHeight - totalHeight) / 2;

    boxes = [];

    for (let j = 0; j < rowNumber; j++) {
        let line = [];  
        for (let i = 0; i < colNumber; i++) {
            let textValue = options[Math.floor(Math.random() * options.length)];
            let box = {
                x: gridOffsetX + i * (boxSize + spacing),
                y: gridOffsetY + j * (boxSize + spacing),
                l: boxSize,
                text: textValue,  
                hide: false 
            };
            line.push(box);
        }
        boxes.push(line);  
    }
}

function keyPressed() {

    let p = players[currentPlayerIndex];

    let nextX = p.x;
    let nextY = p.y;

    if (currentPlayerIndex == 0) {
        if (key === 'w') nextY--;
        if (key === 's') nextY++;
        if (key === 'a') nextX--;
        if (key === 'd') nextX++;

    } else if (currentPlayerIndex == 1) {
        if (key === 'i') nextY--;
        if (key === 'k') nextY++;
        if (key === 'j') nextX--;
        if (key === 'l') nextX++;
    }

    if (
        nextX >= 0 && nextX < boxes[0].length &&
        nextY >= 0 && nextY < boxes.length &&
        (
            nextY === 0 ||
            nextY === boxes.length - 1 ||
            nextX === 0 ||
            nextX === boxes[0].length - 1
        )
    ) {
        p.x = nextX;
        p.y = nextY;
    }

    if (keyCode === ENTER) {
        movePiece(currentPlayerIndex);
    }
}

function movePiece(playerIndex) {
    let p = players[playerIndex];
    let direction = "";

    if (p.y === boxes.length - 1) direction = "up";
    else if (p.y === 0) direction = "down";
    else if (p.x === boxes[0].length - 1) direction = "left";
    else if (p.x === 0) direction = "right";
    else return;

    if (direction === "up") {
        for (let y = p.y; y > 0; y--) {
            boxes[y][p.x].text = boxes[y - 1][p.x].text;
        }
        boxes[0][p.x].text = p.symbol;
    } else if (direction === "down") {
        for (let y = p.y; y < boxes.length - 1; y++) {
            boxes[y][p.x].text = boxes[y + 1][p.x].text;
        }
        boxes[boxes.length - 1][p.x].text = p.symbol;
    } else if (direction === "left") {
        for (let x = p.x; x > 0; x--) {
            boxes[p.y][x].text = boxes[p.y][x - 1].text;
        }
        boxes[p.y][0].text = p.symbol;
    } else if (direction === "right") {
        for (let x = p.x; x < boxes[0].length - 1; x++) {
            boxes[p.y][x].text = boxes[p.y][x + 1].text;
        }
        boxes[p.y][boxes[0].length - 1].text = p.symbol;
    }

    setTimeout(()=>{
    if (checkWin(p.symbol)) {
    players[playerIndex].score++;  // ➕ crește scorul
    alert(p.symbol + " a câștigat!");
        initBoxes(5, 5);
        players[0].x = 0; players[0].y = 0;
        players[1].x = 4; players[1].y = 4;
        currentPlayerIndex = 0;
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
}, 100);

function checkWin(player) {
 
    for (let row = 0; row < boxes.length; row++) {
        let count = 0;
        for (let col = 0; col < boxes[row].length; col++) {
            if (boxes[row][col].text === player) {
                count++; 
                if (count === 5) return true;
            } else {
                count = 0;
            }
        }
    }


    for (let col = 0; col < boxes[0].length; col++) {
        let count = 0;
        for (let row = 0; row < boxes.length; row++) {
            if (boxes[row][col].text === player) {
                count++;
                if (count === 5) return true;
            } else {
                count = 0;
            }
        }
    }

    for (let row = 0; row <= boxes.length - 5; row++) {
        for (let col = 0; col <= boxes[0].length - 5; col++) {
            let count = 0;
            for (let i = 0; i < 5; i++) {
                if (boxes[row+i][col+i].text === player) {
                    count++;
                    if (count === 5) return true;
                } else {
                    break;
                }
            }
        }
    }


    for (let row = 0; row <= boxes.length - 5; row++) {
        for (let col = 4; col < boxes[0].length; col++) {
            let count = 0;
            for (let i = 0; i < 5; i++) {
                if (boxes[row+i][col-i].text === player) {
                    count++;
                    if (count === 5) return true;
                } else {
                    break;
                }
            }
        }
    }

    return false;
}

}