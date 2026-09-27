const NOT_IDENTIFIABLE = 'Not identifiable from the image.';
const MAX_BASE64_LENGTH = 8_000_000;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

const responseSchema = {
  type: 'OBJECT',
  properties: {
    isValidCraft: { type: 'BOOLEAN' },
    isHumanSubject: { type: 'BOOLEAN' },
    isDocumentSubject: { type: 'BOOLEAN' },
    rejectionReason: { type: 'STRING' },
    productTitle: { type: 'STRING' },
    craftType: { type: 'STRING' },
    category: { type: 'STRING' },
    subcategory: { type: 'STRING' },
    materials: { type: 'ARRAY', items: { type: 'STRING' } },
    colors: { type: 'ARRAY', items: { type: 'STRING' } },
    patterns: { type: 'ARRAY', items: { type: 'STRING' } },
    designStyle: { type: 'STRING' },
    texture: { type: 'STRING' },
    shape: { type: 'STRING' },
    visibleFeatures: { type: 'ARRAY', items: { type: 'STRING' } },
    craftingTechnique: { type: 'STRING' },
    possibleOrigin: { type: 'STRING' },
    culturalContext: { type: 'STRING' },
    shortDescription: { type: 'STRING' },
    detailedDescription: { type: 'STRING' },
    seoDescription: { type: 'STRING' },
    keywords: { type: 'ARRAY', items: { type: 'STRING' } },
    highlights: { type: 'ARRAY', items: { type: 'STRING' } },
    careInstructions: { type: 'ARRAY', items: { type: 'STRING' } },
    suggestedTags: { type: 'ARRAY', items: { type: 'STRING' } },
    confidence: { type: 'NUMBER', minimum: 0, maximum: 1 },
  },
  required: [
    'isValidCraft',
    'isHumanSubject',
    'isDocumentSubject',
    'rejectionReason',
    'productTitle',
    'craftType',
    'category',
    'subcategory',
    'materials',
    'colors',
    'patterns',
    'designStyle',
    'texture',
    'shape',
    'visibleFeatures',
    'craftingTechnique',
    'possibleOrigin',
    'culturalContext',
    'shortDescription',
    'detailedDescription',
    'seoDescription',
    'keywords',
    'highlights',
    'careInstructions',
    'suggestedTags',
    'confidence',
  ],
};

const analysisPrompt = `You are KARIGARSETU.AI's expert visual handicraft cataloguing assistant.
Analyze the provided image carefully. Your job is to help an Indian artisan create an accurate, marketplace-ready product listing based strictly on visible evidence.

FIRST CHECK:
Determine whether the image visibly depicts a handmade handicraft, sculpture, pottery, handloom textile, woodwork, metalwork, jewellery, painting, or home decor craft piece.
- If it shows a person/portrait/selfie, document/invoice/syllabus, screenshot, vehicle, food, random modern machine, or corrupt/blank image, set isValidCraft to false, set isHumanSubject/isDocumentSubject accordingly, and explain why in rejectionReason.
- If it shows a genuine physical handicraft or craft creation, set isValidCraft to true.

WHEN ANALYZING VALID CRAFTS:
1. Identify only visually supported information.
2. Analyze:
   - object type, shape, and geometry
   - materials or visible material appearance (e.g., seasoned teakwood, terracotta clay, hand-spun cotton, brass)
   - colors (primary, accents, undertones)
   - patterns, motifs, carvings, weave structures, or engravings
   - surface texture (e.g., matte, hand-chiseled, polished, raw, glazed)
   - visible decorative details and apparent craftsmanship
   - visible construction techniques (e.g., hand-loomed, pit-loom, wheel-thrown, hand-molded, lost-wax cast, block-printed)
3. Generate:
   - productTitle: Clear, descriptive marketplace title.
   - shortDescription: 1-2 sentence concise snapshot of the craft.
   - detailedDescription: Rich, multi-paragraph marketplace description with exact visual traits.
   - seoDescription: 150-160 character search engine optimized meta description.
   - keywords: 6-10 specific descriptive search terms.
   - highlights: 4-6 bullet points highlighting distinctive craftsmanship features.
   - careInstructions: 2-4 practical, craft-appropriate maintenance guidance items.
   - suggestedTags: 4-8 marketplace indexing tags.

CRITICAL CULTURAL & GEOGRAPHIC SAFETY:
- Never hallucinate tribal identity, concrete artisan lineage, district origin, historical period, GI status, or manufacturing technique not clearly visible.
- When origin cannot be confirmed from the image, use "Not identifiable from the image."
- For culturalContext, describe only unmistakable cultural form; otherwise use "Not identifiable from the image."

CONFIDENCE:
- Return a numeric confidence score between 0 and 1, using decimals such as 0.92 for high confidence, 0.75 for moderate confidence. Do not return integers above 1.

Return strictly a valid JSON object matching the requested schema.`;

