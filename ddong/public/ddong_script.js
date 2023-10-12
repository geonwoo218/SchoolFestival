let pressedLeft = false;
let pressedRight = false;
let gui = document.getElementById('GUI');
let gameContainer = document.getElementById('gameContainer');
let htpbg = document.querySelector('.htpbg');
let gameTimeDisplay = document.getElementById('gameTimeDisplay');
let playerSpeed = 1;
let playerPosition = 0;
let player;
let poop;
let keyRepeatTimeout;
let poopSpeed = 5;
let poopCreateInterval;
let poopMoveInterval;
const minPosition = 25;
const maxPosition = 475;
let gameOver = false;
let gameEnded = false;
let gameStartTime;
let gameEndTime;
var leaderboard = [];
var poopCreateSpeed = 600;
const clickSound = document.getElementById('clickSound');
const bgSound = document.getElementById('bgSound');
const createPoopSound = document.getElementById('createPoopSound');
const gamePlaySound = document.getElementById('gamePlaySound');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', function () {
        clickSound.currentTime = 0;
        clickSound.play();
    })
});

window.onload = function () {
    leaderboard = JSON.parse(localStorage.getItem('ddongleaderboard')) || [];
    showLeaderboard();
}

function startGame() {
    bgSound.pause();
    gamePlaySound.play();
    gui.style.display = "none";
    gameContainer.style.display = "block";

    pressedLeft = false;
    pressedRight = false;

    clearInterval(keyRepeatTimeout);
    clearInterval(poopCreateInterval);
    clearInterval(poopMoveInterval);
    poopSpeed = 5;
    poopCreateSpeed = 600;

    if (player) {
        gameContainer.removeChild(player);
        player = null;
    }

    gameOver = false;
    gameEnded = false;

    player = createPlayer();
    playerPosition = (gameContainer.offsetWidth - player.offsetWidth) / 2;
    gameContainer.appendChild(player);
    updatePlayerPosition();

    const poops = document.querySelectorAll('.poop');
    poops.forEach(function (poop) {
        gameContainer.removeChild(poop);
    });

    poopMoveInterval = setInterval(movePoop, 30);
    poopCreateInterval = setInterval(createPoop, poopCreateSpeed);
    setInterval(function () {
        poopSpeed += 0.4;
        poopCreateSpeed -= 30;
        clearInterval(poopCreateInterval);
        clearInterval(poopMoveInterval);
        poopCreateInterval = setInterval(createPoop, poopCreateSpeed);
        poopMoveInterval = setInterval(movePoop, 30);
    }, 5000);

    gameTimeDisplay.innerHTML = ("0.00s");
    gameStartTime = Date.now();
    updateGameTime();
}

function updateGameTime() {
    if (!gameEnded) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - gameStartTime) / 1000;
        gameTimeDisplay.innerHTML = elapsedTime.toFixed(2) + "s";
    }
}
setInterval(updateGameTime, 10);

function createPlayer() {
    let playerImg = document.createElement('img');
    playerImg.className = 'player';
    playerImg.style.width = "70px";
    playerImg.style.height = "88px";
    playerImg.src = "public/images/player.png";
    return playerImg;
}

window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' && !pressedLeft && !pressedRight) {
        pressedLeft = true;
        moveLeft();
        keyRepeatTimeout = setInterval(moveLeft, 4);
    } else if (event.key === 'ArrowRight' && !pressedRight && !pressedLeft) {
        pressedRight = true;
        moveRight();
        keyRepeatTimeout = setInterval(moveRight, 4);
    }
});

window.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
        pressedLeft = false;
    } else if (event.key === 'ArrowRight') {
        pressedRight = false;
    }

    clearInterval(keyRepeatTimeout);
});

function moveLeft() {
    if (playerPosition > minPosition) {
        playerPosition -= playerSpeed;
        if (playerPosition < minPosition) {
            playerPosition = minPosition;
        }
        updatePlayerPosition();
    }
}

