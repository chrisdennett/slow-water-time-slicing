export function drawRoundSlitScanToCanvas({ src, target, drawSlice, params }) {
  const { scanStartPos, isReflected, sliceSize } = params;
  const sliceSizeInt = parseInt(sliceSize.value);

  const srcSectionH = scanStartPos.value * src.height;
  const scale = target.width / src.width;
  const liveWebcamSectionH = srcSectionH * scale;

  drawLiveWebcamSectionInMiddle({
    src,
    target,
    isReflected: isReflected.value,
    srcSectionH,
    liveWebcamSectionH,
    sliceSize: sliceSizeInt,
    drawSlice,
  });
}

function drawLiveWebcamSectionInMiddle({ target, src, sliceSize, drawSlice }) {
  const ctx = target.getContext("2d");

  const centerX = target.width / 2;
  const centerY = target.height / 2;

  const outputRadius = 100;
  const hToWRatio = src.width / src.height;
  const outputHeight = outputRadius * 2;
  const outputWidth = outputHeight * hToWRatio;

  const sideLength = 76.537; // 2 * outputRadius * Math.sin(degrees_to_radians(22.5));

  if (drawSlice) {
    ctx.save();
    ctx.translate(centerX, centerY);
    // source coords aren't affected by translated, but targ are
    ctx.drawImage(
      target,
      centerX - sideLength / 2,
      0,
      sideLength,
      centerY - sideLength,
      0 - sideLength / 2,
      0 - (centerY + sliceSize),
      sideLength,
      centerY - sideLength
    );
    ctx.restore();
  }

  ctx.save();
  ctx.beginPath();
  ctx.translate(centerX, centerY);
  drawOctagon(outputRadius, ctx);
  ctx.clip();

  ctx.drawImage(
    src,
    0,
    0,
    src.width,
    src.height,
    -outputWidth / 2,
    -outputHeight / 2,
    outputWidth,
    outputHeight
  );

  ctx.restore();
}

// function degrees_to_radians(degrees) {
//   var pi = Math.PI;
//   return degrees * (pi / 180);
// }

// https://stackoverflow.com/questions/4839993/how-to-draw-polygons-on-an-html5-canvas
function regPolyPath(r, p, ctx) {
  //Radius, #points, context --- Azurethi was here!
  const rot = 0.785398; //(2 * Math.PI) / p;

  ctx.moveTo(r, 0);
  for (let i = 0; i < p + 1; i++) {
    ctx.rotate(rot);
    ctx.lineTo(r, 0);
  }
  ctx.rotate((-2 * Math.PI) / p);
}

function drawOctagon(r, ctx) {
  const rot = 0.392699; //(2 * Math.PI) / 16;
  // console.log("rot: ", rot);
  ctx.rotate(rot);
  regPolyPath(r, 8, ctx);
  ctx.rotate(-rot);
}

// function drawOctagonSides(r, ctx) {
//   const rot = (2 * Math.PI) / 16;

//   ctx.rotate(rot);

//   regPolyEdges(r, 8, ctx);

//   ctx.rotate(-rot);
// }

// function regPolyEdges(r, p, ctx) {
//   //Radius, #points, context --- Azurethi was here!
//   const rot = (2 * Math.PI) / p;

//   for (let i = 0; i < p + 1; i++) {
//     ctx.beginPath();
//     ctx.moveTo(r, 0);

//     ctx.rotate(rot);
//     ctx.strokeStyle = `hsla(${Math.random() * 360}, 64%, 45%, 0.95)`;

//     ctx.lineTo(r, 0);
//     ctx.stroke();
//   }
//   ctx.rotate((-2 * Math.PI) / p);
// }
