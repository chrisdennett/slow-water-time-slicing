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
let videoDimensions = { width: 480, height: 270 }; // tv res divided by 4 // 1.778
// let videoDimensions = { width: 1280, height: 720 }; // tv res divided by 4

// global defaults
const sliceArray = [];
let currMinHue = params.minHue.value; //176;
let currMaxHue = params.maxHue.value; //257;
const reflectDown = false;
const artCanvasHeight = reflectDown
  ? Math.round(videoDimensions.height * 2.1)
  : videoDimensions.height;

const artCanvasWidth = reflectDown
  ? videoDimensions.width
  : videoDimensions.width;

let gapAfterReflectingCanvas =
  (artCanvasHeight - videoDimensions.height * 2) / 2;
// offset from the top

let count = parseInt(params.minHue.value);
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
  const frameCanvas = getFlippedVideoCanvas(
    video,
    videoDimensions,
    count,
    params.useTint.value
  );

  if (params.useTint.value) {
    count += inc;
    if (currMinHue !== parseInt(params.minHue.value)) {
      currMinHue = parseInt(params.minHue.value);
      count = currMinHue;
    }

    if (currMaxHue !== parseInt(params.maxHue.value)) {
      currMaxHue = parseInt(params.maxHue.value);
      count = currMinHue;
    }

    if (count > params.maxHue.value || count < params.minHue.value) inc = -inc;
  }

  if (artCanvas.width !== frameCanvas.width) {
    artCanvas.width = artCanvasWidth;
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
    params.reflectSides.value,
    reflectDown,
    params.useSideSlice.value
  );

  window.requestAnimationFrame(draw);
}

function drawTimeSlicedCanvas(
  sliceArray,
  canvasDimensions,
  alpha,
  reflectSides,
  reflectDown = false,
  useSideSlice
) {
  const { w, h } = canvasDimensions;
  const sliceH = h / sliceArray.length;
  const sliceW = w / sliceArray.length;

  const offCanvasH = reflectDown ? h * 2 : h;

  if (offscreenCanvas.width !== w || offscreenCanvas.height !== offCanvasH) {
    offscreenCanvas.width = w;
    offscreenCanvas.height = offCanvasH;
  }

  osCtx.globalAlpha = alpha;

  const halfW = w / 2;

  for (let i = 0; i < sliceArray.length; i++) {
    if (useSideSlice) {
      const xPos = i * sliceW;
      osCtx.drawImage(sliceArray[i], xPos, 0, sliceW, h, xPos, 0, sliceW, h);
    } else {
      const yPos = i * sliceH;
      osCtx.drawImage(sliceArray[i], 0, yPos, w, sliceH, 0, yPos, w, sliceH);
    }
  }

  // REFLECT LEFT Half of canvas to RIGHT
  if (reflectSides) {
    osCtx.save();
    osCtx.translate(w, 0);
    osCtx.scale(-1, 1);
    osCtx.drawImage(offscreenCanvas, 0, 0, halfW, h, 0, 0, halfW, h);
    osCtx.restore();
  }

  // REFLECT entire canvas below
  if (reflectDown) {
    osCtx.save();
    osCtx.translate(0, h);
    osCtx.scale(1, -1);
    osCtx.drawImage(offscreenCanvas, 0, 0, w, h, 0, -h, w, h);
    osCtx.restore();
    // half the space remaining in art canvas
    ctx.drawImage(offscreenCanvas, 0, 0, w, 1, 0, 0, w, artCanvasHeight);
    ctx.drawImage(offscreenCanvas, 0, gapAfterReflectingCanvas);
  } else {
    ctx.drawImage(offscreenCanvas, 0, 0);
  }
}
