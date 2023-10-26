document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.querySelector(".menu-toggler");
    const infobar = document.querySelectorAll('.infobar');
    const clickSound = document.getElementById('ClickSound');
    const games = document.querySelectorAll('.game');

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            infobar.forEach(function (i) {
                setTimeout(function () {
                    i.style.opacity = '1';
                }, 200);
            });
        } else if(!checkbox.checked){
            infobar.forEach(function (i) {
                i.style.opacity = '0';
            });
        }
    });
    checkbox.addEventListener('click', function () {
        clickSound.currentTime = 0;
        clickSound.play();
    })

    games.forEach(game => {
        game.addEventListener('click', function (event) {
            event.preventDefault();
            clickSound.currentTime = 0;
            clickSound.play();
            const href = this.getAttribute('href');
            setTimeout(function() {
                window.location.href = href;
            }, 200);
            
        })
    })
})