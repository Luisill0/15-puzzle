var board;
var startTime;
var spentTime;
var numMoves = 0;
var playerName;
var currentSpace;
var adjacentTiles = [];
var win = false;
var numTiles = 4;
let winStates = new Array(2);

const setGame = () => {
    playerName = prompt('Player\'s name:');
    if(!playerName || playerName.length == 0) {playerName = 'player'};
    startTime = Math.floor(Date.now() / 1000);
    generateWinStates(numTiles);
    while(true){
        board = generateBoard(numTiles);
        board = randomize(board);
        const numInv = getInvCount(board);
        board = toMatrix(board);
        const solvable = isSolvable(board, numInv)
        if(solvable){
            break;
        }
    }
    generateDocBoard();
    displayBoard();
    displayInfo();
}

const generateWinStates = (numTiles) => {
    winStates[0] = toMatrix(generateBoard(numTiles));

    let winState2 = toMatrix(generateBoard(numTiles, -1));

    let [currentRow, currentCol] = [0,0];
    
    const directions = ['right', 'down', 'left', 'up'];
    let currDirection = 0;
    
    let [rightCount, downCount, leftCount, upCount] = [0,0,0,0];
    let tileValue = 1;
    let [row, col] = [currentRow, currentCol];
    while(tileValue <= Math.pow(numTiles,2)){
        switch(directions[currDirection]) {
            case 'right':
                col = upCount;
                while(col < numTiles - downCount){
                    winState2[currentRow][col] = tileValue;
                    tileValue++;
                    col++;
                }
                currentCol = col-1;
                rightCount++;
                break;
            case 'down':
                row = rightCount;
                while(row < numTiles - leftCount){
                    winState2[row][currentCol] = tileValue;
                    tileValue++;
                    row++
                }
                currentRow = row-1;
                downCount++;
                break;
            case 'left':
                col = numTiles - downCount - 1;
                while(col >= 0 + upCount){
                    winState2[currentRow][col] = tileValue;
                    tileValue++;
                    col--;
                }
                currentCol = col+1;
                leftCount++;
                break;
            case 'up':
                row = numTiles - leftCount - 1;
                while(row >=0 + rightCount){
                    winState2[row][currentCol] = tileValue;
                    tileValue++;
                    row--
                }
                currentRow = row+1;
                upCount++;
                break;
        }

        currDirection = currDirection == 3 ? 0: currDirection + 1;
    }

    winState2[currentRow][currentCol] = 0;

    winStates[1] = winState2;
}

const generateBoard = (numTiles, defValue) => {
    let board = []
    for(let i = 1; i < Math.pow(numTiles,2); i++){
        board.push(defValue ?? i);
    }
    board.push(defValue ?? 0);
    return board;
}

// https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
const randomize = (values) => {
    let index = values.length, randomIndex;
  
    // While there remain elements to shuffle.
    while (index != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * index);
      index--;
      // And swap it with the current element.
      [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
    }
  
    return values;
}

const toMatrix = (board) => {
    const width = Math.sqrt(board.length);
    let newBoard = new Array(width);
    let counter = 0;
    for(let i=0; i<width; i++){
        newBoard[i] = new Array(width);
        for(let j=0; j<width; j++){
            newBoard[i][j] = board[counter];
            counter++;
        }
    }
    return newBoard;
}

const generateDocBoard = () => {
    let docBoard = document.getElementById('board');
    docBoard.style.gridTemplateColumns = `repeat(${numTiles}, auto)`;
    for(let row=0; row < numTiles; row++){
        for(let col=0; col < numTiles; col++){
            let tileValue = board[row][col];
            
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `t${tileValue}`;
            if(tileValue !=0){
                tile.innerText = tileValue;
                tile.setAttribute('onclick', `tileClicked(${tileValue})`);
            }

            docBoard.appendChild(tile);
        }
    }
};

const displayBoard = () => {
    let counter = 0;
    for(let i=0; i<numTiles; i++){
        for(let j=0; j<numTiles; j++){
            let tileID = `t${board[i][j]}`;
            let tiledoc = document.getElementById(tileID);
            tiledoc.style.order = counter;
            if(tileID == 't0'){
                currentSpace = [i,j];
                tiledoc.classList.add('empty');
            }
            counter++;
        }
    }
    getAdjacentTiles();
    styleAdjacentTiles();
}

const checkWinState = () => {
    for(let row = 0; row < numTiles; row++) {
        for(let col = 0; col < numTiles; col++) {
            if(board[row][col] != winStates[0][row][col] && board[row][col] != winStates[1][row][col]) {
                return false;
            }
        }
    }
    win = true;
    return win;
}

const displayInfo = () => {
    displayTime();
    document.getElementById('playerName').innerText = `Name: ${playerName}`;
    displayMoves();
}

const displayMoves = () => {
    document.getElementById('moves').innerText = `Moves: ${numMoves}`;
}

const displayTime = () => {
    if(!win){
        let now = Math.floor(Date.now() / 1000);
        spentTime = now - startTime;
        document.getElementById('time').innerText = formatTime(spentTime);
        var t = setTimeout(function(){ displayTime() }, 1000);
    }
}

const formatTime = (timeSpent) => {
    let minutes = Math.floor(timeSpent/60);
    let seconds = timeSpent%60;

    minutes = minutes < 10? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10? `0${seconds}` : `${seconds}`;

    let timeSpentFormatted = `${minutes}:${seconds}`;

    return timeSpentFormatted;
}

const getAdjacentTiles = () => {
    // Upper
    if(currentSpace[0] - 1 >= 0) {
        let row = currentSpace[0] - 1;
        let col = currentSpace[1];
        adjacentTiles.push(board[row][col]);
    }

    // Lower
    if(currentSpace[0] + 1 <= numTiles-1) {
        let row = currentSpace[0] + 1;
        let col = currentSpace[1];
        adjacentTiles.push(board[row][col]);
    }

    // Left
    if(currentSpace[1] - 1 >= 0) {
        let row = currentSpace[0];
        let col = currentSpace[1] - 1;
        adjacentTiles.push(board[row][col]);
    }

    // Right
    if(currentSpace[1] + 1 <= numTiles-1) {
        let row = currentSpace[0];
        let col = currentSpace[1] + 1;
        adjacentTiles.push(board[row][col]);
    }
}

const styleAdjacentTiles = () => {
    adjacentTiles.forEach((tileID) => {
        let css = `#t${tileID}:hover {cursor: pointer}`;
        var style = document.createElement('style');
        style.setAttribute('id', 'removable');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    })
}

const tileClicked = (clickedID) => {
    if(adjacentTiles.includes(clickedID) && !win) {
        numMoves++;
        swapTiles(clickedID);
        displayMoves();
        if(checkWinState()) {
            alert(`You Win!\nMoves: ${numMoves}\nTime: ${formatTime(spentTime)}`);
        }
    }
}

const swapTiles = (clickedID) => {
    // Find the position of the clicked tile
    let position;
    for(let row = 0; row<numTiles; row++){
        let col = board[row].indexOf(clickedID);
        if(col != -1){
            position = [row, col];
            break;
        }
    }
    board[currentSpace[0]][currentSpace[1]] = board[position[0]][position[1]];
    board[position[0]][position[1]] = 0;
    currentSpace = position;
    clearAdjacent();
    displayBoard();
}

const clearAdjacent = () => {
    adjacentTiles = [];
    while(document.getElementById('removable')){
        document.getElementById('removable').remove();
    }
}