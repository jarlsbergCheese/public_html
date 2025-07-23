let test = "what";

const BOARDS = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

function makeCellList(length) {
    let cells = Array.from(document.getElementById("cell-holder").children)
    let cell_board = [];
    for (let i = 0; i < length; i++) {

        cell_board.push(cells.slice(i * length, i * length + length))

    }
    return cell_board
}

const CELLS = makeCellList(5);
console.log(CELLS);

function setupGame(board, length) {

    for (let x = 0; x < length; x++) {
        for (let y = 0; y< length; y++) {
            CELLS[y][x].innerHTML = board[y][x];
        }
    }

}

setupGame(BOARDS[0].cells, 5);
document.getElementById("words").innerHTML = "Words to spell: " + BOARDS[0].words.join(", "); 

let selected_x = -1;
let selected_y = -1;

function select(x,y){
 let cell = CELLS[y][x];
 if (cell.innerHTML.length > 0){
   
    if(selected_x>=0 && selected_y>=0){
        CELLS[selected_y][selected_x].classList.remove("selected");
    }
    selected_x = x;
    selected_y = y;
    cell.classList.add("selected")
 }
}

function unselect(x,y){
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;  
}

function move(x,y){
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = "";
    select(x,y);
}

function can_move(x,y){

    let isNextTo = Math.abs(selected_x - x) + Math.abs(selected_y - y) == 1;
    return CELLS[y][x].innerHTML.length > 0 && isNextTo && selected_x>=0 && selected_y>=0;

}

function on_click(x,y){
    if (selected_x == x && selected_y == y){
        unselect(x,y);
    }
    else if ( can_move(x,y)){
        move(x,y);
    }
    else {
        select(x,y);
    }   
}