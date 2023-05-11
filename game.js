const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementsSize = canvasSize;
btnUp = document.getElementById('up');
btnLeft = document.getElementById('left');
btnRight = document.getElementById('right');
btnDown = document.getElementById('down');
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");


let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined, 
    y: undefined
}
const giftPisition = {
    x: undefined,
    y: undefined
}

let enemyPositions = [];


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

window.addEventListener('keydown', moveByKeys);

function fixNumber(n){
    return Number(n.toFixed(0));
}

function moveByKeys(event){
    if( event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();
}

function moveUp(){
    // console.log('Me quiero mover hacia arriba');

    if( (playerPosition.y - elementsSize) < elementsSize ){
        console.log('OUT');
    }else{
        playerPosition.y -= elementsSize;
        movePlayer();
        startGame();
    }
}
function moveLeft(){
    // console.log('Me quiero mover hacia izquierda');

    if( (playerPosition.x - elementsSize) < elementsSize ){
        console.log('OUT');
    }else{
        playerPosition.x -= elementsSize;
        movePlayer();
        startGame();
    } 
}

function moveRight(){
    // console.log('Me quiero mover hacia derecha');

    if( (playerPosition.x + elementsSize) > canvasSize ){
        console.log('OUT');
    }else{
        playerPosition.x += elementsSize;
        movePlayer();
        startGame();
    } 
    
}
function moveDown(){
    // console.log('Me quiero mover hacia abajo');

    if( (playerPosition.y + elementsSize) > canvasSize ){
        console.log('OUT');
    }else{
        playerPosition.y += elementsSize;
        movePlayer();
        startGame();
    } 


}

function setCanvasSize(){

    if( window.innerHeight > window.innerWidth ){
        canvasSize = window.innerWidth * 0.7;
    }else{
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize  );
    canvas.setAttribute('height', canvasSize );

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function startGame(){

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end'; 

    // console.log({canvasSize, elementsSize});
    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows  = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    // console.log({map,mapRows, mapRowCols});

    enemyPositions = [];
    game.clearRect(0,0,canvasSize, canvasSize);

    showLives();

    mapRowCols.forEach( (row, rowIndex) => {
        row.forEach( (col,colIndex) =>{
            const posX = elementsSize * (colIndex+1);
            const posY = elementsSize * (rowIndex+1);
            const emoji = emojis[col];
            // console.log(col);
            if( col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    // console.log(playerPosition);
                }
            }else if( col == 'I' ){
                giftPisition.x = posX,
                giftPisition.y = posY
                console.log(giftPisition)
            }else if( col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY
                })
            }

            game.fillText(emoji, posX, posY);
        })
    });
    // game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y); Se fue a una nueva función
    movePlayer();

    // for(let row = 1; row <= 10; row++ ){
    //     for(let col = 1; col <= 10; col++){
    //         game.fillText(emojis[mapRowCols[row-1][col-1]], elementsSize * col,elementsSize * row);
    //     }
    // }
}

function movePlayer(){

    const giftColisionX = playerPosition.x.toFixed(0) == giftPisition.x.toFixed(0);
    const giftColisionY = playerPosition.y.toFixed(0) == giftPisition.y.toFixed(0);

    const giftColision = giftColisionX && giftColisionY;

    if( giftColision ){
        // console.log('Coincidió')
        levelWin();
    }

    const enemyCollision = enemyPositions.find( enemy =>{
        const enemyCollisionX = enemy.x.toFixed(0) == playerPosition.x.toFixed(0);
        const enemyCollisionY = enemy.y.toFixed(0) == playerPosition.y.toFixed(0);
        return enemyCollisionX && enemyCollisionY;
    });
    if( enemyCollision ){
        levelFail();
    }




    game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y);
}

function levelWin(){
    console.log('Subiste de nivel');
    level++;
    startGame();
}
function gameWin(){ 
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
        if( recordTime >= playerTime){
            localStorage.setItem('record_time',playerTime);
            pResult.innerHTML = 'Superaste el record';
        } else{
            pResult.innerHTML = 'Lo siento, no superaste el record :(';
        }
    }else{
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primer record.';
    }
    
    return;
}

function levelFail(){
   
    lives--;

    if( lives <= 0 ){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
    
}

function showLives(){

    spanLives.innerHTML = "";
    
    const heartsArray = Array(lives).fill(emojis['HEART']); //[ , , ]

    heartsArray.forEach( heart =>{
        spanLives.append(heart);
    })
}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}