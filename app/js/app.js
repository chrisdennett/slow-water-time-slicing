import { getFlippedVideoCanvas } from "./utils/getFlippedVideoCanvas.js";
import { initControls } from "./controls.js";
import { drawTimeSlicedCanvas } from "./utils/drawTimeSlicedCanvas.js";
import { startWebcam } from "./utils/startWebcam.js";

// TV is 1920x1080
const webcamRes = { w: 640, h: 360 };
// let videoDimensions = { width: 1920, height: 1080 };
// let videoDimensions = { width: 640, height: 360 };
let videoDimensions = { width: 480, height: 270 }; // tv res divided by 4 // 1.778
// let videoDimensions = { width: 1280, height: 720 }; // tv res divided by 4

// app elements
// const appElement = document.querySelector("#app");
const controls = document.querySelector("#controls");
const artCanvas = document.querySelector("#artCanvas");
const webcam1Elem = document.querySelector("#webcam1Elem");
// const webcam2Elem = document.querySelector("#webcam2Elem");
const webcam1 = await startWebcam(webcam1Elem, videoDimensions, 0);
// const webcam2 = await startWebcam(webcam2Elem, videoDimensions, 1);

let currWebcam = webcam1;

// set up controls
const params = initControls(controls);

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
  // appElement.addEventListener("contextmenu", onAppRightClick);
  controls.style.display = "none";

  // keyboard controls
  document.addEventListener("keydown", (e) => {
    // if (e.key === "w") {
    //   currWebcam = currWebcam === webcam1 ? webcam2 : webcam1;
    // }

    if (e.key === "r") {
      location.reload();
    }

    if (e.key === "x") {
      toggleControls();
    }
  });
}

function toggleControls() {
  if (controls.style.display === "none") {
    controls.style.display = "inherit";
  } else {
    controls.style.display = "none";
  }
}

// draw loop
export function draw() {
  const frameCanvas = getFlippedVideoCanvas({
    video: currWebcam,
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
