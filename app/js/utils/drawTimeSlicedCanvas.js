export function drawTimeSlicedCanvas({
  offscreenCanvas,
  osCtx,
  ctx,
  sliceArray,
  totalSlices,
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

  // only used for grid option
  const cell = { w, h, x: 0, y: 0 };

  // if jitter randomly sort the array each time
  // disjointed only randomises once so it's consistantly showing one frame
  if (effectType === "jitter") {
    sliceArray.sort(() => Math.random() - 0.5);
  } else if (effectType === "grid") {
    // offscreenCanvas.width = w * 2;
    // offscreenCanvas.height = h * 2;
    const cellSize = calculateCellSize(
      totalSlices,
      offscreenCanvas.width,
      offscreenCanvas.height
    );
    cell.w = cellSize.w;
    cell.h = cellSize.h;
  }

  for (let i = 0; i < sliceArray.length; i++) {
    // if disjointed get a random slice
    const sliceIndex =
      effectType === "disjointed" && disjointedOrder ? disjointedOrder[i] : i;

    // Vertical slices
    if (useSideSlice) {
      const xPos = i * sliceW;
      drawSlice({
        ctx: osCtx,
        src: sliceArray[sliceIndex],
        srcX: xPos,
        srcY: 0,
        srcW: sliceW,
        srcH: h,
        destX: xPos,
        destY: 0,
        destW: sliceW,
        destH: h,
      });
    } else if (effectType === "grid") {
      // draw all slices as a full grid of images
      drawSlice({
        ctx: osCtx,
        src: sliceArray[sliceIndex],
        srcX: 0,
        srcY: 0,
        srcW: w,
        srcH: h,
        destX: cell.x,
        destY: cell.y,
        destW: cell.w,
        destH: cell.h,
      });

      cell.x += cell.w;

      if (cell.x + cell.w > offscreenCanvas.width) {
        cell.x = 0;
        cell.y += cell.h;
      }
    } else {
      // Horizontal slices
      const yPos = i * sliceH;
      drawSlice({
        ctx: osCtx,
        src: sliceArray[sliceIndex],
        srcX: 0,
        srcY: yPos,
        srcW: w,
        srcH: sliceH,
        destX: 0,
        destY: yPos,
        destW: w,
        destH: sliceH,
      });
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

function drawSlice({
  ctx,
  src,
  srcX,
  srcY,
  srcW,
  srcH,
  destX,
  destY,
  destW,
  destH,
}) {
  ctx.drawImage(src, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
}

function calculateCellSize(numCells, gridWidth, gridHeight) {
  // Calculate the aspect ratio of the grid
  const aspectRatio = gridHeight / gridWidth;
  const maxCols = Math.ceil(Math.sqrt(numCells));

  const cellWidth = Math.floor(gridWidth / maxCols);
  const cellHeight = cellWidth * aspectRatio;

  return { w: cellWidth, h: cellHeight };
}
