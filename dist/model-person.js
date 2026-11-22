'use strict';

const modelPerson = (() => {
  const vendor = new URL('./vendor/mediapipe/', document.currentScript?.src || document.baseURI);
  let loading;

  async function load() {
    const {FilesetResolver,ImageSegmenter} = await import(new URL('vision_bundle.mjs', vendor).href);
    const files = await FilesetResolver.forVisionTasks(new URL('wasm', vendor).href);
    return ImageSegmenter.createFromOptions(files, {
      baseOptions: {modelAssetPath:new URL('selfie_segmenter.tflite', vendor).href,delegate:'CPU'},
      runningMode:'IMAGE',
      outputCategoryMask:false,
      outputConfidenceMasks:true
    });
  }

  function prepare() {
    loading ??= load().catch(error => {
      loading=undefined;
      throw error;
    });
    return loading;
  }

  async function segment(canvas) {
    if (!canvas?.width || !canvas.height) throw Error('The image has no pixels to scan.');
    const segmenter = await prepare();
    let foreground;
    segmenter.segment(canvas, ({confidenceMasks}) => {
      const mask = confidenceMasks?.[0];
      if (!mask || mask.width !== canvas.width || mask.height !== canvas.height) return;
      // The SDK releases the mask after the callback. Copy its probabilities into our binary data now.
      const confidence = mask.getAsFloat32Array();
      foreground = Uint8Array.from(confidence, value => value >= .45 ? 1 : 0);
    });
    if (!foreground) throw Error('The person scan did not return an outline.');
    return foreground;
  }

  return {prepare,segment};
})();
