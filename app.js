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

    const clearBoard = () => {
        board.forEach(row=>{
            row.fill(null);
        });
    }

    return {
        getBoard,
        printBoard,
        move,
        checkWin,
        checkTie,
        clearBoard,
    }
};

const Players = function (){
    let players = [];

    const getPlayers = () => players;

    const addPlayer = (name, marker) => {
        players.push({
            name,
            marker,
            score: 0,
        })
    }

    return {
        getPlayers,
        addPlayer,
    }
}

const GameController = function (playerOneName, playerTwoName){
    const players = Players();
    players.addPlayer(playerOneName, "X");
    players.addPlayer(playerTwoName, "O");

    const board = Gameboard();

    let activePlayer =  players.getPlayers()[0];

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
        clearBoard: board.clearBoard,
        getIsOver,
        getOverMessage,
    }
};

const ScreenController = function (){
    let game;

    const formContainer = document.querySelector(".game-form");
    const gameContainer = document.querySelector(".app__game");

    const form = document.querySelector(".game-form__form");
    const boardEl = document.querySelector(".game__board");

    const playerTurnEl = document.querySelector(".state__turn");
    const gameResultEl = document.querySelector("state__game-result");


    const updateScreen = () => {
        boardEl.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const gameOver = game.getIsOver();

        // render board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("board__cell");
                cellButton.dataset.cell = (rowIndex * 3 + colIndex) + 1
                cellButton.textContent = cell;
                boardEl.appendChild(cellButton);
            });
        });

        if(gameOver){
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

    const clickHandlerStart = (event) => {
        event.preventDefault();

        const playerOneName = document.getElementById("player1-name").value;
        const playerTwoName = document.getElementById("player2-name").value;

        game = GameController(playerOneName, playerTwoName);

        formContainer.classList.add("game-form--hidden");
        gameContainer.classList.remove("game--hidden");

        updateScreen();
    }

    boardEl.addEventListener("click", clickHandlerBoard);

    form.addEventListener("submit", clickHandlerStart)
}

ScreenController();

