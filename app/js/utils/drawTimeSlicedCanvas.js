export function drawTimeSlicedCanvas({
  offscreenCanvas,
  osCtx,
  ctx,
  sliceArray,
  canvasDimensions,
  alpha,
  reflectSides,
  useSideSlice,
  effectType,
  disjointedOrder,
}) {
  const { w, h } = canvasDimensions;
  const sliceH = h / sliceArray.length;
  const sliceW = w / sliceArray.length;

  if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
  }

  osCtx.globalAlpha = alpha;

  const halfW = w / 2;

  // if jitter
  if (effectType === "jitter") {
    sliceArray.sort(() => Math.random() - 0.5);
  } else if (effectType === "disjointed" && disjointedOrder) {
  }

  for (let i = 0; i < sliceArray.length; i++) {
    const sliceIndex =
      effectType === "disjointed" && disjointedOrder ? disjointedOrder[i] : i;

    if (useSideSlice) {
      const xPos = i * sliceW;
      osCtx.drawImage(
        sliceArray[sliceIndex],
        xPos,
        0,
        sliceW,
        h,
        xPos,
        0,
        sliceW,
        h
      );
    } else {
      const yPos = i * sliceH;
      osCtx.drawImage(
        sliceArray[sliceIndex],
        0,
        yPos,
        w,
        sliceH,
        0,
        yPos,
        w,
        sliceH
      );
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

  ctx.drawImage(offscreenCanvas, 0, 0);
}
