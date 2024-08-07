/*----- constants -----*/
const BOARD_ROWS = 2;
const BOARD_COLS = 2;


/*----- state variables -----*/
let winner;
let looser;
let board;
let cellEls;


/*----- cached elements  -----*/
const container = document.getElementById('board');
const shrimpButtonEl = document.getElementById('live_shrimp');
const deadShrimpBtmEl = document.getElementById('fried_shrimp');
const winMessage = document.getElementById('winner');
const message = document.getElementById('message')

/*----- event listeners -----*/
shrimpButtonEl.addEventListener('click', () => {
    init();
});
// these need to also reset the board state
deadShrimpBtmEl.addEventListener('click', () => {
    init();
});
container.addEventListener('contextmenu', handleToggleFlag);
container.addEventListener('click', handleReveal);



/*----- functions -----*/
init();

function init() {
    board = [];
    generateCellsInBoard();
    cellEls = document.querySelectorAll('.cell');
    setNets();
    computeAdjacentNetCounts()
    winner = null;
    console.log(board)
    render();
}

function render() {

    //render cells
    cellEls.forEach((cellEl) => {
        const cell = getCellObj(cellEl);
        if (cell.isRevealed) {
            if (cell.isNet) {
                cellEl.innerText = '🕸️';
            } else {
                cellEl.innerText = cell.adjNetCount
            }
        } else if (cell.isFlagged) {
            cellEl.innerText = '🛟';
        } else {
            cellEl.innerText = '';
        }
        // console.log(cellEl.id, rowIdx, colIdx);
    });
}

// function reveal(cell) {
    // 1. Set cell.isRevealed to true
    // 2. Set cell.isFlagged to false
    // 3. If the cell has zero adjacent mines (cell.adjMineCount is 0)
    // 3.1. For each neighboring cell object of cell
    // 3.1.1. If the neighbor is not revealed AND the
    //        neighbor is not a mine, reveal the
    //        neighbor recursively - reveal(neighbor)
    // Note that there's no reason to call render because that's
    // going to be called in handleCellClick
    //   }
    
function getWinner(cell) {
    // for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        //     for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            //         const cell = board[rowIdx][colIdx];
            console.log(cell)
            // if all cells minus - netted cells are revealed you win
            if (cell.isRevealed && !cell.isNet) {
                console.log('you win')
            } else {
                return null 
            }
        }
//  }
//}
    
function gameOver(cell) {
    if (cell.isNet) {
        message.innerText = 'Oh no your shrimp has been caught!'
        container.removeEventListener('click', handleReveal);
        container.addEventListener('contextmenu', handleToggleFlag);
    } else {

    }
}

function getCellObj(cellEl) {
    const seperatorIdx = cellEl.id.indexOf('-');
    const rowIdx = parseInt(cellEl.id.slice(0, seperatorIdx));
    const colIdx = parseInt(cellEl.id.slice(seperatorIdx + 1));
    return board[rowIdx][colIdx];
}

function handleToggleFlag(evt) {
    if (!evt.target.matches('.cell')) return;
    evt.preventDefault();
    const cell = getCellObj(evt.target);
    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
    console.log(winner)
    render();
}

function handleReveal(evt) {
    if (!evt.target.matches('.cell')) return;
    const cell = getCellObj(evt.target);
    if (cell.isRevealed) return;
    cell.isRevealed = true;
    console.log(winner)
    looser = gameOver(cell);
    render();
}


function generateCellsInBoard() {
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        board[rowIdx] = [];
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            board[rowIdx].push({
                isRevealed: false,
                isFlagged: false,
                isNet: false,
                adjNetCount: 0, 
                rowIdx,
                colIdx
            });
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `${rowIdx}-${colIdx}`;
            container.appendChild(cell);
        }
    }  
}

function setNets() {
    const NET_PCT = .15;
    let netsToPlace = Math.round(BOARD_ROWS * BOARD_COLS * NET_PCT);
    while (netsToPlace > 0) {
        let rndRowIdx = Math.floor(Math.random() * BOARD_ROWS);
        let rndColIdx = Math.floor(Math.random() * BOARD_COLS);
        if (!board[rndRowIdx][rndColIdx].isNet) {
            board[rndRowIdx][rndColIdx].isNet = true;
            netsToPlace--;
        } 
    }
}


function computeAdjacentNetCounts() {
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            let counter = 0;
            for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                for (let colOffset = -1; colOffset <= 1; colOffset++) {
                    const row = rowIdx + rowOffset;
                    const col = colIdx + colOffset;
                    if (board[row] && board[row][col]) {
                        if (board[row][col].isNet) counter++;
                    }
                }
            }
            board[rowIdx][colIdx].adjNetCount = counter;  
        }
    }
}




// clicking a cell with a net ends the game reveal all cells then call render 
// link reset button to init 
