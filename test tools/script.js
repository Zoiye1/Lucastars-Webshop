const track = document.querySelector(".slider-track");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

const visibleBoxes = 5;
const boxWidth = 209; // box + margin
const totalBoxes = track.children.length;

let currentIndex = 0;

next.addEventListener("click", () => {
    if (currentIndex < totalBoxes - visibleBoxes) {
        currentIndex++;
        updateSlider();
    }
});

prev.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * boxWidth}px)`;
}
