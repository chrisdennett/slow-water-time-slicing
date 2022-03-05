import { getFlippedVideoCanvas } from "./utils/getFlippedVideoCanvas.js";
import { initControls } from "./controls.js";
import { drawTimeSlicedCanvas } from "./utils/drawTimeSlicedCanvas.js";

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

// global variables
const sliceArray = [];
let currMinHue = params.minHue.value; //176;
let currMaxHue = params.maxHue.value; //257;
let count = parseInt(params.minHue.value);
let inc = 0.1;
let disjointedOrder = null;
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
  const frameCanvas = getFlippedVideoCanvas({
    video,
    videoDimensions,
    count,
    useTint: params.useTint.value,
    flipUpsideDown: params.flipUpsideDown.value,
  });

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
    artCanvas.width = videoDimensions.width;
    artCanvas.height = videoDimensions.height;
  }

  sliceArray.unshift(frameCanvas);

  while (sliceArray.length > params.totalSlices.value) {
    sliceArray.pop();
  }

  if (
    !disjointedOrder ||
    sliceArray.length !== parseInt(params.totalSlices.value) ||
    disjointedOrder.length !== sliceArray.length
  ) {
    disjointedOrder = [...sliceArray.keys()];
    disjointedOrder.sort(() => Math.random() - 0.5);
  }

  drawTimeSlicedCanvas({
    offscreenCanvas,
    osCtx,
    ctx,
    sliceArray,
    canvasDimensions: { w: frameCanvas.width, h: frameCanvas.height },
    alpha: params.alpha.value,
    reflectSides: params.reflectSides.value,
    useSideSlice: params.useSideSlice.value,
    effectType: params.effectType.value,
    disjointedOrder,
  });

  window.requestAnimationFrame(draw);
}
