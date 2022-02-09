export function getFlippedVideoCanvas(video, count) {
  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = 320;
  frameCanvas.height = 240;
  const frameCtx = frameCanvas.getContext("2d");
  frameCtx.translate(frameCanvas.width, 0);
  frameCtx.scale(-1, 1);

  // frameCtx.fillStyle = `hsla(${count}, 64%, 45%, 0.95)`;
  frameCtx.drawImage(video, 0, 0);
  // frameCtx.globalCompositeOperation = "color";
  // frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);

  return frameCanvas;
}
