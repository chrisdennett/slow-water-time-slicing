export async function startWebcam(video, size, camIndex = 0) {
  if (navigator.mediaDevices.getUserMedia) {
    const cams = await listWebcams();
    // console.log('cams: ', cams)

    return new Promise((resolve) => {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: cams[camIndex],
            width: { ideal: size.width },
            height: { ideal: size.height },
          },
        })
        .then((stream) => {
          video.srcObject = stream;
          resolve(video);
        })
        .catch((err0r) => {
          console.error("Something went wrong!:", err0r);
          // refresh page to retry?
        });
    });
  }
}

function attachWebcam() {
  var video = document.querySelector("#videoElement");

  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    video.srcObject = stream;
  });

  const canvas = document.querySelector("#canvas");

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
}

async function listWebcams() {
  return new Promise((resolve) => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      const webcams = [];

      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        if (device.kind === "videoinput") {
          webcams.push(device.deviceId);
        }
      }

      resolve(webcams);
    });
  });
}
