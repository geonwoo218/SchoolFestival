//참고 : https://github.com/1K3H/minesweeper/blob/main/program.js
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", setting);
const COLOR = ["blue", "rgb(0,204,0)", "red", "purple", "orange", "olive", "brown", "black"];
const tdArr = document.getElementsByTagName('td'); //테이블범위
let row;
let col;

window.addEventListener("contextmenu", (e) => e.preventDefault());//우클릭메뉴제거

function setting() {
    
    row = parseInt(document.getElementById("row").value);
    col = parseInt(document.getElementById("col").value);
    const tnt = parseInt(document.getElementById("tnt").value);
    if (row == 0 || col == 0 || tnt == 0) {
        alert("0이 말이 됩니까 그럴꺼면 가세요 '^' ");
        restart();
    } else if (row < 0 || col < 0 || tnt < 0) {
        alert("음수는 좀 아니잖아요 ^_^");
        restart();
    } else if (tnt >= row * col) {
        alert("지뢰가 너무 많아요 >_<");
        restart();
    } else {
        const tntArr = settnt(tnt, row * col);
        makeBoard(row, col);
        putTnt(tntArr);

        // 타일에 이벤트추가
        for (let i = 0; i < tdArr.length; i++) {
            tileEvent(i, getAroundArr(i));
        }
    }

}

function getAroundArr(num) { //주변타일확인
    if (num === 0) return [1, row, row + 1];
    if (num === row - 1) return [row - 2, 2 * row - 2, 2 * row - 1];
    if (num === row * (col - 1)) return [row * (col - 2), row * (col - 2) + 1, row * (col - 1) + 1];
    if (num === row * col - 1) return [row * (col - 1) - 2, row * (col - 1) - 1, row * col - 2];
    if (0 < num && num < row - 1) return [num - 1, num + 1, num + row - 1, num + row, num + row + 1];
    if (row * (col - 1) < num && num < row * col - 1) return [num - row - 1, num - row, num - row + 1, num - 1, num + 1];
    if (num % row === 0) return [num - row, num - row + 1, num + 1, num + row, num + row + 1];
    if (num % row === row - 1) return [num - row - 1, num - row, num - 1, num + row - 1, num + row];
    return [num - row - 1, num - row, num - row + 1, num - 1, num + 1, num + row - 1, num + row, num + row + 1];
}