function textOrFallback(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : NOT_IDENTIFIABLE;
}

function listOrEmpty(value) {
  return Array.isArray(value)
    ? value
        .filter((item) => typeof item === 'string' && item.trim())
        .map((item) => item.trim())
    : [];
}

function parseGeminiJson(text) {
  const cleaned = String(text || '')
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

export default async function handler(request, response) {
  // CORS Headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_gemini_api_key') || apiKey === 'YOUR_GEMINI_API_KEY') {
    // Return safe developer error code without leaking technical server details to client
    return response.status(503).json({
      success: false,
      code: 'AI_NOT_CONFIGURED',
      message: 'AI analysis is temporarily unavailable.',
    });
  }

  const { mimeType = 'image/jpeg', base64Data, image } = request.body || {};

  // Extract raw base64 data safely
  let rawBase64 = base64Data || image || '';
  if (typeof rawBase64 === 'string' && rawBase64.includes(',')) {
    rawBase64 = rawBase64.split(',')[1];
  }

  let cleanMime = typeof mimeType === 'string' ? mimeType.toLowerCase() : 'image/jpeg';
  if (cleanMime === 'image/jpg') cleanMime = 'image/jpeg';

  if (
    !ALLOWED_MIME_TYPES.has(cleanMime) ||
    typeof rawBase64 !== 'string' ||
    !rawBase64 ||
    rawBase64.length > MAX_BASE64_LENGTH
  ) {
    return response.status(400).json({
      success: false,
      code: 'INVALID_IMAGE',
      message: 'Please upload a valid JPG, PNG, or WebP image.',
    });
  }

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash-lite',
  ].filter(Boolean);

  let lastError = null;
  let parsedResult = null;

  for (const model of candidateModels) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: analysisPrompt },
                { inline_data: { mime_type: cleanMime, data: rawBase64 } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: 'application/json',
            responseSchema,
          },
        }),
      });

      if (geminiResponse.ok) {
        const payload = await geminiResponse.json();
        const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const raw = parseGeminiJson(rawText);
          parsedResult = formatResult(raw);
          break;
        }
      } else {
        const errText = await geminiResponse.text();
        console.warn(`Gemini model ${model} returned ${geminiResponse.status}:`, errText.substring(0, 200));
        lastError = new Error(`Model ${model} failed with status ${geminiResponse.status}`);
      }
    } catch (err) {
      console.warn(`Gemini model ${model} fetch exception:`, err.message);
      lastError = err;
    }
  }

  if (parsedResult) {
    return response.status(200).json({ success: true, result: parsedResult });
  }

  console.error('All Gemini candidate models failed. Last error:', lastError?.message);
  return response.status(502).json({
    success: false,
    code: 'AI_PROVIDER_ERROR',
    message: 'Unable to analyze this image. Please try another clear photo.',
  });
}

function derivePricingDetails({ craftType, materials, patterns, visibleFeatures, designStyle, category, confidence }) {
  const normalizedCraftType = String(craftType || '').toLowerCase();
  const normalizedCategory = String(category || '').toLowerCase();
  const materialList = Array.isArray(materials) ? materials : [];
  const featureList = Array.isArray(visibleFeatures) ? visibleFeatures : [];
  const patternList = Array.isArray(patterns) ? patterns : [];

  const materialWeights = {
    terracotta: 260,
    clay: 240,
    wood: 290,
    teak: 320,
    brass: 420,
    copper: 390,
    silk: 420,
    cotton: 240,
    bamboo: 220,
    cane: 220,
    jute: 220,
    marble: 280,
    metal: 340,
    gemstone: 460,
    ceramic: 260,
    fabric: 240,
    woven: 250,
    lacquer: 260,
  };

  const categoryWeights = {
    wood: 260,
    pottery: 230,
    terracotta: 220,
    metal: 320,
    textile: 260,
    weaving: 260,
    bamboo: 210,
    handicraft: 200,
    home: 180,
    jewellery: 420,
    sculpture: 300,
    painting: 280,
  };

  const craftBoost = {
    woodwork: 260,
    carving: 280,
    handloom: 260,
    pottery: 220,
    terracotta: 220,
    weaving: 250,
    brass: 340,
    metalwork: 310,
    painting: 220,
    sculpture: 280,
    craft: 170,
  };

  const materialBase = materialList.reduce((sum, material) => {
    const key = String(material).toLowerCase();
    return sum + (materialWeights[key] || 120);
  }, 0);

  const categoryBase = categoryWeights[normalizedCategory] || categoryWeights[normalizedCraftType] || 180;
  const craftBase = craftBoost[normalizedCraftType] || craftBoost[normalizedCategory] || 180;
  const featureBoost = featureList.length * 55;
  const patternBoost = patternList.length * 48;
  const detailBoost = Math.max(0, featureList.length + patternList.length - 2) * 35;
  const constructionBoost = /hand|crafted|woven|carved|painted|embroidered|engraved|molded/.test(String(designStyle || '')) ? 120 : 40;
  const qualityBoost = Math.round((Number(confidence) || 0.7) * 300);

  const suggestedPrice = Math.max(
    499,
    Math.round((materialBase + categoryBase + craftBase + featureBoost + patternBoost + detailBoost + constructionBoost + qualityBoost) / 3)
  );

  const min = Math.max(399, Math.round(suggestedPrice * 0.8));
  const max = Math.round(suggestedPrice * 1.35);

  const pricingFactors = [
    materialList[0] || cleanCraftDescriptor(materials, craftType),
    featureList[0] || 'Craftsmanship detail',
    patternList[0] || 'Hand-finished detailing',
    designStyle || craftType || 'Traditional craftwork',
  ].filter(Boolean).slice(0, 4);

  return {
    suggestedPrice,
    priceRange: { min, max },
    pricingFactors,
    confidence: Number(confidence) || 0.7,
  };
}

