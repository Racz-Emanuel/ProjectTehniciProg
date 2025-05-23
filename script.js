let borderWidth = 0;
let borderHeight = 0;
let boxes = []; 
let playerX = 0;
let playerY = 0;
let gridOffsetX = 0;
let gridOffsetY = 0;

let players =[
    {x:0, y:0, symbol: "X", color: "yellow"},
    {x:4, y:4, symbol:"O", color:"blue"}
];
let currentPlayerIndex = 0;


let currentPlayer = "X";
let selectMode = false; 

let options = ["X", "O", "", ""]; 

function setup() {
    createCanvas(windowWidth, windowHeight);
    borderWidth = windowWidth;
    borderHeight = windowHeight;
    initBoxes(5, 5); 
    myInput = createInput(); 
}

function draw() {
    background("gray");
    drawColorfulBoxes();
    
    let inputText = myInput.value(); 
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0);
    text(inputText, 500, 500);  
}

function drawColorfulBoxes() {
    for (let row = 0; row < boxes.length; row++) {
        for (let col = 0; col < boxes[row].length; col++) {
            let box = boxes[row][col];
            
            let  isPlayerHere =false;

            for(let i = 0; i< player.lenght; i++){
            if (player[i].x == col&& player[i].y ==row) {
                fill(players[i].color);
                isPlayerHere =true;
                break;
            }
        }

            if(!isPlayerHere){
                fill(181, 110, 60);
            }

            rect(box.x, box.y, box.l, box.l);
            
            fill(0);
            textSize(50);
            textAlign(CENTER, CENTER);
            text(box.text, box.x + box.l / 2, box.y + box.l / 2);
        }
    }
}

function initBoxes(colNumber, rowNumber) {
     let boxSize = 80;
    let spacing = 10;
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
        movePiece(currentPlaerIndex);
    }
}

function movePiece(direction) {
    if (direction === "up" && playerY === boxes.length-1) {
        for (let y = playerY; y > 0; y--) {
            boxes[y][playerX].text = boxes[y-1][playerX].text;
        }
        boxes[0][playerX].text = currentPlayer;
    } else if (direction === "down" && playerY === 0) {
        for (let y = playerY; y < boxes.length-1; y++) {
            boxes[y][playerX].text = boxes[y+1][playerX].text;
        }
        boxes[boxes.length-1][playerX].text = currentPlayer;
    } else if (direction === "left" && playerX === boxes[0].length-1) {
        for (let x = playerX; x > 0; x--) {
            boxes[playerY][x].text = boxes[playerY][x-1].text;
        }
        boxes[playerY][0].text = currentPlayer;
    } else if (direction === "right" && playerX === 0) {
        for (let x = playerX; x < boxes[0].length-1; x++) {
            boxes[playerY][x].text = boxes[playerY][x+1].text;
        }
        boxes[playerY][boxes[0].length-1].text = currentPlayer;
    } else {
        selectMode = false;
        return;
    }

    selectMode = false; 

    if (checkWin(currentPlayer)) {
        alert(currentPlayer + " a câștigat!");
        initBoxes(5, 5);
        currentPlayer = "X";
        playerX = 0;
        playerY = 0;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

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
