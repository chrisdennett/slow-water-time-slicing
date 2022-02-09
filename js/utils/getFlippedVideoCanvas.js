export function getFlippedVideoCanvas(video, videoDimensions, count) {
  const frameCanvas = document.createElement("canvas");

  frameCanvas.width = videoDimensions.width;
  frameCanvas.height = videoDimensions.height;
  const frameCtx = frameCanvas.getContext("2d", { alpha: false });
  frameCtx.translate(frameCanvas.width, 0);
  frameCtx.scale(-1, 1);

  // frameCtx.fillStyle = `hsla(${count}, 64%, 45%, 0.95)`;
  frameCtx.drawImage(video, 0, 0);
  // frameCtx.globalCompositeOperation = "color";
  // frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);

  return frameCanvas;
}
