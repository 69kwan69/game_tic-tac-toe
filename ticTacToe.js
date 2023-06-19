const player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark
    return { getName, getMark }
}


const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const resetBoard = () => board.forEach((item, index) => board[index] = '')

    const updateCell = (item, index) => {
        if (board[index]) return false;
        board[index] = item;
        return true;
    }

    const checkBoardFull = () => {
        if (board.every(cell => cell !== '')) return true;
        return false;
    }

    const getBoard = () => board;

    return { updateCell, resetBoard, checkBoardFull, getBoard }
})()


const gameFlow = (() => {
    const player1 = player('Player 1', 'x');
    const player2 = player('Player 2', 'o');

    let currentPlayer = player1;

    const checkWin = () => {
        const board = gameBoard.getBoard();
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
            return true;
        } else if (gameBoard.checkBoardFull()) {
            return 'draw';
        }

        return false;
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const playerMove = (position) => {
        const name = currentPlayer.getName();
        const mark = currentPlayer.getMark();
        if (gameBoard.updateCell(mark, position)) {
            const isWinner = checkWin();
            switchPlayer()
            return { name, mark, isWinner }
        }
    }

    return { playerMove }
})()


const updateDisplay = (() => {
    const board = [...document.querySelectorAll('[data-position]')];

    board.forEach(cell => {
        cell.addEventListener('click', function () {
            const { name, mark, isWinner } = gameFlow.playerMove(this.dataset.position);
            this.textContent = mark;
            if (isWinner === true) {
                setTimeout(() => { alert(`${name} win!`) }, 1);
                gameBoard.resetBoard();
                board.forEach((cell, index) => cell.textContent = gameBoard.getBoard()[index]);
            } else if (isWinner === 'draw') {
                setTimeout(() => { alert('Draw!') }, 1);
                gameBoard.resetBoard();
                board.forEach((cell, index) => cell.textContent = gameBoard.getBoard()[index]);
            }
        })
    })

})()
