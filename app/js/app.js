import { getFlippedVideoCanvas } from "./utils/getFlippedVideoCanvas.js";
import { initControls } from "./controls.js";

// TV is 1920x1080

// app elements
const appElement = document.querySelector("#app");
const controls = document.querySelector("#controls");
const artCanvas = document.querySelector("#artCanvas");
const video = document.querySelector("#videoElement");

// set up controls
const params = initControls(controls);

// let videoDimensions = { width: 1920, height: 1080 };
// let videoDimensions = { width: 640, height: 360 };
let videoDimensions = { width: 480, height: 270 }; // tv res divided by 4

// global defaults
const sliceArray = [];
const minHue = 25; //176;
const maxHue = 47; //257;
const artCanvasHeight = Math.round(videoDimensions.height * 2.5);
const gapAfterReflectingCanvas = artCanvasHeight - videoDimensions.height * 2;
let count = minHue;
let inc = 0.1;

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
    artCanvas.height = artCanvasHeight;
  }

  sliceArray.unshift(frameCanvas);

  while (sliceArray.length > params.totalSlices.value) {
    sliceArray.pop();
  }

  drawTimeSlicedCanvas(
    sliceArray,
    { w: frameCanvas.width, h: frameCanvas.height },
    params.alpha.value,
    params.reflectSides.value
  );

  window.requestAnimationFrame(draw);
}

function drawTimeSlicedCanvas(
  sliceArray,
  canvasDimensions,
  alpha,
  reflectSides,
  reflectDown = true
) {
  const { w, h } = canvasDimensions;
  const sliceH = h / sliceArray.length;

  if (offscreenCanvas.width !== w || offscreenCanvas.height !== h * 2) {
    offscreenCanvas.width = w;
    offscreenCanvas.height = h * 2;
  }

  osCtx.globalAlpha = alpha;

  const halfW = w / 2;

  for (let i = 0; i < sliceArray.length; i++) {
    // const y = i * sliceH;
    const y = i * sliceH;

    if (reflectSides) {
      osCtx.drawImage(sliceArray[i], 0, y, halfW, sliceH, 0, y, halfW, sliceH);
    } else {
      osCtx.drawImage(sliceArray[i], 0, y, w, h, 0, y, w, h);
    }
  }

  // ctx.fillStyle = "yellow";
  // ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  if (reflectSides) {
    osCtx.save();
    osCtx.translate(w, 0);
    osCtx.scale(-1, 1);
    osCtx.drawImage(offscreenCanvas, 0, 0, halfW, h, 0, 0, halfW, h);
    osCtx.restore();
  }

  if (reflectDown) {
    osCtx.save();
    osCtx.translate(0, h);
    osCtx.scale(1, -1);
    osCtx.drawImage(offscreenCanvas, 0, 0, w, h, 0, -h, w, h);
    osCtx.restore();
  }

  // half the space remaining in art canvas
  ctx.drawImage(offscreenCanvas, 0, 0, w, 1, 0, 0, w, artCanvasHeight);
  ctx.drawImage(offscreenCanvas, 0, gapAfterReflectingCanvas);
}
