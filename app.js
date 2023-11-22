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
        getBoard,
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

    let isOver = false;

    let overMessage = "";

    const getIsOver = () => isOver;

    const getOverMessage = () => overMessage;

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const overMessageGenerator = (isWin) => {
        if(isWin){
            overMessage =  `GAME OVER, ${getActivePlayer().name} wins!`;
        }else{
            overMessage = `GAME OVER, It's a tie!`;
        }
    }

    const playRound = (selectedCell) => {

        board.move(selectedCell, getActivePlayer().marker);

        if(board.checkWin()){
            isOver = true;
            overMessageGenerator(true);
        }else if(board.checkTie()){
            isOver = true;
            overMessageGenerator(false);
        }else{
            switchPlayerTurn();
        }
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getIsOver,
        getOverMessage,
    }
};

const ScreenController = function (){
    // let game = GameController();
    const boardEl = document.getElementById("board");
    const playerTurnEl = document.getElementById("turn");
    const gameResultEl = document.getElementById("game-result");
    const restartBtn = document.getElementById("restart-btn");
    const startBtn = document.getElementById("start-btn");

    const updateScreen = () => {
        boardEl.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const gameOver = game.getIsOver();

        // render board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.cell = (rowIndex * 3 + colIndex) + 1
                cellButton.textContent = cell;
                boardEl.appendChild(cellButton);
            });
        });

        if(gameOver){
            gameResultEl.classList.add("block");
            playerTurnEl.classList.add("hidden");
            gameResultEl.textContent = game.getOverMessage();
        }else{
            playerTurnEl.textContent = `${activePlayer.name}'s turn`;
        }
    }

    const clickHandlerBoard = (e) => {
        const selectedCell = e.target.dataset.cell;
        const selectedCellValue = e.target.innerText;
        if(!selectedCell || selectedCellValue) return;

        game.playRound(selectedCell);

        updateScreen();
    }

    const clickHandlerRestart = () => {
        game = GameController();
        updateScreen();
    }

    const clickHandlerStart = (e) => {
        e.preventDefault();

        console.log("Oyuncu bilgileri alınacak oyuncular oluşturulacak ve oyun başlayacak.")
    }

    boardEl.addEventListener("click", clickHandlerBoard);

    restartBtn.addEventListener("click", clickHandlerRestart);

    startBtn.addEventListener("click", clickHandlerStart);

    // initial render
    // updateScreen();
}

