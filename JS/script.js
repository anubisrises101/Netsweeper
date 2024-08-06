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


/*----- functions -----*/
init();
 
function init() {
    board = [];
    generateCellsInBoard();
    cellEls = document.querySelectorAll('.cell');
    setNets();
    // computeAdjacentNetCounts()
    winner = null;
    // console.log(board)
    render();
}

function generateCellsInBoard() {
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        board[rowIdx] = [];
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            board[rowIdx].push({
                isRevealed: false,
                isFlagged: false,
                isNet: false,// Randomly plant later
                adjNetCount: 0, // Compute after mines are determined
                rowIdx,  // shorthand property syntax
                colIdx
            });
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `${rowIdx}-${colIdx}`;
            container.appendChild(cell);
            cell.addEventListener('click', () => {
                cell.style.borderStyle = 'none'
            });
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                cell.innerText = '🛟'
            });
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

function render() {
    
}

// function resetBoard () {
    
// };


// clicking a cell with a net ends the game reveal all cells then call render 
// link reset button to init 
// TODO: Randomly plant mines
// TODO: After planting mines, iterate over cells and compute adjMineCount