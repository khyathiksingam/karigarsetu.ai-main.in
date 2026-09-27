export const SCAN_STEPS = [
  { id: 1, label: 'UPLOADING IMAGE', detail: 'Preparing the uploaded image' },
  { id: 2, label: 'IDENTIFYING CRAFT', detail: 'Classifying the visible craft tradition' },
  { id: 3, label: 'ANALYZING MATERIAL', detail: 'Reading visible materials and surface texture' },
  { id: 4, label: 'ANALYZING CRAFT STYLE', detail: 'Reviewing patterns, motifs, and design' },
  { id: 5, label: 'REVIEWING FEATURES', detail: 'Summarizing visible product features' },
  { id: 6, label: 'CHECKING EVIDENCE', detail: 'Separating observations from inferences' },
  { id: 7, label: 'WRITING DESCRIPTION', detail: 'Generating marketplace-ready heritage copy' },
  { id: 8, label: 'ANALYSIS COMPLETE', detail: 'Returning structured craft appraisal data' },
];

export async function analyzeProductImage(imageSource, onStepProgress) {
  if (onStepProgress) onStepProgress(0);
  const image = await prepareImageForAnalysis(imageSource);

  for (let step = 1; step < SCAN_STEPS.length - 1; step += 1) {
    if (onStepProgress) onStepProgress(step);
  }

  let response;
  try {
    response = await fetch('/api/analyze-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(image),
    });
  } catch (netErr) {
    // Fallback retry
    try {
      response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      });
    } catch {
      throw new Error('AI analysis is temporarily unavailable. Please check your connection and try again.');
    }
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorMsg =
      payload?.message ||
      payload?.error ||
      'AI analysis is temporarily unavailable. Please try again.';
    throw new Error(errorMsg);
  }

  if (!payload?.result || typeof payload.result !== 'object') {
    throw new Error('Unable to analyze this image. Please try another clear photo.');
  }

  if (onStepProgress) onStepProgress(SCAN_STEPS.length - 1);
  return { result: payload.result, isMock: false };
}

async function prepareImageForAnalysis(imageSource) {
  let source = imageSource;
  if (imageSource instanceof File) source = await fileToDataUrl(imageSource);
  if (typeof source !== 'string' || !source.startsWith('data:image/')) {
    throw new Error('Please upload a valid JPG, PNG, or WebP image.');
  }

  const image = await loadImage(source);
  const maxDimension = 1600;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Please upload a valid JPG, PNG, or WebP image.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  return { mimeType: 'image/jpeg', base64Data: dataUrl.split(',')[1] };
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Please upload a valid JPG, PNG, or WebP image.'));
    image.src = source;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Please upload a valid JPG, PNG, or WebP image.'));
    reader.readAsDataURL(file);
  });
}
