// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Создание игровой доски
const boardSize = 8;
const gameBoard = document.getElementById('game-board');

// Инициализация статистики
let redTaken = 0;
let blackTaken = 0;
const redTakenDisplay = document.getElementById('red-taken');
const blackTakenDisplay = document.getElementById('black-taken');

// Выбор команды
let currentPlayer = null;

document.getElementById('choose-red').addEventListener('click', () => {
    currentPlayer = 'red';
    alert('You are playing as Red');
});

document.getElementById('choose-black').addEventListener('click', () => {
    currentPlayer = 'black';
    alert('You are playing as Black');
});

// Функция для создания клетки доски
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
    cell.dataset.row = row;
    cell.dataset.col = col;
    return cell;
}

// Создание игровой доски
for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
        const cell = createCell(row, col);
        gameBoard.appendChild(cell);
    }
}

// Функция для добавления шашек на доску
function addPieces() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if ((row + col) % 2 !== 0 && row < 3) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'red');
                gameBoard.children[row * boardSize + col].appendChild(piece);
            } else if ((row + col) % 2 !== 0 && row > 4) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black');
                gameBoard.children[row * boardSize + col].appendChild(piece);
            }
        }
    }
}

addPieces();

// Логика перемещения шашек
let selectedPiece = null;

gameBoard.addEventListener('click', (event) => {
    const cell = event.target.closest('.cell');
    if (!cell) return;

    if (selectedPiece) {
        movePiece(selectedPiece, cell);
        selectedPiece = null;
    } else if (cell.firstChild && cell.firstChild.classList.contains('piece')) {
        if ((currentPlayer === 'red' && cell.firstChild.classList.contains('red')) || 
            (currentPlayer === 'black' && cell.firstChild.classList.contains('black'))) {
            selectedPiece = cell.firstChild;
        }
    }
});

function movePiece(piece, targetCell) {
    if (targetCell.children.length === 0 && targetCell.classList.contains('black')) {
        const oldCell = piece.parentElement;
        const oldRow = parseInt(oldCell.dataset.row);
        const oldCol = parseInt(oldCell.dataset.col);
        const newRow = parseInt(targetCell.dataset.row);
        const newCol = parseInt(targetCell.dataset.col);

        // Проверка на взятие шашки
        const rowDiff = Math.abs(newRow - oldRow);
        const colDiff = Math.abs(newCol - oldCol);

        if (rowDiff === 2 && colDiff === 2) {
            const midRow = (oldRow + newRow) / 2;
            const midCol = (oldCol + newCol) / 2;
            const midCell = gameBoard.children[midRow * boardSize + midCol];
            if (midCell.firstChild && midCell.firstChild.classList.contains('piece') &&
                midCell.firstChild.classList.contains(currentPlayer === 'red' ? 'black' : 'red')) {
                midCell.removeChild(midCell.firstChild);
                if (currentPlayer === 'red') {
                    blackTaken++;
                } else {
                    redTaken++;
                }
                updateStatistics();
            }
        }

        targetCell.appendChild(piece);
    }
}

function updateStatistics() {
    redTakenDisplay.textContent = `Red pieces taken: ${redTaken}`;
    blackTakenDisplay.textContent = `Black pieces taken: ${blackTaken}`;
}
