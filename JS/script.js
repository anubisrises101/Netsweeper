  /*----- constants -----*/
  const BOARD_ROWS = 10;
  const BOARD_COLS = 10;
  let nets = [];

  /*----- state variables -----*/
  let winner;
  let looser;
  // let cellIsNet;
  let cellIsFlagged;
  let board;
  let netCount = 0;


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

function cellIsNet() {
    while (netCount <= 9) {
        const randomNet = Math.floor(Math.random() * 100) + 1;
        nets.push(randomNet);
        netCount += 1;
        
    };
};
// if the index inside the nets array is true, we want to assign in the board array isNet true ?  true ? true : false\
// if () 
function init() {
    cellIsNet()
    board = [];
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        board[rowIdx] = [];
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            board[rowIdx].push({
                isRevealed: false,
                isFlagged: false,
                isNet: false,// Randomly plant later
                adjNetCount: null, // Compute after mines are determined
                rowIdx,  // shorthand property syntax
                colIdx
            });
            const cell = document.createElement('div');
            cell.className = 'cell';
            container.appendChild(cell);
            cell.addEventListener('click', () => {
                cell.style.borderStyle = 'none'
            });
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                cell.innerText = '🛟'
            });
        }
    };  
    nets.forEach(() => {

    });
    console.log(board)
    render();
};
function render() {
    
};

const cells = document.querySelectorAll('.cell')

// cells.forEach((cell) => {
//     cell.id 
// })
function resetBoard () {
    
};




// TODO: Randomly plant mines
// TODO: After planting mines, iterate over cells and compute adjMineCount