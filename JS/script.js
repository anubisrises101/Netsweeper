  /*----- constants -----*/


  /*----- state variables -----*/
let winner;
let looser;
let cellIsNet;
let cellIsFlagged;
let gameboard;
let netCount;


/*----- cached elements  -----*/
const container = document.getElementById('board')

/*----- event listeners -----*/
+

/*----- functions -----*/
init();

function init() {
    renderBoard();
    render();
};
function render() {
    
};
function renderBoard () {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i + 1;
        container.appendChild(cell)
    };
    
};
