document.addEventListener('DOMContentLoaded', () => {
    const sudokuBoard = document.getElementById('sudokuBoard');
    const newSudokuButton = document.getElementById('newSudokuButton');
    const solveSudokuButton = document.getElementById('solveSudokuButton');

    let sudokuPuzzle = [];
    let sudokuSolution = [];
    let selectedCell = null;

    function generateSudoku() {
        sudokuSolution = generateRandomSudoku();
        sudokuPuzzle = JSON.parse(JSON.stringify(sudokuSolution));
        removeSudokuNumbers();
        renderSudokuBoard(false);
    }

    function generateRandomSudoku() {
        const board = Array(9).fill().map(() => Array(9).fill(0));
        fillDiagonalBoxes(board);
        solveSudoku(board);
        return board;
    }

    function fillDiagonalBoxes(board) {
        for (let i = 0; i < 9; i += 3) {
            fillBox(board, i, i);
        }
    }

    function fillBox(board, row, col) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[row + i][col + j] = nums[index++];
            }
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValidSudokuMove(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValidSudokuMove(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function removeSudokuNumbers() {
        const cellsToRemove = 40 + Math.floor(Math.random() * 11); // Remove 40-50 cells
        const cells = shuffle([...Array(81).keys()]);
        for (let i = 0; i < cellsToRemove; i++) {
            const index = cells[i];
            const row = Math.floor(index / 9);
            const col = index % 9;
            sudokuPuzzle[row][col] = 0;
        }
    }

    function renderSudokuBoard(isSolution = false) {
        sudokuBoard.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');
                if (sudokuPuzzle[row][col] !== 0) {
                    cell.textContent = sudokuPuzzle[row][col];
                    if (isSolution && !cell.classList.contains('given')) {
                        cell.classList.add('solution');
                    } else {
                        cell.classList.add('given');
                    }
                } else {
                    cell.addEventListener('click', () => selectSudokuCell(cell, row, col));
                }
                sudokuBoard.appendChild(cell);
            }
        }
    }

    function selectSudokuCell(cell, row, col) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        cell.classList.add('selected');
    }

    function handleSudokuInput(number) {
        if (selectedCell && !selectedCell.classList.contains('given')) {
            const row = Math.floor(Array.from(sudokuBoard.children).indexOf(selectedCell) / 9);
            const col = Array.from(sudokuBoard.children).indexOf(selectedCell) % 9;

            if (number === 'erase') {
                selectedCell.textContent = '';
                selectedCell.classList.remove('correct', 'incorrect');
                sudokuPuzzle[row][col] = 0;
            } else {
                const num = parseInt(number);
                if (num === sudokuSolution[row][col]) {
                    selectedCell.textContent = num;
                    selectedCell.classList.add('correct');
                    selectedCell.classList.remove('incorrect');
                    sudokuPuzzle[row][col] = num;
                    if (isSudokuComplete()) {
                        alert('Congratulations! You solved the Sudoku puzzle!');
                    }
                } else {
                    selectedCell.textContent = num;
                    selectedCell.classList.add('incorrect');
                    selectedCell.classList.remove('correct');
                    sudokuPuzzle[row][col] = num;
                }
            }
        }
    }

    function isSudokuComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudokuPuzzle[row][col] !== sudokuSolution[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Add event listeners for number buttons and erase button
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', () => handleSudokuInput(btn.dataset.number));
    });

    document.getElementById('eraseSudokuButton').addEventListener('click', () => handleSudokuInput('erase'));

    newSudokuButton.addEventListener('click', generateSudoku);
    solveSudokuButton.addEventListener('click', () => {
        const originalPuzzle = JSON.parse(JSON.stringify(sudokuPuzzle));
        sudokuPuzzle = JSON.parse(JSON.stringify(sudokuSolution));
        
        sudokuBoard.childNodes.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            if (originalPuzzle[row][col] === 0) {
                cell.textContent = sudokuPuzzle[row][col];
                cell.classList.add('solution');
            }
        });
    });

    // Initialize game
    generateSudoku();
});
