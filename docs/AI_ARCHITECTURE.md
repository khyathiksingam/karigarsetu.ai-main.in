# AI_ARCHITECTURE.md: KARIGASETU AI Intelligence Systems

## 1. Overview of AI Subsystems
KARIGASETU AI employs a multi-model architecture composed of computer vision, speech processing, LLM cataloging, cost-plus pricing algorithms, and multi-factor matching.

```
+-------------------------------------------------------------------------------+
|                             AI SUBSYSTEM PIPELINE                             |
|                                                                               |
|  [Computer Vision]       [Regional Speech STT]     [Structured Catalog LLM]   |
|   - Laplacian Sharpness   - Whisper / Wav2Vec2      - Strict JSON schema      |
|   - Luminance Exposure    - Language ID (7 langs)   - Craft & Material tags   |
|   - Quality Score 0-100   - Regional Normalization  - Zero Hallucination Rule |
|             |                       |                         |               |
|             +-----------------------+-------------------------+               |
|                                     |                                         |
|                                     v                                         |
|  [Explainable Pricing]    [6-Factor B2B Matcher]    [AI Negotiation Assist]   |
|   - Cost-plus breakdown   - Weighted compatibility  - Cost floor preservation |
|   - Market range bounds   - Distance & capacity fit - Fair counter-offer tips |
|   - Demand elasticity     - Explainable match badge - Non-guarantee disclaimer|
+-------------------------------------------------------------------------------+
```

---

## 2. Computer Vision & Photographic Quality Assessment

### 2.1 Quality Scoring Algorithm
Artisans frequently capture photographs in rural workshops with variable ambient lighting and hand tremors. Our vision pipeline scores each image across three diagnostic axes:

1. **Sharpness Score ($S_{\text{sharp}}$)**:
   Computed using the variance of the 2D Laplacian operator applied to the grayscale intensity matrix $I(x, y)$:
   $$\nabla^2 I = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}$$
   $$\text{Var}(\nabla^2 I) = \frac{1}{N}\sum_{x, y} (\nabla^2 I(x, y) - \mu)^2$$
   A variance $< 100$ indicates motion blur or poor focus. Normalization maps $[50, 500] \to [0, 100]$.

2. **Lighting & Exposure Score ($S_{\text{light}}$)**:
   Calculates the mean pixel luminance $\mu_L$ and standard deviation $\sigma_L$ across the CIE $L^*$ channel:
   * Under-exposed ($\mu_L < 70$): flags dark shadows.
   * Over-exposed ($\mu_L > 210$): flags blown-out highlights.
   * Optimal range ($100 \le \mu_L \le 180$) with $\sigma_L \ge 40$ yields maximum score.

3. **Background Composition Score ($S_{\text{comp}}$)**:
   Measures background clutter using edge density outside the central bounding box ($0.2W \le x \le 0.8W, 0.2H \le y \le 0.8H$). High peripheral edge count reduces the score.

4. **Composite Quality Index**:
   $$Q = 0.45 S_{\text{sharp}} + 0.35 S_{\text{light}} + 0.20 S_{\text{comp}}$$
   If $Q < 70$, actionable vernacular guidance is returned (e.g., *"Try taking the photo near natural daylight"*).

### 2.2 Image Enhancement Service
Applies targeted image processing without altering authentic craft colors:
* **Contrast Limited Adaptive Histogram Equalization (CLAHE)**: Restores depth in shadowed weaves.
* **Unsharp Masking**: Accentuates texture (e.g., handloom threads, carved wood grain).
* **Studio Framing**: Centers object on clean, high-key ambient background.

---

## 3. Multilingual Speech-to-Text & Regional Normalization

### 3.1 Supported Languages
1. **Telugu (`te`)**: e.g., Pochampally, Dharmavaram, Gadwal handloom clusters.
2. **Hindi (`hi`)**: e.g., Varanasi silk, Jaipur blue pottery, Moradabad brassware.
3. **Tamil (`ta`)**: e.g., Kanchipuram silk, Thanjavur doll clusters.
4. **Kannada (`kn`)**: e.g., Channapatna wooden toys, Ilkal sarees.
5. **Marathi (`mr`)**: e.g., Kolhapuri chappals, Paithani sarees.
6. **Bengali (`bn`)**: e.g., Shantiniketan leather, Bishnupur terracotta.
7. **English (`en`)**: Standard fallback.

### 3.2 Regional Normalization Engine
Converts spoken vernacular colloquialisms into standard trade metrics:
* Telugu *"రెండు రోజులు"* $\to$ "2 days"
* Hindi *"शुद्ध रेशम"* $\to$ "Pure Silk"
* Colloquial units (e.g., "గజాలు", "हाथ") $\to$ Metric meters / centimeters.

