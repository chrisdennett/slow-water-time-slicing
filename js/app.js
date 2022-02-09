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
let totalSlices = 100;
const sliceArray = [];
let count = 0;
let videoDimensions = { width: 1280, height: 720 };

// set up controls, webcam etc
export function setup() {
  // hide controls by default and if app is right clicked
  appElement.addEventListener("contextmenu", onAppRightClick);
  // controls.style.display = "none";

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
  count += 1;

  if (artCanvas.width !== frameCanvas.width) {
    artCanvas.width = frameCanvas.width;
    artCanvas.height = frameCanvas.height;
  }

  sliceArray.unshift(frameCanvas);

  if (sliceArray.length >= params.totalSlices.value) {
    sliceArray.length = params.totalSlices.value;
  }

  drawTimeSlicedCanvas(artCanvas, sliceArray, videoDimensions);

  window.requestAnimationFrame(draw);
}

function drawTimeSlicedCanvas(targ, sliceArray, videoDimensions) {
  const ctx = targ.getContext("2d");
  const sliceHeight = videoDimensions.height / sliceArray.length;

  for (let i = 0; i < sliceArray.length; i++) {
    ctx.drawImage(
      sliceArray[i],
      0,
      i * sliceHeight,
      videoDimensions.width,
      sliceHeight,
      0,
      i * sliceHeight,
      videoDimensions.width,
      sliceHeight
    );
  }
}
