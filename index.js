const checkbox = document.querySelector(".menu-toggler");
const infobar = document.querySelectorAll('.infobar');

checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
        infobar.forEach(function (i) {
            setTimeout(() => {
                i.style.display = 'block';
                t++;
            }, 1000);

        });
    } else {

        i.style.display = 'none`';

    }
});