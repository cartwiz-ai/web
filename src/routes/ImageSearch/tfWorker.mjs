import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model;

onmessage = async (event) => {
  const { type, imageData } = event.data;

  switch (type) {
    case 'loadModel':
      model = await mobilenet.load();
      postMessage({ type: 'modelLoaded' });
      break;

      case 'classify':
        const { width, height, rawPixelData } = event.data;
        const uint8ClampedArray = new Uint8ClampedArray(rawPixelData);
        const reconstructedImageData = new ImageData(uint8ClampedArray, width, height);
        const tensor = tf.browser.fromPixels(reconstructedImageData);
        const predictions = await model.classify(tensor);
        tensor.dispose(); // Dispose the tensor immediately after use
        postMessage({ type: 'predictions', predictions });
        break;
c    


    default:
      console.error('Unknown message type from main thread');
  }
};
