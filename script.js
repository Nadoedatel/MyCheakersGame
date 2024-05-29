// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть приложение на весь экран

// Устанавливаем размер игровой доски (8x8)
const boardSize = 8;
// Получаем ссылку на HTML элемент, который будет содержать игровую доску
const gameBoard = document.getElementById('game-board');

// Переменные для отслеживания захваченных шашек каждым игроком
let redTaken = 0;
let blackTaken = 0;
// Получаем ссылки на HTML элементы, которые будут отображать статистику захваченных шашек
const redTakenDisplay = document.getElementById('red-taken');
const blackTakenDisplay = document.getElementById('black-taken');

// Переменные для хранения цвета игрока и отслеживания текущего игрока
let playerColor = null;
let currentPlayer = null; // Изначально ходит тот, кто выбрал красные шашки

// Получаем ссылку на элемент стрелки, которая будет указывать текущий ход
const arrow = document.getElementById('arrow');

// Обработчики событий для кнопок выбора команды
document.getElementById('choose-red').addEventListener('click', () => {
    playerColor = 'red'; // Устанавливаем цвет игрока как красный
    currentPlayer = 'red'; // Красные начинают первыми
    alert('Вы играете за Красных');
    startGame(); // Начинаем игру
    updateTurnIndicator(); // Обновляем индикатор хода
});

document.getElementById('choose-black').addEventListener('click', () => {
    playerColor = 'black'; // Устанавливаем цвет игрока как черный
    currentPlayer = 'red'; // Красные начинают первыми
    alert('Вы играете за Черных');
    startGame(); // Начинаем игру
    updateTurnIndicator(); // Обновляем индикатор хода
});

// Функция начала игры, скрывающая меню выбора команды и отображающая доску
function startGame() {
    document.getElementById('team-selection').style.display = 'none'; // Скрываем меню выбора команды
    gameBoard.style.visibility = 'visible'; // Отображаем игровую доску
}

// Функция для создания одной клетки доски
function createCell(row, col) {
    const cell = document.createElement('div'); // Создаем элемент div
    cell.classList.add('cell'); // Добавляем ему класс 'cell'
    // Черные и белые клетки чередуются
    cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
    cell.dataset.row = row; // Устанавливаем атрибут data-row
    cell.dataset.col = col; // Устанавливаем атрибут data-col
    return cell; // Возвращаем созданную клетку
}

// Создание игровой доски размером 8x8
for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
        const cell = createCell(row, col); // Создаем клетку
        gameBoard.appendChild(cell); // Добавляем клетку на доску
    }
}

// Функция для добавления шашек на доску
function addPieces() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if ((row + col) % 2 !== 0 && row < 3) {
                const piece = document.createElement('div'); // Создаем элемент div для шашки
                piece.classList.add('piece', 'red'); // Добавляем классы 'piece' и 'red'
                gameBoard.children[row * boardSize + col].appendChild(piece); // Добавляем шашку на доску
            } else if ((row + col) % 2 !== 0 && row > 4) {
                const piece = document.createElement('div'); // Создаем элемент div для шашки
                piece.classList.add('piece', 'black'); // Добавляем классы 'piece' и 'black'
                gameBoard.children[row * boardSize + col].appendChild(piece); // Добавляем шашку на доску
            }
        }
    }
}

// Добавляем шашки на доску
addPieces();

// Логика перемещения шашек
let selectedPiece = null; // Переменная для хранения выбранной шашки

// Обработчик события клика на игровой доске
gameBoard.addEventListener('click', (event) => {
    const cell = event.target.closest('.cell'); // Определяем кликнутую клетку
    if (!cell) return; // Если клик не по клетке, выходим

    if (selectedPiece) {
        movePiece(selectedPiece, cell); // Перемещаем выбранную шашку в кликнутую клетку
        selectedPiece = null; // Сбрасываем выбранную шашку
    } else if (cell.firstChild && cell.firstChild.classList.contains('piece')) {
        // Проверяем, принадлежит ли шашка текущему игроку
        if ((currentPlayer === 'red' && cell.firstChild.classList.contains('red')) || 
            (currentPlayer === 'black' && cell.firstChild.classList.contains('black'))) {
            selectedPiece = cell.firstChild; // Устанавливаем выбранную шашку
        }
    }
});

