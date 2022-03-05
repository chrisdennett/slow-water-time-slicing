var bubbleCount = 50;
var bubbleField = document.getElementById("bubble-field");

var spacingPercent = 100 / bubbleCount;

//generate bubbles with randomly timed animation durations
for (i = 0; i < bubbleCount; i++) {
  var randNum = Math.floor(Math.random() * 20) + 1;
  var animDur = 2 + 0.5 * randNum;
  moveEl = document.createElement("div");
  moveEl.setAttribute("class", "bubble-rise");
  moveEl.setAttribute(
    "style",
    `animation-duration: ${animDur}s; left:${spacingPercent * i}%;`
  );

  bubbleEl = document.createElement("div");
  bubbleEl.setAttribute("class", "bubble");
  bubbleElContent = document.createTextNode("");
  bubbleEl.appendChild(bubbleElContent);

  const bubbleSize = Math.round(2 + Math.random() * 3);
  bubbleEl.setAttribute(
    "style",
    `width: ${bubbleSize}px; height:${bubbleSize}px;`
  );

  moveEl.appendChild(bubbleEl);
  bubbleField.appendChild(moveEl);
}
