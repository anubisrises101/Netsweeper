/*----- constants -----*/
const BOARD_ROWS = 2;
const BOARD_COLS = 2;

/*----- state variables -----*/
let numNets;
let winner;
let looser;
let board;
let cellEls;


/*----- cached elements  -----*/
const container = document.getElementById('board');
const shrimpButtonEl = document.getElementById('live_shrimp');
const deadShrimpBtmEl = document.getElementById('fried_shrimp');
const winMessage = document.getElementById('winner');
const message = document.getElementById('message');
const splashAudio = document.getElementById('splashing');
const winnerAudio = document.getElementById('winner')
const netAudio = document.getElementById('net')

/*----- event listeners -----*/
shrimpButtonEl.addEventListener('click', () => {
    init();
});

deadShrimpBtmEl.addEventListener('click', () => {
    init();
});

container.addEventListener('contextmenu', handleToggleFlag);
container.addEventListener('click', handleReveal);



/*----- functions -----*/
init();

function init() {
    container.addEventListener('contextmenu', handleToggleFlag);
    container.addEventListener('click', handleReveal);
    message.innerText = 'Welcome to NetSweeper!';
    removeCellsInBoard();
    board = [];
    cellEls = null;
    winner = null;
    looser = null;
    generateCellsInBoard();
    cellEls = document.querySelectorAll('.cell');
    setNets();
    computeAdjacentNetCounts();
    render();
};

function render() {
    cellEls.forEach((cellEl) => {
        const cell = getCellObj(cellEl);
        if (cell.isRevealed) {
            cellEl.classList.add('revealed')
            if (cell.isNet) {
                cellEl.innerText = '🕸️';
            } else if (cell.adjNetCount > 0) {
                cellEl.innerText = cell.adjNetCount
            };
        } else if (cell.isFlagged) {
            cellEl.innerText = '🛟';
        } else {
            cellEl.innerText = '';
        };
    });
};

// function getWinner() {
//     let unrevealed = BOARD_ROWS * BOARD_COLS
//     for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
//         console.log('rowIdx', rowIdx)
//         for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
//             console.log('colIdx', colIdx)
//             console.log(board[rowIdx][colIdx].isRevealed)
//             board[rowIdx][colIdx].isRevealed ? unrevealed-- : null;
//             console.log(unrevealed, numNets)
//             if (!board[rowIdx][colIdx].isRevealed && board[rowIdx][colIdx].isNet && unrevealed === numNets) return true;
//             // if (!board[rowIdx][colIdx].isRevealed) return null;
//         };
//     };
//     return true;
// };

function getWinner() {
    let counter = 0;
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            if (!board[rowIdx][colIdx].isRevealed && !board[rowIdx][colIdx].isNet) {
                counter++
            };
        };
    };    
    if (counter === 0) {
        container.removeEventListener('click', handleReveal);
        container.removeEventListener('contextmenu', handleToggleFlag);
        message.innerText = 'Congratulations you won!';
        playWinner();
        return true
    };
    return false
};  

function gameOver(cell) {
    if (cell.isNet) {
        message.innerText = 'Oh no your shrimp has been caught!'
        // shrimpButtonEl.style.display = hidden;
        // deadShrimpBtmEl.style.display = none;
        container.removeEventListener('click', handleReveal);
        container.removeEventListener('contextmenu', handleToggleFlag);
    };
};

function getCellObj(cellEl) {
    const seperatorIdx = cellEl.id.indexOf('-');
    const rowIdx = parseInt(cellEl.id.slice(0, seperatorIdx));
    const colIdx = parseInt(cellEl.id.slice(seperatorIdx + 1));
    return board[rowIdx][colIdx];
};

function handleToggleFlag(evt) {
    if (!evt.target.matches('.cell')) return;
    evt.preventDefault();
    const cell = getCellObj(evt.target);
    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
    render();
};

// function playSplash() {
//     splashAudio.play();
// };

function playWinner() {
    winnerAudio.play();
};

// function playNet() {
//     netAudio.play();
// };

function handleReveal(evt) {
    if (!evt.target.matches('.cell')) return;
    const cell = getCellObj(evt.target);
    if (cell.isRevealed) return;
    if (cell.isNet) {
        cell.isRevealed = true;
        looser = gameOver(cell);
    };
    reveal(cell.rowIdx, cell.colIdx);
    winner = getWinner();
    console.log(winner);
    // if (cell.isRevealed && !cell.isNet) {
    //     playSplash()
    // };
    // if (cell.isRevealed && cell.isNet) {
    //     playNet();
    // };
    render();
};

function removeCellsInBoard() {
    let cellsToDelete = document.querySelectorAll('.cell')
    cellsToDelete.forEach((cell) => {
        container.removeChild(cell)
    });
};


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
        };
    };
}; 

function setNets() {
    const NET_PCT = .20;
    let netsToPlace = Math.round(BOARD_ROWS * BOARD_COLS * NET_PCT);
    numNets = netsToPlace;
    while (netsToPlace > 0) {
        let rndRowIdx = Math.floor(Math.random() * BOARD_ROWS);
        let rndColIdx = Math.floor(Math.random() * BOARD_COLS);
        if (!board[rndRowIdx][rndColIdx].isNet) {
            board[rndRowIdx][rndColIdx].isNet = true;
            netsToPlace--;
        }; 
    };
};


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
                    };
                };
            };
            board[rowIdx][colIdx].adjNetCount = counter;  
        };
    };
};

function reveal(rowIdx, colIdx) {
            if (rowIdx < 0 || rowIdx >= BOARD_ROWS || colIdx < 0 || colIdx >= BOARD_COLS) {
                return
            };
            if (board[rowIdx][colIdx].isRevealed || board[rowIdx][colIdx].isNet) return;
            board[rowIdx][colIdx].isRevealed = true;
            board[rowIdx][colIdx].isFlagged = false;
            if (board[rowIdx][colIdx].adjNetCount === 0){
                reveal(rowIdx - 1, colIdx - 1);
                reveal(rowIdx - 1, colIdx);
                reveal(rowIdx - 1, colIdx + 1);
                reveal(rowIdx, colIdx - 1);
                reveal(rowIdx, colIdx + 1);
                reveal(rowIdx + 1, colIdx - 1);
                reveal(rowIdx + 1, colIdx);
                reveal(rowIdx + 1, colIdx + 1);
            };
};