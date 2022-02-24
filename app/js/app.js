import { getFlippedVideoCanvas } from "./utils/getFlippedVideoCanvas.js";
import { initControls } from "./controls.js";

// app elements
const appElement = document.querySelector("#app");
const controls = document.querySelector("#controls");
const artCanvas = document.querySelector("#artCanvas");
const video = document.querySelector("#videoElement");

// set up controls
const params = initControls(controls);

// global defaults
const sliceArray = [];
const minHue = 25; //176;
const maxHue = 47; //257;
let count = minHue;
let inc = 0.1;

// let videoDimensions = { width: 1920, height: 1080 };
// let videoDimensions = { width: 640, height: 360 };
let videoDimensions = { width: 480, height: 270 };

// 1.78
// 0.56

const offscreenCanvas = document.createElement("canvas");
const osCtx = offscreenCanvas.getContext("2d", { alpha: false });
const ctx = artCanvas.getContext("2d", { alpha: false });

// set up controls, webcam etc
export function setup() {
  // hide controls by default and if app is right clicked
  appElement.addEventListener("contextmenu", onAppRightClick);
  controls.style.display = "none";

  // keyboard controls
  // document.addEventListener("keydown", onKeyDown);

  function onAppRightClick(e) {
    e.preventDefault();
    if (controls.style.display === "none") {
      controls.style.display = "inherit";
    } else {
      controls.style.display = "none";
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: videoDimensions,
      })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.log("video error: ", error);
      });
  }
}

// draw loop
export function draw() {
  const frameCanvas = getFlippedVideoCanvas(video, videoDimensions, count);
  count += inc;

  if (count > maxHue || count < minHue) inc = -inc;

  if (artCanvas.width !== frameCanvas.width) {
    artCanvas.width = frameCanvas.width;
    artCanvas.height = frameCanvas.height;
  }

  sliceArray.unshift(frameCanvas);

  while (sliceArray.length > params.totalSlices.value) {
    sliceArray.pop();
  }

  drawTimeSlicedCanvas(
    sliceArray,
    { w: artCanvas.width, h: artCanvas.height },
    params.alpha.value,
    params.reflectSides.value
  );

  window.requestAnimationFrame(draw);
}

function drawTimeSlicedCanvas(
  sliceArray,
  canvasDimensions,
  alpha,
  reflectSides
) {
  const { w, h } = canvasDimensions;
  const sliceH = h / sliceArray.length;

  if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
  }

  osCtx.globalAlpha = alpha;

  const halfW = w / 2;

  for (let i = 0; i < sliceArray.length; i++) {
    const y = i * sliceH;

    if (reflectSides) {
      osCtx.drawImage(sliceArray[i], 0, y, halfW, sliceH, 0, y, halfW, sliceH);
    } else {
      osCtx.drawImage(sliceArray[i], 0, y, w, h, 0, y, w, h);
    }
  }

  ctx.drawImage(offscreenCanvas, 0, 0);

  if (reflectSides) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(offscreenCanvas, 0, 0, halfW, h, 0, 0, halfW, h);
  }
}
