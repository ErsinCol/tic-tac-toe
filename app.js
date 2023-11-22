const Gameboard = function (){
    const row = 3;
    const column = 3;
    const board = [];

    for(let i = 0; i < row ; i++){
        board[i] = [];
        for(let j = 0; j < column; j++){
            board[i][j] = null;
        }
    }

    const getBoard = ()=>{
        return board;
    }

    const printBoard = () => {
        let boardString = "";
        for(let i = 0; i < row ; i++){
            let rowString = "";
            for(let j = 0; j < column; j++){
                const cellValue = board[i][j];
                rowString += cellValue !== null ? cellValue : "_";
                rowString += "  ";
            }
            boardString += rowString + "\n";
        }
        console.log(boardString);
    }

    const move = (cell, mark) => {
        const rowIndex = Math.floor((cell - 1) / 3);
        const columnIndex = (cell - 1) % 3;

        board[rowIndex][columnIndex] = mark;
    }

    const checkWin = () => {
        for(let i = 0; i < row; i++) {
            // check rows
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== null) {
                return true;
            }
            // check columns
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== null) {
                return true;
            }
        }
        // Check diagonals
        if (
            (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== null) ||
            (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== null)
        ){
            return true;
        }

        return false;
    }

    const checkTie = () => {
        return board.every(row => row.every(cell => cell !== null));
    }

    return {
        printBoard,
        move,
        checkWin,
        checkTie,
    }
};


const GameController = function (){
    const board = Gameboard();

    const players = [
        {
            name : "Player One",
            marker: "X",
        },
        {
            name: "Player Two",
            marker: "O",
        }
    ];

    let activePlayer = players[0];

    let currentRound = 1;

    const getActivePlayer = () => activePlayer;

    const getCurrentRound = () => currentRound;

    const nextRound = () => currentRound++;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printNewRound = ()=> {
        console.log(`ROUND ${getCurrentRound()}`);
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const winMessage = () => {
        board.printBoard();
        console.log(`GAME OVER... Player ${getActivePlayer().name} wins! Congratulations!`);
    }

    const tieMessage = () => {
        board.printBoard();
        console.log(`GAME OVER... It's a tie! The game is draw.`);
    }

    const playRound = (selectedCell) => {
        console.log(`Player ${getActivePlayer().name} selected cell ${selectedCell} and placed the mark ${getActivePlayer().marker}.`)

        board.move(selectedCell, getActivePlayer().marker);

        if(board.checkWin()){
            winMessage();
        }else if(board.checkTie()){
            tieMessage();
        }else{
            switchPlayerTurn();
            nextRound();
            printNewRound();
        }
    }

    // Initial play game message
    printNewRound();

    return {
        playRound,
    }
};

const game = GameController();