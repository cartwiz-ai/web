import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

export default function ImageSearch() {
  const webcamRef = useRef(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const tfWorker = new Worker(new URL('./tfWorker.mjs', import.meta.url), { type: 'module' });

    tfWorker.onmessage = (event) => {
      const { type, predictions } = event.data;

      switch (type) {
        case 'modelLoaded':
          console.log('Model loaded in worker!');
          break;

        case 'predictions':
          console.log(predictions);
          break;

        default:
          console.error('Unknown message type from worker');
      }
    };

    tfWorker.postMessage({ type: 'loadModel' });
    setWorker(tfWorker);

    // Cleanup the worker when the component unmounts
    return () => {
      tfWorker.terminate();
    };
  }, []);

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcamRef.current.video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rawPixelData = Array.from(new Uint8Array(imageData.data));

    worker && worker.postMessage({
      type: 'classify',
      width: canvas.width,
      height: canvas.height,
      rawPixelData
    });
};


  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
      />
      <button onClick={capture}>Classify Image</button>
    </>
  );
}
