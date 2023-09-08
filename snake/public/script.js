var startButton = document.getElementById('startButton');
var gridContainer = document.getElementById('grid');
var rows = 15;
var cols = 15;
var snake = [{ row: 0, col: 0 }];
var direction = 'right';
var food = [{row: 0, col: 0}]
var score = 0;
var gameLoop;
var scoreElement = document.getElementById('score');
var leaderboard = [];
var leaderboardContainer = document.getElementById('leaderboard');

window.onload = function(){
    leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard')) || [];
    scoreElement.innerHTML = "Score: 0";
    displayLeaderboard();
}

function createGrid() {
    var tbody = document.createElement('tbody');
    for (var i = 0; i < rows; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement('td');
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    gridContainer.innerHTML = '';
    gridContainer.appendChild(tbody);
}

function initializeSnake() {
    snake = [{ row: Math.floor(rows / 2), col: Math.floor(cols / 6) }, { row: Math.floor(rows / 2), col: Math.floor(cols / 6) -1}];
    var headCell = gridContainer.querySelector('tbody').rows[snake[0].row].cells[snake[0].col];
    headCell.classList.add('snake');
}

function createFood(){
    var foodRow, foodCol;

    do{
        var foodRow = Math.floor(Math.random() * rows);
        var foodCol = Math.floor(Math.random() * cols);
    }while(isCollision(foodRow,foodCol));
        food = {row: foodRow, col: foodCol};
    var foodCell = gridContainer.querySelector('tbody').rows[food.row].cells[food.col];
    foodCell.classList.add('food');
}

function eatFood() {
    var head = snake[0];
    var newHead = { row: head.row, col: head.col };
    snake.unshift(newHead);

    var scoreElement = document.getElementById('score');
    score++;
    scoreElement.innerText = 'Score: ' + score;

    var foodCell = gridContainer.querySelector('tbody').rows[food.row].cells[food.col];
    foodCell.classList.remove('food');

    createFood();
}

function moveSnake() {
    var head = snake[0];
    var nextRow = head.row;
    var nextCol = head.col;

    if (direction == 'up') {
        nextRow--;
    } else if (direction == 'down') {
        nextRow++;
    } else if (direction == 'left') {
        nextCol--;
    } else if (direction == 'right') {
        nextCol++;
    }

    if (isCollision(nextRow, nextCol)) {
        clearInterval(gameLoop);
        gameOver();
        return;
    }

    if(nextRow === food.row && nextCol === food.col){
        eatFood();
    }

    snake.unshift({ row: nextRow, col: nextCol });
    var tail = snake.pop();

    var headCell = gridContainer.querySelector('tbody').rows[snake[0].row].cells[snake[0].col];
    headCell.classList.add('snake');
    var tailCell = gridContainer.querySelector('tbody').rows[tail.row].cells[tail.col];
    tailCell.classList.remove('snake');
}

function isCollision(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return true;
    }
    for (var i = 1; i < snake.length; i++) {
        if (row === snake[i].row && col === snake[i].col) {
            return true;
        }
    }
    return false;
}

function changeDirection(newDirection) {
    direction = newDirection;
}

document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowUp") {
        changeDirection('up');
    } else if (event.key === "ArrowDown") {
        changeDirection('down');
    } else if (event.key === "ArrowLeft") {
        changeDirection('left');
    } else if (event.key === "ArrowRight") {
        changeDirection('right');
    }
});

startButton.addEventListener('click', function () {
    score = 0;
    direction = 'right';
    var scoreElement = document.getElementById('score');
    scoreElement.innerText = 'Score: 0';
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    var img = document.getElementById('boardImg');
    img.style.display = "none";
    createGrid();
    initializeSnake();
    createFood();
    gameLoop = setInterval(moveSnake, 133);
});

function addToLeaderboard(name, socre){
    leaderboard.push({name: name, score: score})
    leaderboard.sort(function(a, b){
        return b.score - a.score;
    });
    displayLeaderboard();
    localStorage.setItem('snakeLeaderboard',JSON.stringify(leaderboard));
}

function gameOver(){
    clearInterval(gameLoop);
    var playerName = prompt('게임 오버!\n당신의 이름을 입력하세요:');
    if (playerName) {
        addToLeaderboard(playerName, score);
    }
    var tbody = document.querySelector('table tbody');
    tbody.parentNode.removeChild(tbody);
    var img = document.getElementById('boardImg');
    img.style.display = "block";
    scoreElement.innerText = 'Score: 0';
    direction = 'right';
}

function displayLeaderboard() {
    leaderboardContainer.innerHTML = "";
    for (var i = 0; i < leaderboard.length; i++) {
        var leader = leaderboard[i];
        var leaderItem = document.createElement('li');
        leaderItem.innerText = (i + 1) + '. ' + leader.name + ' - ' + leader.score + '점';
        leaderboardContainer.appendChild(leaderItem);
    }
}