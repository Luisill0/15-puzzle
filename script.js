var board;
var startTime;
var spentTime;
var numMoves = 0;
var playerName;
var currentSpace;
var adjacentTiles = [];
var win = false;
const winState = [
    [ 't1',  't2',  't3',  't4'],
    [ 't5',  't6',  't7',  't8'],
    [ 't9', 't10', 't11', 't12'],
    ['t13', 't14', 't15', 't0']
]

const setGame = () => {
    playerName = prompt('Player\'s name:');
    if(!playerName || playerName.length == 0) {playerName = 'player'};
    startTime = Math.floor(Date.now() / 1000);
    board = generateBoard();
    board = toMatrix();
    while(!isSolvable(board)){
        board = generateBoard();
        board = toMatrix();
    }
    setBoardIDs();
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

// https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
// JavaScript program to check if a given instance of N*N-1
// puzzle is solvable or not
const N = 4;

// A utility function to count inversions in given
// array 'arr[]'. Note that this function can be
// optimized to work in O(n Log n) time. The idea
// here is to keep code small and simple.
const getInvCount = (arr) => {
    let inv_count = 0;
    for (let i = 0; i < N * N - 1; i++)
    {
        for (let j = i + 1; j < N * N; j++)
        {
    
        // count pairs(arr[i], arr[j]) such that
        // i < j but arr[i] > arr[j]
        if (arr[j] && arr[i] && arr[i] > arr[j]){
            inv_count++;
        }
        }
    }
    return inv_count;
}

// find Position of blank from bottom
const findXPosition = (puzzle) => {
  // start from bottom-right corner of matrix
  for (let i = N - 1; i >= 0; i--)
    for (let j = N - 1; j >= 0; j--)
        if (puzzle[i][j] == 0)
            return N - i;
}

// This function returns true if given
// instance of N*N - 1 puzzle is solvable
const isSolvable = (puzzle) => {
    // Count inversions in given puzzle
    let invCount = getInvCount(puzzle);
    // If grid is odd, return true if inversion
    // count is even.
    if (N & 1)
        return !(invCount & 1);
    else {// grid is even
        let pos = findXPosition(puzzle);    
        if (pos & 1) {
            return !(invCount & 1);
        }
        else {
            return invCount & 1;
        }
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

const setBoardIDs = () => {
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            board[i][j] = `t${board[i][j]}`
        }
    }
}

const displayBoard = () => {
    let counter = 0;
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            let tileID = `${board[i][j]}`;
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
        adjacentTiles.push(`${board[row][col]}`);
    }

    // Lower
    if(currentSpace[0] + 1 <= 3) {
        let row = currentSpace[0] + 1;
        let col = currentSpace[1];
        adjacentTiles.push(`${board[row][col]}`);
    }

    // Left
    if(currentSpace[1] - 1 >= 0) {
        let row = currentSpace[0];
        let col = currentSpace[1] - 1;
        adjacentTiles.push(`${board[row][col]}`);
    }

    // Right
    if(currentSpace[1] + 1 <= 3) {
        let row = currentSpace[0];
        let col = currentSpace[1] + 1;
        adjacentTiles.push(`${board[row][col]}`);
    }
}

const styleAdjacentTiles = () => {
    adjacentTiles.forEach((tileID) => {
        let css = `#${tileID}:hover {cursor: pointer}`;
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
    board[position[0]][position[1]] = 't0';
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