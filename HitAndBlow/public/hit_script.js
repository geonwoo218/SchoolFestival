
const content = document.getElementById('content');
const startBtn = document.getElementById('start');
const startBg = document.getElementById('startBg');
const colorList = document.getElementById('colorList');
const header = document.querySelector('header');
const htpbg = document.getElementById('htpbg');
const clickSound = document.getElementById('click');
const clickStart = document.getElementById('clickStart');
const clickEnter = document.getElementById('clickEnter');

startBtn.addEventListener('click', GameStart);

function GameStart() { //게임시작
    clickStart.play();
    header.style.display = "none";
    content.style.display = 'flex';
    colorList.style.display = 'block';
    startBtn.style.display = "none";
    startBg.style.display = "none";
}
function howtoplay() { //게임방법 팝업창
    htpbg.style.display = "block";
}
function htpclose() { // 게임방법 팝업창
    htpbg.style.display = "none";
}
function gameRestart() { // 다시시작
    window.location.reload();
}

//색깔 넣기
const colors = ['blue', 'red', 'green', 'yellow', 'pink', 'gray'];
const sets = document.querySelectorAll('.set');

let ColorIndex = 0; // 선택된 색상 인덱스
let selectedPosition = 1; // 선택된 위치
let SetPosition = 0; // 첫번째 set 
let previous; //이전 위치

// 키보드 이벤트 처리
document.addEventListener('keydown', (event) => {
    let selectedSet = sets[SetPosition]; // 현재 선택된 set
    

    switch (event.key) {
        case 'ArrowLeft': // 이전 색상 선택
        clickSound.play();
            ColorIndex = (ColorIndex - 1 + colors.length) % colors.length;
            break;
        case 'ArrowRight': // 다음 색상 선택
        clickSound.play();
            ColorIndex = (ColorIndex + 1) % colors.length;
            break;
        case 'ArrowUp': // 위로 이동
            if (selectedPosition > 1) {
                selectedPosition--;
                previous.textContent = "";
            }
            break;
        case 'ArrowDown': // 아래로 이동
            if (selectedPosition < 4) {
                selectedPosition++;
                previous.textContent = "";
            }
            break;
        case 'Enter': // 다음 위치로 이동
            clickEnter.play();
            let userColored = selectedSet.querySelectorAll(".box");
            let checkfill = true;
            for(let i = 0;i<userColored.length;i++){
                const computedStyle = window.getComputedStyle(userColored[i]);
                const backgroundColor = computedStyle.backgroundColor;

                if (backgroundColor === 'rgb(255, 255, 255)' || backgroundColor === 'white') {
                    checkfill = false;
                    break;
                }
            }
            if (checkfill) {
                if (SetPosition < sets.length) {
                    // 현재 set의 선택된 박스에서 엔터를 누르면 SetPosition을 증가시킴
                    SetPosition++; // 다음 set
                    selectedPosition = 1; // 첫 번째 박스로 이동
                    selectedSet = sets[SetPosition]; // 새로운 set 선택
                    previous.textContent = "";
                    HitandBlow();
                } else {
                    HitandBlow();
                }
            }
    }

    // 선택된 위치를 화면에 표시하고 포커스를 업데이트
    const selectedElement = selectedSet.querySelector(`.box:nth-child(${selectedPosition})`);

    selectedElement.focus();
    selectedElement.textContent = "☜\u00A0\u00A0\u00A0☞";

    // 왼쪽 또는 오른쪽 화살표 키를 누를 때, 배경색 변경
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        selectedElement.style.backgroundColor = colors[ColorIndex];
    }
    previous = selectedElement;
});

//정답 랜덤색넣기
function getRanddomColor() {
    const randColorIndex = [];

    while (randColorIndex.length < 4) {
        const randIndex = Math.floor(Math.random() * 6);
        if (!randColorIndex.includes(randIndex)) {
            randColorIndex.push(randIndex);
        }
    }
    return randColorIndex.map((ColorIndex) => colors[ColorIndex]);
}

const resultColor = getRanddomColor(); //결과 색

function addResultBox(callback) { //결과 상자에 색 추가
    const resultBox = document.querySelector('.resultbox');
    const resultBoxes = resultBox.querySelectorAll('.box');
    const resultColorList = resultColor;

    resultColorList.forEach((color, index) => {
        setTimeout(() => {
            resultBoxes[index].style.backgroundColor = color;

            if (index === resultColorList.length - 1) {
                // 마지막 박스가 설정되면 콜백 함수 호출
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }, index * 1000);
    })
}
//hit and blow 처리
function HitandBlow() {
    let selectset = sets[SetPosition - 1]; // 현재 선택된 set
    const colorContainer = selectset.querySelector('.colorContainer');
    const colorboxes = colorContainer.querySelectorAll('.box');
    let userColor = []; //사용자색

    colorboxes.forEach((box) => { //사용자 색상 배열
        const backgroundColor = box.style.backgroundColor;
        if (backgroundColor) {
            userColor.push(backgroundColor);
        }
    });

    console.log("사용자 " + userColor);
    console.log('결과 ' + resultColor);

    let hit = 0, blow = 0;
    const checkColor = userColor.filter((i, index, self) => self.indexOf(i) === index); //사용자 중복색제거
    for (let i = 0; i < checkColor.length; i++) {
        if (resultColor.includes(checkColor[i])) {
            blow++;
        }
    }
    console.log("hit 전 blow " + blow);

    for (let i = 0; i < userColor.length; i++) {
        if (userColor[i] === resultColor[i]) {
            hit++;
            blow--;
        }
    }

    console.log("hit " + hit + "blow " + blow);
    //hb 색추가
    const hbContainer = selectset.querySelector('.hbContainer');
    const hbbox = hbContainer.querySelectorAll('.hbbox');
    let index = 0;
    for (let i = 0; i < hit; i++) {
        hbbox[index++].style.backgroundColor = 'red';
    }
    for (let i = 0; i < blow; i++) {
        hbbox[index++].style.backgroundColor = "yellow";
    }

    console.log("============================================");
    if (hit === 4) {
        addResultBox(gameWin);
    }
    if (SetPosition === sets.length) {
        gameCheck(hit);
    }
}


function gameCheck(hit) {
    if (hit === 4) {
        addResultBox(gameWin);
    } else {
        addResultBox(gameOver);
    }
}
const gameWinmsg = document.getElementById('gameWin');
const gameOvermsg = document.getElementById('gameOver');


function gameWin() {
    setTimeout(() => {
        gameWinmsg.style.display = "block";
    }, 1000);
}

function gameOver() {
    setTimeout(() => {
        gameOvermsg.style.display = "block";
    }, 1000);
}

