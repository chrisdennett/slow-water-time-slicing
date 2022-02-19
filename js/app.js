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
const minHue = 176;
const maxHue = 257;
let count = minHue;
let inc = 0.5;

// let videoDimensions = { width: 1280, height: 600 };
let videoDimensions = { width: 640, height: 300 };
// let videoDimensions = { width: 440, height: 200 };

const offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = videoDimensions.width;
offscreenCanvas.height = videoDimensions.height;
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

  drawTimeSlicedCanvas(sliceArray, videoDimensions, params.alpha.value);

  window.requestAnimationFrame(draw);
}

function drawTimeSlicedCanvas(sliceArray, videoDimensions, alpha) {
  const h = videoDimensions.height / sliceArray.length;
  const w = videoDimensions.width;

  osCtx.globalAlpha = alpha;

  for (let i = 0; i < sliceArray.length; i++) {
    const y = i * h;
    // osCtx.drawImage(sliceArray[i], 0, y);
    osCtx.drawImage(sliceArray[i], 0, y, w, h, 0, y, w, h);
  }

  ctx.drawImage(offscreenCanvas, 0, 0);
}