---

## 3. LLM Smart Catalog Generation & Guardrails

### 3.1 Strict Schema Definition
The LLM generates structured output conforming to the following JSON schema:
```json
{
  "product_name": "string",
  "category": "string",
  "subcategory": "string",
  "material": "string",
  "craft_type": "string",
  "color": "string",
  "dimensions": "string",
  "weight": "string",
  "production_time": "string",
  "description": "string",
  "keywords": ["string"],
  "confidence": 0.94
}
```

### 3.2 Anti-Hallucination Guardrails
* **Rule 1**: The LLM must **never** assert unverified Geographical Indication (GI) tags or government certifications unless explicitly stated by the artisan or verified in the cluster database.
* **Rule 2**: If dimensions or weight are omitted in the voice input, they are flagged as `null` or estimated with an explicit low confidence tag ($< 0.60$).
* **Rule 3**: Care instructions are included **only** if the artisan mentioned washing or maintenance guidelines.

---

## 4. Explainable Cost-Plus Pricing Engine

### 4.1 Pricing Equation
Rather than an unexplainable black-box, Karigasetu AI uses an equitable, transparent cost-plus formulation:
$$\text{Cost}_{\text{base}} = C_{\text{material}} + (T_{\text{labour}} \times R_{\text{rate}}) + C_{\text{packaging}} + C_{\text{shipping}}$$
$$\text{Price}_{\text{rec}} = \text{Cost}_{\text{base}} \times (1 + M_{\text{target}}) \times (1 + \delta_{\text{demand}})$$

Where:
* $C_{\text{material}}$: Raw material expenses (yarn, leather, pigments, clay).
* $T_{\text{labour}} \times R_{\text{rate}}$: Fair craft hours multiplied by the recommended regional skilled artisan hourly wage.
* $M_{\text{target}}$: Equitable artisan profit margin ($25\% - 40\%$).
* $\delta_{\text{demand}}$: Category seasonality index derived from recent B2B RFQs and search velocity.

### 4.2 Transparent Itemized Breakdown Output
The API outputs an explicit audit card:
* Material: ₹420
* Labour: ₹300 (6 hrs @ ₹50/hr)
* Packaging & Shipping: ₹130
* Market Demand Adjustment: +₹180
* Suggested Margin: +₹169
* **Recommended Price: ₹1,199** (Market Range: ₹1,000 – ₹1,400).

---

## 5. 6-Factor Buyer-Artisan Matching Algorithm

When a buyer submits an RFQ or executes a search, compatibility is computed across 6 normalized factors:

| Factor | Weight | Evaluation Method |
| :--- | :--- | :--- |
| **Product Similarity ($S_{\text{prod}}$)** | 30% | Cosine similarity between RFQ description & product embedding |
| **Price Fit ($S_{\text{price}}$)** | 20% | Relative delta: $1 - \frac{|\text{Price}_{\text{artisan}} - \text{Target}|}{\text{Target}}$ |
| **Quantity Capacity ($S_{\text{qty}}$)** | 15% | $\min(1.0, \frac{\text{Artisan Monthly Capacity}}{\text{RFQ Quantity}})$ |
| **Location Fit ($S_{\text{loc}}$)** | 15% | Geographic proximity or regional cluster alignment |
| **Delivery Lead Time ($S_{\text{time}}$)** | 10% | Estimated production days vs buyer deadline |
| **Trust & Verification ($S_{\text{trust}}$)** | 10% | Rating, cluster badge status, historical fulfillment rate |

$$\text{Match Score} = 0.30 S_{\text{prod}} + 0.20 S_{\text{price}} + 0.15 S_{\text{qty}} + 0.15 S_{\text{loc}} + 0.10 S_{\text{time}} + 0.10 S_{\text{trust}}$$

---

## 6. AI Negotiation Assistant ("Ask AI")
When an artisan receives a low-ball quote from an institutional buyer (e.g., Buyer offers ₹280 vs Listing ₹380):
1. The assistant calculates the artisan's break-even floor:
   $$\text{Floor} = \text{Material} + \text{Labour} + \text{Packing}$$
2. Checks bulk discount feasibility based on requested quantity (e.g., 100+ units reduces per-unit packaging and setup time by 12%).
3. Generates a fair counter-offer (e.g., ₹320) with a vernacular explanation:
   *"Buyer requested 100 units at ₹280. Your base cost is ₹240. Countering at ₹320 preserves a fair 25% profit while meeting commercial bulk price expectations."*
