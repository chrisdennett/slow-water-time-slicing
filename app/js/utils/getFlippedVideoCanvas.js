export function getFlippedVideoCanvas(video, videoDimensions, count, useTint) {
  const frameCanvas = document.createElement("canvas");

  const { width: w, height: h } = videoDimensions;

  frameCanvas.width = videoDimensions.width;
  frameCanvas.height = videoDimensions.height;

  const frameCtx = frameCanvas.getContext("2d", { alpha: false });
  frameCtx.translate(frameCanvas.width, 0);
  frameCtx.scale(-1, 1);

  if (useTint) {
    frameCtx.fillStyle = `hsla(${count}, 64%, 40%, 0.95)`;
  }
  frameCtx.drawImage(video, 0, 10, w - 25, h - 14, 0, 0, w, h);
  if (useTint) {
    frameCtx.globalCompositeOperation = "color";
    frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);
  }
  // const tallCanvas = document.createElement("canvas");

  // tallCanvas.width = frameCanvas.height;
  // tallCanvas.height = frameCanvas.width;

  // const tallCtx = tallCanvas.getContext("2d");
  // tallCtx.fillStyle = "yellow";
  // tallCtx.fillRect(10, 10, tallCanvas.width - 20, tallCanvas.height - 20);

  // tallCtx.translate(tallCanvas.width, 0);
  // tallCtx.rotate((90 * Math.PI) / 180);
  // tallCtx.drawImage(frameCanvas, 0, 0);

  return frameCanvas;
}
