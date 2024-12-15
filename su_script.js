const grid = document.getElementById('grid');
const SIZE = 9;
let board = [];
let selectedNumber = null;



function help() {
    window.open(
        "https://sudoku.com/how-to-play/sudoku-rules-for-complete-beginners/", "_blank");
}

function createGrid() {
    grid.innerHTML = "";
    board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    for (let i = 0; i < SIZE * SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        const row = Math.floor(i / SIZE);
        const col = i % SIZE;

        cell.id = `${row}-${col}`;
        cell.onclick = () => handleCellClick(row, col, cell);

        grid.appendChild(cell);
    }
}


function handleCellClick(row, col, cell) {
    if (selectedNumber !== null) {
        board[row][col] = selectedNumber;
        cell.textContent = selectedNumber;

        
        if (!isValidInput(row, col, selectedNumber)) {
            cell.classList.add('invalid');
        } else {
            cell.classList.remove('invalid');

            
            if (isBoardComplete()) {
                showPopup(); 
                winMusic.play(); 
            }
        }
    }
}


function selectNumber(num) {
    selectedNumber = num;
    const buttons = document.querySelectorAll('.but');
    buttons.forEach(button => button.classList.remove('selected'));

    const activeButton = [...buttons].find(button => button.textContent == num);
    if (activeButton) activeButton.classList.add('selected');
}


function isValidInput(row, col, num) {
    for (let i = 0; i < SIZE; i++) {
        if ((board[row][i] === num && i !== col) || (board[i][col] === num && i !== row)) {
            return false;
        }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (
                board[startRow + i][startCol + j] === num &&
                (startRow + i !== row || startCol + j !== col)
            ) {
                return false;
            }
        }
    }
    return true;
}

function isBoardComplete() {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === 0 || !isValidInput(row, col, board[row][col])) {
                return false;
            }
        }
    }
    return true;
}


function showPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "flex"; 
    const newGameButton = document.getElementById("newGame");
    newGameButton.onclick = () => {
        popup.style.display = "none"; 
        generatePuzzle(); 
    };
}


function solve(board) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= SIZE; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;

                        if (solve(board)) return true;

                        board[row][col] = 0; 
                    }
                }
                return false;
            }
        }
    }
    return true;
}


function isValid(board, row, col, num) {
    for (let x = 0; x < SIZE; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
        if (board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) return false;
    }
    return true;
}

function solveSudoku() {
    if (solve(board)) {
        updateGrid();
    } else {
        alert("No solution exists!");
    }
}

function updateGrid() {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cell = document.getElementById(`${row}-${col}`);
            cell.textContent = board[row][col] !== 0 ? board[row][col] : "";
        }
    }
}

function generatePuzzle() {
    board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    solve(board);

    let attempts = 50;
    while (attempts > 0) {
        let row = Math.floor(Math.random() * SIZE);
        let col = Math.floor(Math.random() * SIZE);
        if (board[row][col] !== 0) {
            let backup = board[row][col];
            board[row][col] = 0;

            let copy = board.map(row => [...row]);
            if (!solve(copy)) board[row][col] = backup;
            attempts--;
        }
    }
    updateGrid();
}

createGrid();
