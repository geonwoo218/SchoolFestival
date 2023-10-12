const numContainer = document.getElementById('numList');
const stdBtn = document.getElementById('startBtn');
const gameOverMessage = document.getElementById('gameOver');
const restartBtn = document.getElementById('restart');
const gameOverSound = document.getElementById('gameOverSound');
const rounds = document.querySelector('.rounds');
const backSound = document.getElementById('backSound');

stdBtn.addEventListener('click', startGame);
numContainer.addEventListener('click', clickNumber);
restartBtn.addEventListener('click', restartGame);


let numbers = [1, 2, 3, 4, 5];
let nextNumber = 6; //다음 수
let gameStart = false;
let currentNumber = 1; //맞춰야하는 숫자
let gameOver = false;
let displayTime = 3000; // 초기 보여주는 시간 
var cnt = 1;

function startGame() {
    gameStart = true;
    stdBtn.style.display = "none";
    displayNumber();
    rounds.innerHTML = 'ROUND ' + cnt;
    backSound.play();
}

function restartGame() {
    window.location.reload();
}

function displayNumber() {
    randomLocation(numbers);
    numContainer.style.pointerEvents = 'none';//클릭 비활성화
    setTimeout(hideNumber, displayTime); // 3초 후 숫자를 숨김

}

function hideNumber() {
    var numBoxes = document.querySelectorAll('#numList div');

    numBoxes.forEach((numBox) => {
        numBox.style.backgroundColor = 'blue';
        numBox.style.color = 'blue';
    });

    //숫자를 다 숨기고 클릭
    gameOver = false;
    numContainer.style.pointerEvents = 'auto'; // 클릭 활성화
}

// 이미 놓인 박스들을 저장하는 배열
var exBoxes = [];

function randomLocation(array) {
    array.forEach(e => {
        var numBox = document.createElement("div");
        numBox.innerText = e;
        numBoxCss(numBox);
        numContainer.appendChild(numBox);
        exBoxes.push(numBox);
    });

}


function numBoxCss(numBox) {
    var gameBoard = document.getElementById('gameBoard');
    gameBoard.style.width = '100%';
    gameBoard.style.height = 'calc(100vh - 200px)';
    gameBoard.style.position = "relative";
    var maxX = gameBoard.clientWidth - 120;
    var maxY = gameBoard.clientHeight - 120;
    var over = 100;
    var randomX, randomY;

    do {
        var isOver = false;
        randomX = Math.floor(Math.random() * maxX);
        randomY = Math.floor(Math.random() * maxY);

        for (var i = 0; i < exBoxes.length; i++) {
            var exBox = exBoxes[i];
            var exX = parseInt(exBox.style.left, 10);
            var exY = parseInt(exBox.style.top, 10);

            if (
                Math.abs(randomX - exX) < over &&
                Math.abs(randomY - exY) < over
            ) {
                isOver = true;
                break;
            }
        }
    } while (isOver);

    numBox.style.width = "100px";
    numBox.style.height = "100px";
    numBox.style.lineHeight = "100px";
    numBox.style.backgroundColor = "yellow";
    numBox.style.textAlign = "center";
    numBox.style.fontSize = "30px";
    numBox.style.position = "absolute";
    numBox.style.left = randomX + "px";
    numBox.style.top = randomY + "px";

    return numBox;
}


function clickNumber(event) {
    if (gameOver) return;
    const ClickSound = document.getElementById('ClickSound');
    ClickSound.playbackRate = 1.1;
    ClickSound.play();
    var clickedNumber = parseInt(event.target.innerText);

    if (clickedNumber === currentNumber) {
        event.target.style.backgroundColor = 'green'; // 올바르게 클릭한 경우 배경색 변경
        event.target.style.color = "white";
        currentNumber++;

        if (currentNumber > numbers.length) {
            // 모든 숫자를 올바르게 클릭한 경우
            nextGame();
        }
    } else {
        // 순서가 틀린 경우
        backSound.pause();
        event.target.style.backgroundColor = 'red'; // 틀린 경우 배경색 변경
        event.target.style.color = "white";
        //gameOverMessage.innerText = 'GAME\nOVER';
        gameOverMessage.style.display = 'block';
        const endGameScore = document.querySelector('.endGameScore');
        endGameScore.innerHTML = '최대 라운드 : ' + cnt;
        gameOverSound.play();
        numContainer.style.pointerEvents = 'none'; // 클릭 비활성화
        gameOver = true;
    }
}

function endGame() {
    gameOverMessage.style.display = 'none';
    // 모든 숫자 박스
    var numBoxes = document.querySelectorAll('#numList div');

    // 클릭되지 않은 숫자들에 대해 반복합니다.
    numBoxes.forEach((numBox) => {
        if (numBox.style.backgroundColor !== 'green') {
            numBox.style.backgroundColor = 'red'; // 클릭되지 않은 숫자의 배경색을 변경
            numBox.style.color = 'white';
        }
    });
}
function nextGame() {
    // 게임 초기화
    currentNumber = 1;
    gameOver = false;
    gameOverMessage.style.display = 'none';
    numContainer.innerHTML = ''; // 숫자 박스 제거
    exBoxes = []; // 이미 놓인 박스 배열 초기화


    //난이도 업

    if (cnt % 2 === 0) {
        numbers.push(nextNumber);
        console.log(numbers);
        console.log(cnt);
        nextNumber++;
    }
    displayTime -= 50; // 
    if (displayTime < 50) {
        displayTime = 50; // 최소값 설정
    }
    cnt++;
    startGame(); // 게임 다시 시작
}

//게임방법 팝업창
jQuery(document).ready(function () {
    $('#howBtn').click(function () {
        $('#howToPlayBg').fadeIn();
    })
    $('#close').click(function () {
        $("#howToPlayBg").fadeOut();
    })
})