function moveRight() {
    if (playerPosition < maxPosition) {
        playerPosition += playerSpeed;
        if (playerPosition > maxPosition) {
            playerPosition = maxPosition;
        }
        updatePlayerPosition();
    }
}

function updatePlayerPosition() {
    player.style.left = playerPosition + "px";
}

function createPoop() {
    const poopX = Math.floor(Math.random() * (maxPosition - minPosition)) + minPosition;
    poop = document.createElement('img');
    poop.className = "poop";
    poop.style.width = "30px";
    poop.style.height = "30px";
    poop.src = "public/images/poop.png";
    poop.style.position = 'absolute';
    poop.style.left = poopX + 'px';
    gameContainer.appendChild(poop);
    createPoopSound.currentTime = 0;
    createPoopSound.play();
}

function movePoop() {
    const poops = document.querySelectorAll('.poop');

    poops.forEach(function (poop) {
        const topPosition = parseInt(poop.style.top) || 0;

        if (topPosition >= gameContainer.offsetHeight) {
            if (gameContainer.contains(poop)) {
                gameContainer.removeChild(poop);
            }
            return;
        }

        poop.style.top = (topPosition + poopSpeed) + 'px';

        if (isCollision(poop, player)) {
            endGame();
            return;
        }
    });
}

function isCollision(poop, player) {
    const poopRect = poop.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const poopX = poopRect.left + poopRect.width / 2;
    const poopY = poopRect.top + poopRect.height / 2;
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;

    const distance = Math.sqrt((poopX - playerX) ** 2 + (poopY - playerY) ** 2);

    return distance < (poopRect.width / 2 + playerRect.width / 2) - 3;
}

function showLeaderboard() {
    leaderboard.sort(function (a, b) {
        return parseFloat(b.time) - parseFloat(a.time);
    });

    var leaderboardList = document.getElementById("leaderboard");

    for (var i = 0; i < leaderboard.length; i++) {
        var ranking = i + 1;
        var playerName = leaderboard[i].name;
        var playerTime = leaderboard[i].time;
        var listItem = document.createElement("li");
        listItem.textContent = ranking + ". " + playerName + " - " + playerTime + " 초";
        leaderboardList.appendChild(listItem);
    }
}

function endGame() {
    gameEndTime = Date.now();
    if (!gameOver) {
        gameOver = true;
    }
    const elapsedTime = (gameEndTime - gameStartTime) / 1000;
    alert("게임종료\n 버틴 시간 : " + elapsedTime.toFixed(2) + "초");
    var playerName = prompt("게임플레이 기록을 위해 이름을 입력해주세요. : ", "플레이어");
    var rankingData = { name: playerName, time: elapsedTime.toFixed(2) };
    leaderboard.push(rankingData);

    leaderboard = leaderboard.filter(function (item, index, self) {
        return self.findIndex(t => t.name === item.name) === index;
    });

    const poops = document.querySelectorAll('.poop');
    poops.forEach(function (poop) {
        gameContainer.removeChild(poop);
    });

    if (player) {
        gameContainer.removeChild(player);
    }

    playerPosition = (gameContainer.offsetWidth - player.offsetWidth) / 2;
    updatePlayerPosition();

    gameContainer.style.display = "none";
    gui.style.display = "flex";

    gameEnded = true;

    pressedLeft = false;
    pressedRight = false;


    player = null;
    clearInterval(poopCreateInterval);
    clearInterval(poopMoveInterval);

    var leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = "<h1>leaderboard</h1>";

    showLeaderboard();
    gamePlaySound.currentTime = 0;
    gamePlaySound.pause();

    localStorage.setItem('ddongleaderboard', JSON.stringify(leaderboard));
    poopSpeed = 5;
    poopCreateSpeed = 600;
    location.reload();
}



function howtoplay() {
    htpbg.style.display = "block";
}

function htpclose() {
    htpbg.style.display = "none";
}

function adjustPoopSpeed() {
    poopSpeed += 0.2;
    poopCreateSpeed -= 50;
}