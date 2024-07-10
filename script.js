let N;
let board;
let cellColors;

function initialize() {
    N = parseInt(document.getElementById('sizeInput').value);
    board = Array(N).fill(-1);
    cellColors = Array.from({ length: N }, () => Array(N).fill(null));
    createBoard();
    placeQueens();
}

function createBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = ''; // Clear previous board
    boardDiv.style.gridTemplateColumns = `repeat(${N}, 100px)`;
    boardDiv.style.gridTemplateRows = `repeat(${N}, 100px)`;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (i + j) % 2 === 0 ? 'white' : 'gray');
            cellColors[i][j] = (i + j) % 2 === 0 ? 'white' : 'gray';
            cell.id = `cell-${i}-${j}`;
            boardDiv.appendChild(cell);
        }
    }
}

function updateBoard() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            cell.className = 'cell';
            cell.classList.add(cellColors[i][j]);
            if (board[i] === j) {
                cell.textContent = '♛';
            } else {
                cell.textContent = '';
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function placeQueens() {
    await placeQueensOnRow(0);
}

async function placeQueensOnRow(row) {
    if (row === N) {
        return true;
    }

    for (let col = 0; col < N; col++) {
        board[row] = col;
        updateBoard();
        await sleep(500);

        if (isSafe(row, col)) {
            if (await placeQueensOnRow(row + 1)) {
                return true;
            }
        } else {
            for (let i = 0; i < N; i++) {
                if (board[i] !== -1) {
                    const j = board[i];
                    if (j === col || Math.abs(row - i) === Math.abs(col - j)) {
                        cellColors[i][j] = 'orange';
                    }
                }
            }
            cellColors[row][col] = 'red';
            updateBoard();
            await sleep(1500);
            for (let i = 0; i < N; i++) {
                if (board[i] !== -1) {
                    const j = board[i];
                    if (j === col || Math.abs(row - i) === Math.abs(col - j)) {
                        cellColors[i][j] = 'green';
                    }
                }
            }
            cellColors[row][col] = (row + col) % 2 === 0 ? 'white' : 'gray';
            updateBoard();
            await sleep(500);
        }
        cellColors[row][col] = (row + col) % 2 === 0 ? 'white' : 'gray';
        updateBoard();
    }

    board[row] = -1;
    return false;
}

function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
        const j = board[i];
        if (j === col || Math.abs(j - col) === Math.abs(i - row)) {
            return false;
        }
    }
    return true;
}
