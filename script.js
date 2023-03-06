var board;
var startTime;
var spentTime;
var numMoves = 0;
var playerName;
var currentSpace;
var adjacentTiles = [];
var win = false;
const winState = [
    [ 1,  2,  3,  4],
    [ 5,  6,  7,  8],
    [ 9, 10, 11, 12],
    [13, 14, 15,  0]
]

const setGame = () => {
    playerName = prompt('Player\'s name:');
    if(!playerName || playerName.length == 0) {playerName = 'player'};
    startTime = Math.floor(Date.now() / 1000);
    while(true){
        board = generateBoard();
        board = toMatrix();
        if(isSolvable(board)){
            break;
        }
    }
    displayBoard();
    displayInfo();
}

const generateBoard = () => {
    let board = []
    for(let i = 1; i < 16; i++){
        board.push(i);
    }
    board.push(0);
    board = randomize(board);
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

// https://stackoverflow.com/questions/34570344/check-if-15-puzzle-is-solvable#34570524
// Code by cody-gray https://stackoverflow.com/users/366904/cody-gray
const isSolvable = (puzzle) =>
{
    let parity = 0;
    let gridWidth = 4;
    let row = 0; // the current row we are on
    let blankRow = 0; // the row with the blank tile

    for (let i = 0; i < puzzle.length; i++)
    {
        if (i % gridWidth == 0) { // advance to next row
            row++;
        }
        if (puzzle[i] == 0) { // the blank tile
            blankRow = row; // save the row on which encountered
            continue;
        }
        for (let j = i + 1; j < puzzle.length; j++)
        {
            if (puzzle[i] > puzzle[j] && puzzle[j] != 0)
            {
                parity++;
            }
        }
    }

    if (gridWidth % 2 == 0) { // even grid
        if (blankRow % 2 == 0) { // blank on odd row; counting from bottom
            return parity % 2 == 0;
        } else { // blank on even row; counting from bottom
            return parity % 2 != 0;
        }
    } else { // odd grid
        return parity % 2 == 0;
    }
}

const toMatrix = () => {
    let newBoard = new Array(4);
    let counter = 0;
    for(let i=0; i<4; i++){
        newBoard[i] = new Array(4);
        for(let j=0; j<4; j++){
            newBoard[i][j] = board[counter];
            counter++;
        }
    }
    return newBoard;
}

const displayBoard = () => {
    let counter = 0;
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            let tileID = `t${board[i][j]}`;
            document.getElementById(tileID).style.order = counter;
            if(tileID == 't0'){
                currentSpace = [i,j];
            }
            counter++;
        }
    }
    getAdjacentTiles();
    styleAdjacentTiles();
}

const checkWinState = () => {
    for(let row = 0; row < 4; row++) {
        for(let col = 0; col < 4; col++) {
            if(board[row][col] != winState[row][col]) {
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
    if(currentSpace[0] + 1 <= 3) {
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
    if(currentSpace[1] + 1 <= 3) {
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
    for(let row = 0; row<4; row++){
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