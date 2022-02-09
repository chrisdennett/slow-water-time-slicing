import { drawRoundSlitScanToCanvas } from "./utils/drawRoundSlitScanToCanvas.js";
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
let lastDrawTime = null;
let totalSlices = 100;
const sliceArray = [];
let count = 0;
let sliceHeight;

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
        video: { width: 320, height: 240 },
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
  const { msPerFrame } = params;

  const timeStamp = Date.now();

  let drawSlice = false;

  if (!lastDrawTime || timeStamp - lastDrawTime >= msPerFrame.value) {
    lastDrawTime = timeStamp;
    drawSlice = true;
  }

  const frameCanvas = getFlippedVideoCanvas(video, count);
  count += 1;

  sliceArray.unshift(frameCanvas);
  sliceHeight = frameCanvas.height / sliceArray.length;

  if (sliceArray.length >= totalSlices) {
    sliceArray.pop();
  }

  const ctx = artCanvas.getContext("2d");

  for (let i = 0; i < sliceArray.length; i++) {
    ctx.drawImage(
      sliceArray[i],
      0,
      i * sliceHeight,
      frameCanvas.width,
      sliceHeight,
      0,
      i * sliceHeight,
      frameCanvas.width,
      sliceHeight
    );
  }

  window.requestAnimationFrame(draw);
}
