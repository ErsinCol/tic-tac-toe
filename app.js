const Gameboard = function (){
    const row = 3;
    const column = 3;
    const board = Array.from({length: row}, () => Array(column).fill(null));

    const getBoard = ()=>{
        return board;
    }

    // for console version
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
        move,
        checkWin,
        checkTie,
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

const GameController = function (players){
    const board = Gameboard();

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
            getActivePlayer().score++;
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
    let game;
    let players;

    const formContainer = document.querySelector(".game-form");
    const gameContainer = document.querySelector(".app__game");
    const form = document.querySelector(".game-form__form");
    const boardEl = document.querySelector(".game__board");
    const playerTurnEl = document.querySelector(".state__turn");
    const gameResultEl = document.querySelector(".state__game-result");
    const restartBtn = document.querySelector(".state__restart-btn");
    const player1NameDisplay = document.querySelector(".player1 .player__name");
    const player2NameDisplay = document.querySelector(".player2 .player__name");
    const player1ScoreDisplay = document.querySelector(".player1 .player__score");
    const player2ScoreDisplay = document.querySelector(".player2 .player__score");

    const toggleVisibility = (element, show) => {
        element.classList.toggle("hidden", !show);
    }

    const updateScreen = () => {
        player1NameDisplay.textContent = players.getPlayers()[0].name;
        player2NameDisplay.textContent = players.getPlayers()[1].name;
        player1ScoreDisplay.textContent = players.getPlayers()[0].score;
        player2ScoreDisplay.textContent = players.getPlayers()[1].score;
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
            gameResultEl.classList.add("winner-animation");
            toggleVisibility(gameResultEl, true);
            toggleVisibility(playerTurnEl, false);
        }else{
            playerTurnEl.textContent = `${activePlayer.name}'s turn`;
            toggleVisibility(playerTurnEl, true);
            toggleVisibility(gameResultEl, false);
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
        game = GameController(players.getPlayers());
        updateScreen();
    }

    const clickHandlerStart = (event) => {
        event.preventDefault();

        const playerOneName = document.getElementById("player1-name").value;
        const playerTwoName = document.getElementById("player2-name").value;

        players = Players();
        players.addPlayer(playerOneName.toUpperCase(), "X");
        players.addPlayer(playerTwoName.toUpperCase(), "O");

        game = GameController(players.getPlayers());

        toggleVisibility(formContainer, false);
        toggleVisibility(gameContainer, true);

        updateScreen();
    }

    boardEl.addEventListener("click", clickHandlerBoard);

    form.addEventListener("submit", clickHandlerStart)

    restartBtn.addEventListener("click", clickHandlerRestart);
}

ScreenController();

