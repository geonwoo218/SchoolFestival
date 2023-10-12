document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.querySelector(".menu-toggler");
    const infobar = document.querySelectorAll('.infobar');
    const clickSound = document.getElementById('ClickSound');
    const games = document.querySelectorAll('.game');

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            infobar.forEach(function (i) {
                i.style.display = 'block';
                setTimeout(function () {
                    i.style.opacity = '1';
                }, 50);
            });
        } else {
            infobar.forEach(function (i) {
                i.style.opacity = '0';
                setTimeout(function () {
                    i.style.display = 'none';
                }, 500);
            });
        }
    });
    checkbox.addEventListener('click', function () {
        clickSound.play();
    })

    games.forEach(game => {
        game.addEventListener('click', function (event) {
            event.preventDefault();
            clickSound.play();
            const href = this.getAttribute('href');
            window.location.href = href;
        })
    })
})