const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  const options = {
    video: true,
    audio: false
  }
  navigator.mediaDevices.getUserMedia(options)
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => console.error("major malfunction", err));
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data= canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "father-daughters");
  link.innerHTML = `<img src="${data}" alt="Beauties" />`;
  strip.insertBefore(link, strip.firstChild);
}

function paintToCanvas() {
  const {videoWidth: width, videoHeight: height} = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    let pixels = ctx.getImageData(0,0, width, height);

    pixels = flip(pixels, width, height);
    // pixels = rgbSplit(pixels);
    // pixels = greenScreen(pixels);
    // pixels = redEffect(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function getColorIndicesForCoord(x, y, canvasWidth) {
  const red = y * (canvasWidth * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3, red + 4];
}

function flip(pixels, width, height) {
  let flippedPixels = new ImageData(width, height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const [redIndex, greenIndex, blueIndex, alphaIndex] = getColorIndicesForCoord(x, y, width);
      // get the source pixel
      const red = pixels.data[redIndex];
      const green = pixels.data[greenIndex];
      const blue = pixels.data[blueIndex];
      const alpha = pixels.data[alphaIndex];

      // copy to the destination image
      const [flipRedIndex, flipGreenIndex, flipBlueIndex, flipAlphaIndex] = getColorIndicesForCoord((width - x), y, width);
      flippedPixels.data[flipRedIndex] = red;
      flippedPixels.data[flipGreenIndex] = green;
      flippedPixels.data[flipBlueIndex] = blue;
      flippedPixels.data[flipAlphaIndex] = alpha;
    }
  }
  return flippedPixels;
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 800] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 100] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();
video.addEventListener("canplay", paintToCanvas);