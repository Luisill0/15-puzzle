/**
 * Checks if an instance of magic puzzle is solvable
 * @param {number[][]} puzzle Matrix of NxN tiles
 * @param {number} numInversions Number of inversions
 * @return {boolean}
 * 
 * In general, for a given grid of width N, we can find out check if a 
 * N*N – 1 puzzle is solvable or not by following below simple rules:
 * 
 * * If N is odd, then puzzle instance is solvable if number of inversions 
 * is even in the input state.
 * 
 * * If N is even, puzzle instance is solvable if:
 * 
 *      * The blank is on an even row counting from the bottom (second-last, fourth-last, etc.) and number of inversions is odd.
 * 
 *      * The blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.) and number of inversions is even.
 * 
 * For all other cases, the puzzle instance is not solvable.
*/
const isSolvable = (puzzle, numInversions) => {
    const isEven = puzzle.length % 2 == 0;

    if(isEven) {
        const blankRowPosition = findBlankPosition(puzzle);
        const isInEvenRow = blankRowPosition % 2 == 0;
        if(isInEvenRow) {
            return numInversions % 2 == 1;
        }else {
            return numInversions % 2 == 0;
        }
    }else {
        return numInversions % 2 == 0;
    }
}

/**
 * Count number of inversions in a puzzle in 1D
 * @param {number[]} puzzle Array of N tiles
 * @return {number}
*/
const getInvCount = (puzzle) => {
    let numInversions = 0;
    for (let i = 0; i < puzzle.length - 1; i++)
    {
        for (let j = i + 1; j < puzzle.length; j++)
        {
            // count pairs(arr[i], arr[j]) such that i < j but arr[i] > arr[j]
            if (puzzle[j] && puzzle[i] && puzzle[i] > puzzle[j])
                numInversions++;
        }
    }
    return numInversions;
}

/**
 * Get position of blank tile in a puzzle
 * @param {number[][]} puzzle Matrix of NxN tiles 
 * @return {number} Row where the blank tile is located (counting from the bottom)
*/
const findBlankPosition = (puzzle) => {
    const width = puzzle.length;
    let blankRowPosition = null;
    let rowNum = 1;
    for(let row = width-1; row >= 0 && !blankRowPosition; row--){
        for(let col=width-1; col >= 0 && !blankRowPosition; col--){
            blankRowPosition = puzzle[row][col] == 0 ? rowNum : null;
        }
        rowNum++;
    }
    return blankRowPosition;
}