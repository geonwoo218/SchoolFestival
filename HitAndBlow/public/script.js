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

let ColorIndex = 0; // 선택된 색상 인덱스
let selectedPosition = 1; // 선택된 위치 (1-1)

// 1-1에 포커스를 초기 설정
const FocusElement = document.querySelector('.box:nth-child(1)');
FocusElement.focus();
FocusElement.textContent = "☜\u00A0\u00A0\u00A0☞";
let previousElement = FocusElement;

// 키보드 이벤트 처리
document.addEventListener('keydown', (event) => {
    previousElement.textContent = '';

    switch (event.key) {
        case 'ArrowLeft': // 왼쪽 화살표 키를 누를 때, 이전 색상 선택
            ColorIndex = (ColorIndex - 1 + colors.length) % colors.length;
            break;
        case 'ArrowRight': // 오른쪽 화살표 키를 누를 때, 다음 색상 선택
            ColorIndex = (ColorIndex + 1) % colors.length;
            break;
        case 'ArrowUp':// 위 화살표 키를 누를 때, 위치를 위로 이동
            if (selectedPosition > 1) {
                selectedPosition--;
            }
            break;
        case 'ArrowDown':// 아래 화살표 키를 누를 때, 위치를 아래로 이동
            if (selectedPosition < 4) {
                selectedPosition++;
            }
            break;
    }

    // 선택된 위치를 화면에 표시하고 포커스를 업데이트
    const selectedElement = document.querySelector(`.box:nth-child(${selectedPosition})`);
    selectedElement.focus();
    selectedElement.textContent = "☜\u00A0\u00A0\u00A0☞";
    previousElement = selectedElement;

});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
            // 왼쪽 또는 오른쪽 화살표 키를 누를 때, 배경색 변경
            const selectedElement = document.querySelector(`.box:nth-child(${selectedPosition})`);
            selectedElement.style.backgroundColor = colors[ColorIndex];
            break;
    }
});

//정답 랜덤색넣기
function getRanddomColor(){
    const randColorIndex = [];
    while(randColorIndex.length < 4){
        const randIndex = Math.floor(Math.random()*6);
        if(!randColorIndex.includes(randIndex)){
            randColorIndex.push(randIndex);
        }
    }
    return randColorIndex.map((ColorIndex)=> colors[ColorIndex]);
}

function addResultBox(){
    const resultBox = document.querySelector('.resultbox');
    const Cindex = getRanddomColor();
    const resultBoxes = resultBox.querySelectorAll('.box');
    console.log(Cindex);

    Cindex.forEach((color,index)=>{
        resultBoxes[index].style.backgroundColor = color;
    });
}

//hit and blow 처리
function HitandBlow(){
    const colorContainer = document.querySelector('.colorContainer');
    const colorbox = colorContainer.querySelectorAll('.box');

    if(colorbox.backgroundColor !== '#dcdcdc'){
        //resultbox랑 색 비교
    }
}