function makeBoard(rowNum, colNum) { //테이블 만들기

    var table = document.createElement('table');
    table.style.border = "1px solid black";
    table.style.borderCollapse = "collapse";

    for (let i = 0; i < rowNum; i++) { //행추가
        let row = document.createElement('tr');
        for (let j = 0; j < colNum; j++) { // 열추가
            let cell = document.createElement('td');
            cell.style.border = "1px solid black";
            cell.style.width = "50px";
            cell.style.height = "50px";
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    var gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = '';
    gameBoard.appendChild(table);
}

function settnt(limit, range) { //지뢰위치
    var tnt = [];
    for (let i = 0; i < limit; i++) {
        let random = Math.floor(Math.random() * range);
        if (tnt.indexOf(random) === -1) {
            tnt.push(random);
        } else {
            i--;
        }
    }
    return tnt;
}

function putTnt(tnt) { //지뢰추가
    for (let i = 0; i < tdArr.length; i++) {
        if (tnt.indexOf(i) !== -1) {
            tdArr[i].classList.add('mine');
        }
    }
}

function clickTile(targetNum, aroundArr) {
    const tile = tdArr[targetNum];
    const isOpen = tile.dataset.isOpen === "true"; // 이미 열려있는 타일인지 확인
    const isFlag = tile.classList.contains("flag"); // 깃발
    const isQMark = tile.classList.contains("qmark"); // 물음표
    const isMine = tile.classList.contains("mine");

    if (isMine) {
        alert("GAME OVER!!!");
        // 게임 오버 처리
    } else if (!isOpen && !isFlag && !isQMark && !isMine) {
        let mineCount = 0;
        for (let i = 0; i < aroundArr.length; i++) {
            const aroundTile = tdArr[aroundArr[i]];
            if (aroundTile.classList.contains("mine")) {
                mineCount++;
            }
        }

        tile.dataset.isOpen = "true"; // 타일을 열었음을 표시

        if (mineCount > 0) {
            tile.style.color = COLOR[mineCount - 1];
            tile.style.backgroundColor = "rgb(255, 255, 240)"
            tile.style.textAlign = "center";
            tile.style.fontWeight = "bold";
            tile.innerHTML = mineCount;
        } else {
            tile.style.backgroundColor = "rgb(255, 255, 240)";
            // 주변 지뢰가 없을 경우 .
            for (let i = 0; i < aroundArr.length; i++) {
                const aroundTile = aroundArr[i];
                if (tdArr[aroundTile].dataset.isOpen !== "true") {
                    clickTile(aroundTile, getAroundArr(aroundTile));
                }
            }
        }
    }
}


function tileEvent(targetNum, aroundArr) {
    const tile = tdArr[targetNum];
    const isOpen = tile.dataset.isOpen === "true"; // 이미 열려있는 타일인지 확인
    const isFlag = tile.classList.contains("flag"); // 깃발
    const isQMark = tile.classList.contains("qmark"); // 물음표
    const isMine = tile.classList.contains("mine");
    const isNumberTile = tile.innerText.trim() !== "" && !isNaN(parseInt(tile.innerText)); // 숫자가 표시된 타일인지 확인
    let rightClickState = 0; // 0: 아무것도 없음, 1: 깃발, 2: 물음표

    tile.addEventListener("click", function (e) {
        if (e.button === 0) { // 왼쪽 클릭
            clickTile(targetNum, aroundArr);

        }
    });


    tile.addEventListener("contextmenu", function (e) {
        e.preventDefault(); // 우클릭 설정창 표시 안되게
        if (e.button === 2) {
            if (!isOpen && !isFlag && !isQMark && !isNumberTile) { // 추가 조건: !isNumberTile
                if (rightClickState === 0) {
                    rightClickState = 1;
                    tile.classList.add("flag");
                    tile.innerHTML = "🚩";
                } else if (rightClickState === 1) {
                    rightClickState = 2;
                    tile.classList.remove("flag");
                    tile.classList.add("qmark");
                    tile.innerHTML = "❓";
                } else if (rightClickState === 2) {
                    rightClickState = 0;
                    tile.classList.remove("qmark");
                    tile.innerHTML = "";
                }
            }
            checkWinCondition();
        }
    });
}

function checkWinCondition() { // 승리
    const mineTiles = document.querySelectorAll('.mine'); // 지뢰 타일 위치
    const flaggedTiles = document.querySelectorAll('.mine.flag'); // 깃발 위치
    const flagCnt = document.querySelectorAll('.flag');
    const qMark = document.querySelectorAll('.qMark');

    if (mineTiles.length === flaggedTiles.length && mineTiles.length === flagCnt.length && qMark.length === 0) {
        alert("게임 승리 ^_^ \n 멋진걸~ '^'");
    }
}

function restart() { //나가기
    window.location.reload();
}


/*
function restartBtnCss(btn) {
    btn.style.display = "block";
    btn.style.position = "relative";
    btn.style.width = "120px";
    btn.style.height = "50px";
    btn.style.padding = "0px";
    btn.style.fontWeight = "600";
    btn.style.textAlign = "center";
    btn.style.lineHeight = "50px";
    btn.style.color = "#000";
    btn.style.borderRadius = "5px";
    btn.style.transition = "all 0.3s";
    btn.style.backgroundColor = "rgb(237, 237, 207)";
    btn.style.border = "0px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0px 5px 0px 0px #c9b687";

    btn.addEventListener('mouseenter', function () {
        btn.style.marginTop = '5px';
        btn.style.marginBottom = '5px';
        btn.style.boxShadow = '0px 0px 0px 0px rgb(237, 237, 207)';
    });

    // 마우스가 요소를 떠날 때
    btn.addEventListener('mouseleave', function () {
        btn.style.marginTop = '0px'; // 원래 값으로 변경
        btn.style.marginBottom = '0px'; // 원래 값으로 변경
        btn.style.boxShadow = "0px 5px 0px 0px #c9b687";
    });
}*/