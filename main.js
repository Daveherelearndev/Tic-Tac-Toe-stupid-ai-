const rooms = document.querySelectorAll(".container__room");
const resultBoard = document.querySelector("#result");
const startBtn = document.querySelector(".start-btn");
const reloadBtn = document.querySelector(".reload-btn");

const game = (() => {
    const choice = ["cross", "circle"];
    const winBoard = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    let gotWinner = false;
    let currentBoard;
    const Player = (name) => { 
        let playerName = name;     
        const playerBoard = [];
        let myTurn = false;
        let myChess;
        return {playerName, playerBoard, myTurn, myChess};
    }
    const human = Player("human");
    const ai = Player("ai");
    let ourPlayers = [human, ai];

    let _updateChessBoard = () => {
        console.log(currentBoard);
        return currentBoard = human["playerBoard"].concat(ai["playerBoard"]).sort();
    }
    
    console.log(currentBoard);
    const startGame = () => {        
        human["myChess"] = _chooseChess();
        human["myChess"] === "cross" ? ai["myChess"] = "circle" : ai["myChess"] = "cross";        
        ourPlayers = ourPlayers.map(player => _firstPlay(player));
        _yourTurnNow();
        _updateChessBoard();
        _nextTurn();

        console.log(human, ai);
    }
    const _ShowChess = (player, num) => {
        let addClass;
        player["myChess"] === "cross" ? addClass = "display-x" : addClass = "display-o";
        rooms.forEach(room => {
            if (Number(room.dataset.room) === num) {
                room.classList.add(`${addClass}`)
            }
        })
    }
    const _aiTurn = (ai) => {
        _updateChessBoard();
        let wholeRoom = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let restRoom = [];
        for (let i = 0; i < wholeRoom.length; i++) {
            if (!currentBoard.includes(wholeRoom[i])) {
                restRoom.push(wholeRoom[i]);
            }
        }
        console.log(restRoom);
        let chooseNum = restRoom[_aiChooseNum(restRoom.length)];
            console.log(chooseNum);
            ai["playerBoard"].push(chooseNum);
            _ShowChess(ai, chooseNum);
            ai["myTurn"] = !ai["myTurn"];
            human["myTurn"] = !human["myTurn"];
            _nextTurn();   
    }
    const _aiChooseNum = (num) => {
        return Math.floor((Math.random() * num));
    }
    const _yourTurnNow = () => {
        if (human["myTurn"] === true) {
            resultBoard.textContent = "Your turn!!"
        } else {
            resultBoard.textContent = "";
            _aiTurn(ai);
        }
    }
    const _firstPlay = (player) => {
        player["myChess"] === "cross" ? player["myTurn"] = true : player["myTurn"] = false;
    }
    const playGame = (num) => {
        num = Number(num);
        if (human["myTurn"]) {
            human["playerBoard"].push(num);
            _ShowChess(human, num);
            human["myTurn"] = !human["myTurn"];
            ai["myTurn"] = !ai["myTurn"];
            _nextTurn();
        }

    }
    const _nextTurn = () => {
        currentBoard = _updateChessBoard();
        if (currentBoard.length >= 3) {
            _checkResult(human, human["playerBoard"]);
            _checkResult(ai, ai["playerBoard"]);
            console.log("work");
        }
        if (!gotWinner) {
            if (ai["myTurn"]) {
                _aiTurn(ai);
                console.log({human, ai});
            } else {
                human["myTurn"] = true;
                console.log({human, ai});
                return;
            }
        }

    }
    const _chooseChess = () => {
        const ranNum = Math.floor(Math.random() * 2);//choose 1 or 2
        return choice[ranNum];
    }
    const _checkResult = (player, playerBoard) => {
        let result;
        winBoard.forEach(win => {
            let i = 0;
            win.forEach(num => {               
                if (playerBoard.includes(num)) {
                    i++;
                }
            })
            if (i === 3) {
                result = true;
            }
        })       
        // console.log(playerBoard.sort());
        // console.log(result);
        if (result) {
            gotWinner = true;
            return resultBoard.textContent = `${player["playerName"]} wins!`
        } else {
            return;
        }

    }
    return {
        startGame,
        playGame,
    };
})();

rooms.forEach(room => room.addEventListener("click", (e) => {
    let roomNum = e.target.dataset.room;
    game.playGame(roomNum);
}))

startBtn.addEventListener("click", () => game.startGame())
reloadBtn.addEventListener("click", () => {
    location.reload();
    return false;
})