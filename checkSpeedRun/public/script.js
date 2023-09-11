var startTime;
var timerInterval;
var gameActive = false;
var leaderboard = [];

window.onload = function(){
    /*var customURL = "CHECK SPEED RUN";
    window.history.pushState({}, document.title, customURL);
    document.getElementById('address-bar').textContent = customURL;*/   //URL 바꾸는건데 보안정책때문에 웹서버 아니면 작동 안함
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || []; // leaderboard 변수 초기화
    showLeaderboard(); // 리더보드 표시 함수 호출
}

//게임 시작 시 초기화면 GUI 숨김
function startGame(){
    var startButton = document.getElementById("startbutton");
    var title = document.getElementById("title");
    var goHome = document.getElementById("back");
    var ld = document.getElementById("leaderboard_wrapper");
    var htp = document.getElementById("HTP");
    var body = document.querySelector("body");
    startButton.style.display = "none";
    title.style.display = "none";
    ld.style.display = "none";
    htp.style.display = "none";
    goHome.style.display = "none";
    body.style.height = "75vh";

    // 게임 시작 시간 기록
    startTime = new Date().getTime();

    // 체크박스 만들기
    for(var i=0; i<20; i++){
        createRandomCheckBox();
    }

    // 체크박스 만들고 타이머 시작
    timerInterval = setInterval(updateTimer, 1); // 0.001초마다 타이머 업데이트
    
    //나중에 게임 끝낼때 false 로 바꿀 예정
    gameActive = true;
}

//랜덤한 크기에 체크박스를 랜덤한 위치에 지정
function createRandomCheckBox(){
    var maxX = window.innerWidth - 40;
    var maxY = window.innerHeight - 40;
    var randomX = Math.floor(Math.random() * maxX);
    var randomY = Math.floor(Math.random() * maxY);
    var randomCm = Math.floor(Math.random() * 20) + 15;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "random_checkbox";
    checkbox.style.position = "absolute";
    checkbox.style.left = randomX + "px";
    checkbox.style.top = randomY + "px";
    checkbox.style.width = randomCm + "px";
    checkbox.style.height = randomCm + "px";

    document.body.appendChild(checkbox);
}

//타이머 계산
function updateTimer() {
    //게임 종료 (false) 면 종료
    if(!gameActive){
    return;
    }

    var currentTime = new Date().getTime();
    var elapsedTime = (currentTime - startTime) / 1000; // 초 단위로 경과 시간 계산
    document.getElementById("timer").textContent = elapsedTime.toFixed(3) + " 초";

    // 모든 체크박스가 체크되었는지 확인
    var checkboxes = document.querySelectorAll(".random_checkbox");
    var allChecked = true;
    for (var i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            allChecked = false;
            break;
        }
    }

    if (allChecked) {
        clearInterval(timerInterval); // 타이머 중지
        gameActive = false; //게임 종료
        var message = "게임 끝!\n"+"걸린 시간: " + elapsedTime.toFixed(3) + " 초";
        alert(message); //게임 끝을 알리고 걸린 시간 표시

        document.getElementById("timer").textContent = ""; //타이머 초기화
        var checkboxes = document.querySelectorAll(".random_checkbox");  //모든 체크박스 선언
        checkboxes.forEach(function(checkbox){
            checkbox.remove(); //지우기
        });
        var startButton = document.getElementById("startbutton");
        startButton.style.display = "block";
        var title = document.getElementById("title");
        title.style.display = "block";
        var ld = document.getElementById("leaderboard_wrapper");
        ld.style.display = "block";
        var htp = document.getElementById("HTP");
        htp.style.display = "block";
        var goHome = document.getElementById("back");
        goHome.style.display = "block";   //게임이 끝난 뒤 GUI 다시 표시
        var body = document.querySelector("body");
        body.style.height = "100%";


        var playerName = prompt("랭킹에 등록하기 위한 이름을 입력하세요 : ","플레이어"); //이름 input
        var rankingData = {name : playerName, time : elapsedTime.toFixed(3)};
        leaderboard.push(rankingData); //리더보드에 rankingData 넣기
        
        showLeaderboard();  //리더보드 보여주기
        playerName = "플레이어";  //prompt 초기값 초기화
    }
}

function showLeaderboard(){  //리더보드 오름차순
    leaderboard.sort(function(a,b){  
        return parseFloat(a.time) - parseFloat(b.time); 
    });

    var leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = "<h2>리더보드</h2>"; //리더보드 글자 표시

    for(var i=0; i<leaderboard.length; i++){  //리더보드 표시하기
        var ranking = i + 1;
        var playerName = leaderboard[i].name;
        var playerTime = leaderboard[i].time;
        var listItem = document.createElement("li");
        listItem.textContent = ranking + ". " + playerName + " - " + playerTime + " 초";
        leaderboardList.appendChild(listItem);
        localStorage.setItem('leaderboard',JSON.stringify(leaderboard));
    }
}

//how to play modal 설정
jQuery(document).ready(function(){
    $('#HTP').click(function(){
        $('body').css('overflow', 'hidden');  //마우스 스크롤 방지
        $('#HTPwin').fadeIn();
    });
    $('#close').click(function(){
        $('body').css('overflow', 'auto');   //마우스 스크롤 방지 해제
        $('#HTPwin').fadeOut();
    });
})
