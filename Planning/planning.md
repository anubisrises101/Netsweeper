# Netsweeper Pseudocode

A unique take on the classic minesweeper game.
// 1) Define the required variables used to track the state of the game. // elaborate on the variables
    // winner, looser, /score/, cellismine, cellisflagged, gameboard, minecount??, /timer/,
// 2) Store cached element references.
nested for loop to create a grid?
class of rows, every div is a row
// 3) initialize the game state and render the board
// 3_set up event listeners for each cell
// set up click listener to assign flags on a right click/ update the state of the board
//  place mines at random locations on the board
// 4) upon first click initialize the timer and "net" count
// 5) assign logic for when a cell is clicked it scans the nearby squares, recursive?
// 6) if no 'nets' in nearby squares initiate a flood
// 7) if nearby nets assign a number on nearby cells giving a hint to how many are in range
// 8) assign gameover logic for when clicking a net
// assign game win logic when all nets are flagged
// set up a winner text
// set up button for resetting the game board when clicked