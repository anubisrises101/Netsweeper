/*----- constants -----*/
const BOARD_ROWS = 10;
const BOARD_COLS = 10;


/*----- state variables -----*/
let winner;
let board;
let cellEls;


/*----- cached elements  -----*/
const container = document.getElementById('board');
const shrimpButtonEl = document.getElementById('live_shrimp');
const deadShrimpBtmEl = document.getElementById('fried_shrimp');

/*----- event listeners -----*/
shrimpButtonEl.addEventListener('click', () => {
    resetBoard();
});
deadShrimpBtmEl.addEventListener('click', () => {
    resetBoard();
});
container.addEventListener('contextmenu', handleToggleFlag);



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

function getCellObj(cellEl) {
    const seperatorIdx = cellEl.id.indexOf('-');
    const rowIdx = parseInt(cellEl.id.slice(0, seperatorIdx));
    const colIdx = parseInt(cellEl.id.slice(seperatorIdx + 1));
    return board[rowIdx][colIdx];
}

function handleToggleFlag(evt) {
    evt.preventDefault();
    const cell = getCellObj(evt.target);
    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
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
    const NET_PCT = .2;
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

// iterate through cell objects in board array 
// for each cell object 
    // 1. set a counter to 0 
    // 2. create an array with this cells neighboring cell objects
    // 3. iterate through neighboring cell objects 
        // 1. increase counter if this neighbor.isNet 
    // 4. assign count to cell.adjNetCount 

// if net is adj then + 1, if not return
// clicking a cell with a net ends the game reveal all cells then call render 
// link reset button to init 
