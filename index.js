const checkbox = document.querySelector(".menu-toggler");
const infobar = document.querySelectorAll('.infobar');

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