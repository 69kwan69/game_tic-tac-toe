const player = (name, mark) => {
    let score = 0;
    const getName = () => name;
    const getMark = () => mark;
    const getScore = () => score;
    const winGame = () => score++;
    return { getName, getMark, getScore, winGame }
}


const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const resetGameBoard = () => board.forEach((item, index) => board[index] = '')

    const updateCell = (item, index) => {
        if (board[index]) return false;
        board[index] = item;
        return true;
    }

    const checkgameBoardFull = () => {
        if (board.every(cell => cell !== '')) return true;
        return false;
    }

    const getGameBoard = () => board;

    return { updateCell, resetGameBoard, checkgameBoardFull, getGameBoard }
})()


const gameFlow = (() => {
    const player1 = player('Player 1', 'x');
    const player2 = player('Player 2', 'o');

    let currentPlayer = player1;

    const checkWin = () => {
        const board = gameBoard.getGameBoard();
        const mark = currentPlayer.getMark();

        if (
            (board[0] === mark &&
                board[3] === mark &&
                board[6] === mark) ||

            (board[0] === mark &&
                board[1] === mark &&
                board[2] === mark) ||

            (board[0] === mark &&
                board[4] === mark &&
                board[8] === mark) ||

            (board[1] === mark &&
                board[4] === mark &&
                board[7] === mark) ||

            (board[2] === mark &&
                board[4] === mark &&
                board[6] === mark) ||

            (board[2] === mark &&
                board[5] === mark &&
                board[8] === mark) ||

            (board[3] === mark &&
                board[4] === mark &&
                board[5] === mark) ||

            (board[6] === mark &&
                board[7] === mark &&
                board[8] === mark)
        ) {
            currentPlayer.winGame();
            return true;
        } else if (gameBoard.checkgameBoardFull()) {
            return 'draw';
        }

        return false;
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;

    const getCurrentPlayerName = () => currentPlayer.getName();

    const playerMove = (position) => {
        const name = currentPlayer.getName();
        const mark = currentPlayer.getMark();
        if (gameBoard.updateCell(mark, position)) {
            const isWinner = checkWin();
            switchPlayer()
            return { name, mark, isWinner }
        }
    }

    return { getPlayer1, getPlayer2, getCurrentPlayerName, playerMove }
})()


const updateDisplay = (() => {
    // HTML Elements
    const board = document.querySelector('.board');
    const cells = board.querySelectorAll('[data-position]')
    const player1 = document.querySelector('.p1');
    const player2 = document.querySelector('.p2');
    const messageDialog = document.querySelector('dialog');
    const rematchBtn = messageDialog.querySelector('.rematch');

    // Functions
    const displayMark = (mark, position) => {
        if (mark === 'x') {
            cells[position].innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else if (mark === 'o') {
            cells[position].innerHTML = '<i class="fa-solid fa-o"></i>';
        }
    }

    const highlightCurrentPlayer = () => {
        const player = gameFlow.getCurrentPlayerName();

        if (player === player1.querySelector('select').value) {
            player1.classList.remove('filter-grey');
            player2.classList.add('filter-grey');
        } else {
            player1.classList.add('filter-grey');
            player2.classList.remove('filter-grey');
        }

    }

    const updatePlayerScore = () => {
        player1.querySelector('.score').textContent = gameFlow.getPlayer1().getScore();
        player2.querySelector('.score').textContent = gameFlow.getPlayer2().getScore();
    }

    const displayMessage = (name, isWin) => {
        if (isWin === false) {
            return;
        } else if (isWin === true) {
            messageDialog.querySelector('.message').textContent = `${name} won!`;
            updatePlayerScore(name);
        } else {
            messageDialog.querySelector('.message').textContent = `It's a draw!`;
        }

        setTimeout(() => {
            messageDialog.show();
            board.classList.add('unclickable');
        }, 150);
    }

    const resetBoard = () => {
        gameBoard.resetGameBoard();
        gameBoard.getGameBoard().forEach((cell, index) => cells[index].textContent = cell);
    }

    const confirmRematch = () => {
        messageDialog.close();
        board.classList.remove('unclickable');
        resetBoard();
    }

    // Events
    board.addEventListener('click', e => {
        const position = e.target.dataset.position;
        if (position) {
            const { name, mark, isWinner } = gameFlow.playerMove(position);
            displayMark(mark, position);
            displayMessage(name, isWinner);
            highlightCurrentPlayer();
        }
    });

    rematchBtn.addEventListener('click', confirmRematch)
})()
