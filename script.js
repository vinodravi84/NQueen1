let N;
let board;
let cellColors;
let solutionsDiv;
let speedSlider;
let speed = 500;
let solving = false;

function initialize() {
    if (solving) return; // Prevent re-initialization while solving
    N = parseInt(document.getElementById('sizeInput').value);
    speedSlider = document.getElementById('speedSlider');
    speed = 2000 - parseInt(speedSlider.value); // Invert the speed interpretation
    board = Array(N).fill(-1);
    cellColors = Array.from({ length: N }, () => Array(N).fill(null));
    solutionsDiv = document.getElementById('solutions');
    solutionsDiv.innerHTML = ''; // Clear previous solutions
    createBoard();
    solveQueens();
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

async function solveQueens() {
    solving = true;
    await solveQueensOnRow(0);
    solving = false;
}

async function solveQueensOnRow(row) {
    if (row === N) {
        await showSolution();
        return false;
    }

    for (let col = 0; col < N; col++) {
        board[row] = col;
        updateBoard();
        await sleep(speed);

        if (isSafe(row, col)) {
            if (await solveQueensOnRow(row + 1)) {
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
            await sleep(speed * 3);
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
            await sleep(speed);
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

async function showSolution() {
    const solutionBoard = document.createElement('div');
    solutionBoard.className = 'solution-board';
    solutionBoard.style.gridTemplateColumns = `repeat(${N}, 50px)`;
    solutionBoard.style.gridTemplateRows = `repeat(${N}, 50px)`;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (i + j) % 2 === 0 ? 'white' : 'gray');
            if (board[i] === j) {
                cell.textContent = '♛';
            }
            solutionBoard.appendChild(cell);
        }
    }

    solutionsDiv.appendChild(solutionBoard);
    await sleep(2000);
}

speedSlider.addEventListener('input', () => {
    speed = 2000 - parseInt(speedSlider.value); // Invert the speed interpretation
});

document.getElementById('sizeInput').addEventListener('change', () => {
    if (!solving) {
        initialize();
    }
});
