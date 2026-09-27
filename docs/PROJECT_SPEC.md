# PROJECT_SPEC.md: KARIGASETU AI

## 1. Product Title & Identity
* **Project Name**: KARIGASETU AI
* **Tagline**: "From Craft to Commerce"
* **Theme**: 2026 Prototype
* **Domain**: AI-Driven Market Linkage and Smart Cataloging Mobile Application for Marginalized Artisans
* **Core Value Proposition**: An AI-powered digital business manager that allows artisans with low digital literacy to transform physical handmade crafts into professional digital catalogues using only **one photograph and voice input**, receive intelligent pricing assistance, discover B2B buyers, receive RFQs, negotiate with AI assistance, and connect to digital commerce channels.

---

## 2. Problem Statement & Need
India is home to over 7 million recognized traditional artisans and millions more unorganized craftspersons. Despite immense cultural value and craftsmanship, marginalized artisans face severe socio-economic bottlenecks:
1. **Digital Literacy Barrier**: Artisans struggle with complex e-commerce interfaces, English-language forms, SKU specifications, and digital marketing requirements.
2. **Cataloguing & Quality Friction**: Taking studio-grade product photos, writing search-optimized descriptions, and categorizing crafts accurately requires professional skills artisans cannot afford.
3. **Information Asymmetry & Exploitative Pricing**: Intermediaries exploit artisans' lack of cost transparency and market pricing data, forcing distress sales.
4. **Market Disconnect**: Lack of direct B2B market linkage to corporate buyers, export houses, and institutional buyers seeking authentic handmade goods.
5. **Language & Cultural Isolation**: Artisans speak regional dialects (Telugu, Hindi, Tamil, Kannada, Marathi, Bengali) and cannot communicate effectively with national/global buyers.

---

## 3. Product Vision: "An AI Business Manager for Artisans"
Karigasetu AI is **not** a generic consumer marketplace. It is a proactive, voice-first digital business partner designed for artisans.

### The Hero Workflow:
$$\text{One Photo} + \text{One Regional Voice Recording} \longrightarrow \text{Market-Ready Global Listing}$$

1. **Artisan Takes Photo**: Camera captures handmade craft (e.g., Pochampally saree, Kolhapuri chappal, Channapatna wooden toy).
2. **AI Computer Vision Pipeline**: Automatically evaluates image quality (sharpness, lighting, background), enhances lighting/contrast, centers object, and suggests lighting tips.
3. **Regional Voice Input**: Artisan speaks in native tongue (e.g., Telugu: *"ఇది నేను చేతితో తయారు చేసిన చీర. దీనికి రెండు రోజులు పట్టింది."*).
4. **Speech-to-Text & Normalization**: Audio converted to text, regional language recognized, and normalized into clean structured attributes.
5. **LLM Smart Catalog Generation**: Generates title, category, craft type, material, dimensions, production time, and search keywords without hallucinating unsupported facts.
6. **Explainable Cost-Plus AI Pricing**: Recommends fair selling price with itemized breakdown (Materials + Labour + Packaging + Shipping + Demand Premium + Profit Margin).
7. **Human-in-the-Loop Approval**: Visual confirmation with editable cards and confidence chips.
8. **B2B Market Linkage & Matching**: Matches product with institutional buyers via a 6-factor compatibility algorithm.
9. **AI Negotiation Assistant ("Ask AI")**: Assists artisan in countering buyer RFQ quotes based on cost preservation.
10. **Order Lifecycle & Cluster Impact**: Manages orders through fulfillment while aggregating regional economic data into a 2.5D Artisan Cluster Map.

---

## 4. User Personas

### Persona A: The Artisan / Seller (e.g., Savita, Pochampally Handloom Weaver)
* **Age**: 42
* **Location**: Yadadri Bhuvanagiri, Telangana
* **Language**: Telugu (Speaks only Telugu, limited English literacy)
* **Device**: Low-to-mid range Android smartphone with intermittent 4G connectivity
* **Pain Point**: Spends 3 days creating an exquisite silk saree, sells to local middleman for ₹1,800, which sells in metro boutiques for ₹6,500. Cannot type English product specifications.
* **Karigasetu Benefit**: Speaks in Telugu for 20 seconds, uploads 1 photo. Receives ₹3,850 price recommendation, publishes to B2B buyers directly, manages orders offline.

### Persona B: The Institutional / Corporate Buyer (e.g., Rajesh, FabCraft Retail)
* **Role**: Procurement Lead for Sustainable Artisan Goods
* **Needs**: Bulk orders (100–500 units), verified authentic artisan sourcing, predictable lead times, transparent pricing.
* **Pain Point**: Difficulty verifying artisan authenticity, negotiating delivery schedules, and tracking fragmented regional clusters.
* **Karigasetu Benefit**: Natural language search ("Need 100 handmade jute tote bags under ₹500"), receives matched verified artisans with capacity metrics, issues instant RFQs.

### Persona C: The Cluster Administrator / Handicraft Board Officer
* **Needs**: Real-time visibility into artisan cluster production, pricing fairness, export readiness, and regional economic upliftment.
* **Karigasetu Benefit**: Interactive 2.5D Cluster Map, Demand Intelligence trends, and export compliance audits.

---

## 5. Functional Requirements Matrix

| Module | Key Requirements | Priority |
| :--- | :--- | :--- |
| **Authentication** | Google OAuth, Passwordless Email OTP, Mobile OTP, Role selection (Seller/Buyer), Demo Account Toggle | P0 |
| **3D / Depth UI** | Tactile 2.5D cards, tilt on touch, parallax elevation, floating sales cards, animated charts | P0 |
| **3D AI Scanner** | Camera/gallery upload, glowing bounding frame, 5-stage sequential recognition pipeline, Google Lens intent hook | P0 |
| **Voice & Catalog** | Regional voice recorder (TE, HI, TA, KN, MR, BN, EN), STT, LLM JSON extraction, confidence tags, human approval | P0 |
| **Image Enhancement** | Sharpness/lighting analysis (0-100 score), contrast/lighting correction, before/after interactive slider | P0 |
| **Explainable Pricing**| Cost-plus model breakdown (material, labour, packaging, market demand, margin), market range | P0 |
| **Buyer Discovery** | Natural language intent parsing, semantic vector embeddings, 6-factor compatibility matching | P0 |
| **RFQ & Negotiation**| B2B quotation submission, "Ask AI" negotiation counter-offer suggestion, status flow | P0 |
| **Order Lifecycle** | 6-state progression (PENDING, ACCEPTED, PROCESSING, SHIPPED, DELIVERED, CANCELLED) | P0 |
| **Admin Web Portal** | 2.5D Artisan Cluster Map, Demand Intelligence, live impact counters, verified artisan badges | P0 |
| **Offline-First** | Offline product drafts, SQLite local cache, background sync queue manager | P1 |
| **Marketplace Adapter**| Extensible ONDC and external marketplace sync gateway | P1 |

---

## 6. Non-Functional & Quality Standards
1. **Zero Hallucination AI Rule**: System never invents GI tags, certifications, or false cultural claims unless verified in inputs.
2. **Performance on Low-End Android**: App size under 35MB, responsive 60fps micro-interactions, compressed image uploads (<800KB).
3. **Accessibility**: High-contrast typography, large touch targets (minimum 48x48dp), voice-guided audio prompts, multi-language UI localization.
4. **Security & Data Privacy**: Passwords never stored; JWT sessions with 24-hour expiry; OTP valid for 3 minutes; zero hardcoded credentials.