function cleanCraftDescriptor(materials, craftType) {
  const list = Array.isArray(materials) ? materials : [];
  if (list.length) return list[0];
  return craftType || 'Handcrafted item';
}

function formatResult(raw) {
  const valid = raw?.isValidCraft === true;
  const rawConfidence = Number(raw?.confidence);
  const confidenceScore = Number.isFinite(rawConfidence)
    ? Math.max(0, Math.min(1, rawConfidence))
    : 0.85;

  const productTitle = textOrFallback(raw?.productTitle);
  const craftType = textOrFallback(raw?.craftType);
  const category = textOrFallback(raw?.category);
  const subcategory = textOrFallback(raw?.subcategory);
  const materials = listOrEmpty(raw?.materials);
  const colors = listOrEmpty(raw?.colors);
  const patterns = listOrEmpty(raw?.patterns);
  const designStyle = textOrFallback(raw?.designStyle);
  const texture = textOrFallback(raw?.texture);
  const shape = textOrFallback(raw?.shape);
  const visibleFeatures = listOrEmpty(raw?.visibleFeatures);
  const craftingTechnique = textOrFallback(raw?.craftingTechnique);
  const possibleOrigin = textOrFallback(raw?.possibleOrigin);
  const culturalContext = textOrFallback(raw?.culturalContext);
  const shortDescription = textOrFallback(raw?.shortDescription);
  const detailedDescription = textOrFallback(raw?.detailedDescription);
  const seoDescription = textOrFallback(raw?.seoDescription);
  const keywords = listOrEmpty(raw?.keywords);
  const highlights = listOrEmpty(raw?.highlights);
  const careInstructions = listOrEmpty(raw?.careInstructions);
  const suggestedTags = listOrEmpty(raw?.suggestedTags);
  const pricing = derivePricingDetails({
    craftType,
    materials,
    patterns,
    visibleFeatures,
    designStyle,
    category,
    confidence: confidenceScore,
  });

  return {
    isValidCraft: valid,
    isHumanSubject: raw?.isHumanSubject === true,
    isDocumentSubject: raw?.isDocumentSubject === true,
    rejectionReason: textOrFallback(raw?.rejectionReason),
    productTitle,
    craftType,
    category,
    subcategory,
    materials,
    colors,
    patterns,
    designStyle,
    texture,
    shape,
    visibleFeatures,
    craftingTechnique,
    possibleOrigin,
    culturalContext,
    shortDescription,
    detailedDescription,
    seoDescription,
    keywords,
    highlights,
    careInstructions,
    suggestedTags,
    confidence: confidenceScore,

    productName: productTitle,
    description: detailedDescription,
    visualDescription: detailedDescription,
    descriptionSnippet: shortDescription,
    material: materials.join(', ') || NOT_IDENTIFIABLE,
    primaryMaterial: materials[0] || NOT_IDENTIFIABLE,
    primaryColor: colors[0] || NOT_IDENTIFIABLE,
    secondaryColor: colors[1] || NOT_IDENTIFIABLE,
    model: designStyle,
    regionState: possibleOrigin,
    sourcingOrigin: possibleOrigin,
    heritageLineage: culturalContext,
    culturalSignificance: culturalContext,
    craftFinish: texture,
    visibleConstructionTechnique: craftingTechnique,
    handmadeIndicators: visibleFeatures.join(', ') || NOT_IDENTIFIABLE,
    qualityScore: 4.8,
    suggestedPrice: pricing.suggestedPrice,
    estimatedPriceMin: pricing.priceRange.min,
    estimatedPriceMax: pricing.priceRange.max,
    priceRange: pricing.priceRange,
    pricingFactors: pricing.pricingFactors,
    analysisSource: 'live_ai',
    isLiveAi: true,
  };
}
