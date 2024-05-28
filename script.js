// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Создание игровой доски
const boardSize = 8;
const gameBoard = document.getElementById('game-board');

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
    } else if (cell.firstChild) {
        selectedPiece = cell.firstChild;
    }
});

function movePiece(piece, targetCell) {
    if (targetCell.children.length === 0 && targetCell.classList.contains('black')) {
        targetCell.appendChild(piece);
    }
}
