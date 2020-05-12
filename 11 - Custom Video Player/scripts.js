const player = document.querySelector(".player");
const viewer = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const playButton = player.querySelector(".toggle");
const fullScreen = player.querySelector(".fullscreen");
const sliders = player.querySelectorAll(".player__slider");
const skipButtons = player.querySelectorAll("[data-skip");

function togglePlay() {
  if (viewer.paused) {
    viewer.play();
  } else {
    viewer.pause();
  }
}

function toggleButton() {
  playButton.textContent = this.paused ? "►" : "❚ ❚";
}

function handleSkip() {
  viewer.currentTime += Number(this.dataset.skip);
}

function updateSlider() {
  viewer[this.name] = Number(this.value);
}

function updateProgress() {
  const percent = (viewer.currentTime / viewer.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const newValue = (e.offsetX / progress.offsetWidth) * viewer.duration;
  viewer.currentTime = newValue;
}

function handleFullScreen() {
  if (viewer.requestFullscreen) {
    viewer.requestFullscreen();
  }
}

let isMouseDown = false;
viewer.addEventListener("click", togglePlay);
viewer.addEventListener("timeupdate", updateProgress);
playButton.addEventListener("click", togglePlay);
viewer.addEventListener("play", toggleButton);
viewer.addEventListener("pause", toggleButton);
skipButtons.forEach(button => button.addEventListener("click", handleSkip));
sliders.forEach(slider => slider.addEventListener("change", updateSlider));
progress.addEventListener("mousedown", () => isMouseDown = true);
progress.addEventListener("mouseup", () => isMouseDown = false);
progress.addEventListener("mousemove", (e) => isMouseDown && scrub(e));
fullScreen.addEventListener("click", handleFullScreen);