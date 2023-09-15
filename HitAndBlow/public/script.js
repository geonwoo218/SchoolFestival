
const content = document.getElementById('content');
const startBtn = document.getElementById('start');
const startBg = document.getElementById('startBg');
const colorList = document.getElementById('colorList');
const header = document.querySelector('header');
const htpbg = document.getElementById('htpbg');


startBtn.addEventListener('click', GameStart);

function GameStart() { //게임시작
    header.style.display = "none";
    content.style.display = 'flex';
    colorList.style.display = 'block';
    startBtn.style.display = "none";
    startBg.style.display = "none";
    addResultBox();
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
let selectedPosition = 1; // 선택된 위치 (1-1)
let SetPosition = 0; // 첫번째 set 

// 키보드 이벤트 처리
document.addEventListener('keydown', (event) => {
    let selectedSet = sets[SetPosition]; // 현재 선택된 set

    switch (event.key) {
        case 'ArrowLeft': // 이전 색상 선택
            ColorIndex = (ColorIndex - 1 + colors.length) % colors.length;
            break;
        case 'ArrowRight': // 다음 색상 선택
            ColorIndex = (ColorIndex + 1) % colors.length;
            break;
        case 'ArrowUp': // 위로 이동
            if (selectedPosition > 1) {
                selectedPosition--;
            }
            break;
        case 'ArrowDown': // 아래로 이동
            if (selectedPosition < 4) {
                selectedPosition++;
            }
            break;
        case 'Enter': // 다음 위치로 이동
        if (SetPosition < sets.length-2) {
            // 현재 set의 선택된 박스에서 엔터를 누르면 SetPosition을 증가시킴
            SetPosition++; // 다음 set
            selectedPosition = 1; // 첫 번째 박스로 이동
            selectedSet = sets[SetPosition]; // 새로운 set 선택
        }
  
        HitandBlow();
    }

    // 선택된 위치를 화면에 표시하고 포커스를 업데이트
    const selectedElement = selectedSet.querySelector(`.box:nth-child(${selectedPosition})`);
    selectedElement.focus();
    // 현재 set 내의 모든 박스에서 텍스트 제거
    selectedSet.querySelectorAll('.box').forEach(box => {
        box.textContent = '';
    });

    // 첫 번째 박스에 ☜\u00A0\u00A0\u00A0☞ 표시
    if (selectedPosition === 1) {
        selectedElement.textContent = "☜\u00A0\u00A0\u00A0☞";
    }

    // 왼쪽 또는 오른쪽 화살표 키를 누를 때, 배경색 변경
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        selectedElement.style.backgroundColor = colors[ColorIndex];
    }
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

function addResultBox() {
    const resultBox = document.querySelector('.resultbox');
    const resultBoxes = resultBox.querySelectorAll('.box');

    resultColor.forEach((color, index) => {
        resultBoxes[index].style.backgroundColor = color;
    });
}

//hit and blow 처리
function HitandBlow() {
    let selectset = sets[SetPosition-1]; // 현재 선택된 set
    const colorContainer = selectset.querySelector('.colorContainer');
    const colorboxes = colorContainer.querySelectorAll('.box');
    let userColor = [];

    colorboxes.forEach((box) => { //사용자 색상 배열
        const backgroundColor = box.style.backgroundColor;
        if (backgroundColor) {
            userColor.push(backgroundColor);
        }
    });

console.log("사용자 "+userColor);
console.log('결과 '+resultColor);

    let hit = 0, blow = 0;
    const checkColor = userColor.filter((i, index, self) => self.indexOf(i) === index); //사용자 중복색제거

    for (let i = 0; i < 4; i++) {
        if (checkColor[i] === resultColor[i]) {
            hit++;
        } else if (resultColor.includes(checkColor[i]) && checkColor.indexOf(checkColor[i]) !== i) {
            blow++;
        }
    }
    console.log("hit "+hit);
    console.log("blow "+blow);
    //hb 색추가
    const hbContainer = document.querySelector('.hbContainer');
    const hbbox = hbContainer.querySelectorAll('.hbbox');
    let index = 0;
    for (let i = 0; i < hit; i++) {
        hbbox[index++].style.backgroundColor = 'red';
    }
    for (let i = 0; i < blow; i++) {
        hbbox[index++].style.backgroundColor = "yellow";
    }
    if (hit === 4) {
        alert("게임 승리");
    }
}