// Функция перемещения шашки
function movePiece(piece, targetCell) {
    if (targetCell.children.length === 0 && targetCell.classList.contains('black')) {
        const oldCell = piece.parentElement; // Текущая клетка шашки
        const oldRow = parseInt(oldCell.dataset.row); // Текущая строка шашки
        const oldCol = parseInt(oldCell.dataset.col); // Текущий столбец шашки
        const newRow = parseInt(targetCell.dataset.row); // Новая строка
        const newCol = parseInt(targetCell.dataset.col); // Новый столбец

        // Проверка на взятие шашки
        const rowDiff = Math.abs(newRow - oldRow); // Разница в строках
        const colDiff = Math.abs(newCol - oldCol); // Разница в столбцах

        // Проверка валидности хода
        if (isValidMove(oldRow, oldCol, newRow, newCol, piece.classList.contains('red'), piece.classList.contains('king'))) {
            // Проверка на взятие шашки
            if (rowDiff === 2 && colDiff === 2) {
                const midRow = (oldRow + newRow) / 2; // Средняя строка
                const midCol = (oldCol + newCol) / 2; // Средний столбец
                const midCell = gameBoard.children[midRow * boardSize + midCol]; // Средняя клетка
                // Проверка, что в средней клетке есть шашка противника
                if (midCell.firstChild && midCell.firstChild.classList.contains('piece') &&
                    midCell.firstChild.classList.contains(currentPlayer === 'red' ? 'black' : 'red')) {
                    midCell.removeChild(midCell.firstChild); // Удаляем шашку противника
                    if (currentPlayer === 'red') {
                        blackTaken++; // Увеличиваем счетчик захваченных черных шашек
                    } else {
                        redTaken++; // Увеличиваем счетчик захваченных красных шашек
                    }
                    updateStatistics(); // Обновляем статистику
                }
            }

            // Перемещаем шашку в новую клетку
            targetCell.appendChild(piece);

            // Превращение в королеву
            if ((currentPlayer === 'red' && newRow === boardSize - 1) || (currentPlayer === 'black' && newRow === 0)) {
                piece.classList.add('king'); // Добавляем класс 'king'
                piece.textContent = 'K'; // Помечаем королеву буквой 'K'
            }

            // Проверка на возможность взятия еще одной шашки
            if (rowDiff === 2 && colDiff === 2 && canCaptureAgain(newRow, newCol, piece.classList.contains('red'), piece.classList.contains('king'))) {
                selectedPiece = piece; // Устанавливаем выбранную шашку для следующего хода
            } else {
                currentPlayer = currentPlayer === 'red' ? 'black' : 'red'; // Меняем игрока после каждого хода
                updateTurnIndicator(); // Обновляем индикатор хода
            }
        }
    }
}

// Функция проверки валидности хода
function isValidMove(oldRow, oldCol, newRow, newCol, isRed, isKing) {
    const rowDiff = newRow - oldRow; // Разница в строках
    const colDiff = Math.abs(newCol - oldCol); // Разница в столбцах

    if (colDiff !== 1 && colDiff !== 2) return false; // Проверка на движение по диагонали

    if (isKing) {
        // Королева может ходить по диагоналям на любое количество клеток
        return Math.abs(rowDiff) === colDiff;
    } else {
        if (isRed) {
            return rowDiff === 1 || rowDiff === 2; // Красные могут ходить и бить вперед и назад
        } else {
            return rowDiff === -1 || rowDiff === -2; // Черные могут ходить и бить вперед и назад
        }
    }
}

// Функция проверки возможности взятия еще одной шашки
function canCaptureAgain(row, col, isRed, isKing) {
    // Проверка всех четырех направлений на возможность взятия шашки
    const directions = isKing ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : (isRed ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    for (const [rowOffset, colOffset] of directions) {
        const newRow = row + 2 * rowOffset;
        const newCol = col + 2 * colOffset;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            const midRow = row + rowOffset;
            const midCol = col + colOffset;
            const midCell = gameBoard.children[midRow * boardSize + midCol];
            const newCell = gameBoard.children[newRow * boardSize + newCol];
            if (midCell.firstChild && midCell.firstChild.classList.contains('piece') &&
                midCell.firstChild.classList.contains(currentPlayer === 'red' ? 'black' : 'red') &&
                newCell.children.length === 0 && newCell.classList.contains('black')) {
                return true;
            }
        }
    }
    return false;
}

// Функция обновления статистики захваченных шашек
function updateStatistics() {
    redTakenDisplay.textContent = `Красные взяли: ${redTaken}`; // Обновляем количество захваченных черных шашек
    blackTakenDisplay.textContent = `Черные взяли: ${blackTaken}`; // Обновляем количество захваченных красных шашек
}

// Функция обновления индикатора хода
function updateTurnIndicator() {
    arrow.textContent = `Ход: ${currentPlayer === 'red' ? 'Красные' : 'Черные'}`; // Обновляем текст индикатора хода
    arrow.style.color = currentPlayer === 'red' ? 'red' : 'black'; // Устанавливаем цвет индикатора хода
}
