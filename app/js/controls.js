// global
export const globalState = { soundStarted: false };

const defaultTotalSlices = localStorage.getItem("totalSlices") || 185;
const defaultAlpha = localStorage.getItem("alpha") || 0.18;

const defaultParams = {
  totalSlices: {
    type: "slider",
    min: 2,
    max: 1000,
    step: 1,
    value: defaultTotalSlices,
  },
  alpha: {
    type: "slider",
    min: 0,
    max: 1,
    step: 0.01,
    value: defaultAlpha,
  },
};
const params = JSON.parse(JSON.stringify(defaultParams));

// function debounce(func, timeout = 300) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, timeout);
//   };
// }

export function initControls(controlsElement) {
  for (let key of Object.keys(params)) {
    const c = params[key];

    let holdingDiv = document.createElement("div");
    holdingDiv.classList = ["control"];

    let labelElement = document.createElement("label");
    labelElement.innerHTML = key + ":";
    labelElement.classList = ["controlLabel"];

    // arr so can extra elements - e.g. for radio butt options
    let inputElements = [];
    let displayCurrentValue = true;
    let valueElement = document.createElement("span");

    if (c.type === "slider") {
      let inputElement = document.createElement("input");
      inputElement.type = "range";
      inputElement.min = c.min;
      inputElement.max = c.max;
      inputElement.step = c.step;
      inputElement.value = c.value;

      inputElement.addEventListener("input", (e) => {
        c.value = e.target.value;
        valueElement.innerHTML = c.value;
        localStorage.setItem(key, c.value);
      });
      inputElements.push(inputElement);
      //
    } else if (c.type === "checkbox") {
      let inputElement = document.createElement("input");
      inputElement.type = "checkbox";
      inputElement.checked = c.value;
      inputElement.addEventListener("input", (e) => {
        c.value = e.target.checked;
        valueElement.innerHTML = c.value;
      });
      inputElements.push(inputElement);
      //
    } else if (c.type === "radio") {
      displayCurrentValue = false;
      for (let i = 0; i < c.options.length; i++) {
        let inputElement = document.createElement("input");
        inputElement.type = "radio";
        inputElement.id = c.options[i];
        inputElement.value = c.options[i];
        inputElement.name = key;
        inputElement.checked = c.value === c.options[i];
        inputElement.setAttribute("data-index", i);
        inputElements.push(inputElement);
        let label = document.createElement("label");
        label.setAttribute("for", c.options[i]);
        label.innerHTML = c.options[i];
        inputElements.push(label);

        inputElement.addEventListener("input", (e) => {
          c.value = e.target.value;
        });
      }
    }

    if (inputElements.length === 0) {
      return;
    }

    holdingDiv.appendChild(labelElement);
    for (let el of inputElements) {
      holdingDiv.appendChild(el);
    }

    if (displayCurrentValue) {
      valueElement.innerHTML = c.value;
      holdingDiv.appendChild(valueElement);
    }

    controlsElement.appendChild(holdingDiv);
  }

  return params;
}
