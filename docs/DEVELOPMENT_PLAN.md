# DEVELOPMENT_PLAN.md: KARIGASETU AI

## 1. Implementation Roadmap & Milestones

This document defines the sequential development, testing, and verification process for the 2026 prototype of **KARIGASETU AI**.

```
[Milestone 1: Specs & Architecture]  ---> [Milestone 2: Backend Core & DB]
                 |                                      |
                 v                                      v
[Milestone 4: API Routers & Logic]   <--- [Milestone 3: AI Intelligence Engine]
                 |
                 v
[Milestone 5: Web Admin & 2.5D Map]  ---> [Milestone 6: Flutter Mobile & 3D UI]
                                                        |
                                                        v
                                          [Milestone 7: Verification & Tests]
```

---

## 2. Detailed Milestone Breakdown

### Milestone 1: Specifications & Architecture (COMPLETED)
- [x] Create `docs/PROJECT_SPEC.md`
- [x] Create `docs/ARCHITECTURE.md`
- [x] Create `docs/DATABASE_SCHEMA.md`
- [x] Create `docs/API_SPEC.md`
- [x] Create `docs/DEVELOPMENT_PLAN.md`
- [x] Create `docs/AI_ARCHITECTURE.md`
- [x] Create `docs/DEMO_SCRIPT.md`

### Milestone 2: Backend Core & Database Engine
* **Objective**: Establish the Python FastAPI runtime, configuration, database connection, ORM models, and seed data.
* **Tasks**:
  1. Set up `backend/requirements.txt` and install dependencies.
  2. Implement `backend/app/core/config.py` with Pydantic settings.
  3. Implement `backend/app/core/security.py` (JWT encoding/decoding, OTP hashing, Bearer auth dependencies).
  4. Implement `backend/app/core/database.py` (SQLAlchemy async/sync engine, session dependency).
  5. Implement all 26 SQLAlchemy models in `backend/app/models/`.
  6. Create `backend/app/seed/demo_data.py` with 20+ artisans, 50+ products, clusters, RFQs, and orders.
* **Verification**: Run database initialization and verify tables & seeds populate cleanly.

### Milestone 3: AI Intelligence Engine & Domain Services
* **Objective**: Build clean service abstractions for computer vision, audio STT, LLM cataloging, explainable pricing, and buyer matching.
* **Tasks**:
  1. `ImageQualityAnalyzer`: Compute Laplacian sharpness variance, luminance exposure, and return 0-100 score with artisan tips.
  2. `ImageEnhancerService`: Contrast adjustment, studio lighting balance, and edge enhancement.
  3. `RegionalSTTService`: Multilingual audio recognition supporting Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, and English, with language detection and entity extraction.
  4. `CatalogGenerationService`: Strict schema extraction generating titles, categories, craft types, dimensions, and production time without hallucinating.
  5. `ExplainablePricingEngine`: Transparent cost-plus calculation (Materials + Labour + Packaging + Shipping + Demand + Margin) with market ranges.
  6. `SixFactorMatchingEngine`: Weighted algorithmic compatibility scoring between buyer RFQs and artisans.
  7. `GoogleLensAdapter` & `ONDCAdapter`: External intent and protocol integration abstractions with graceful fallbacks.
* **Verification**: Unit test each service with deterministic test inputs.

### Milestone 4: FastAPI REST Routers & Business Logic
* **Objective**: Expose all functional endpoints with robust validation, role guards, and error states.
* **Tasks**:
  1. `/auth`: Google OAuth verification, 6-digit Email OTP, Mobile OTP, and demo quick-login.
  2. `/seller` & `/buyer`: Profiles, business capacity, and dashboard aggregations.
  3. `/products`: CRUD, status transitions, and image attachments.
  4. `/ai`: Endpoints for image analysis, enhancement, voice transcription, catalog generation, pricing, and "Ask AI" negotiation.
  5. `/search`: Natural language intent search ("100 jute bags under 500") and category filtering.
  6. `/rfqs` & `/orders`: RFQ submission, counter-offers, order placement, and tracking.
  7. `/admin`: Cluster metrics, demand trends, and impact counters.
* **Verification**: Run automated pytest test suite across all API endpoints.

### Milestone 5: Web Admin Dashboard & 2.5D Cluster Map
* **Objective**: Provide an interactive web dashboard for judges, cluster administrators, and buyers.
* **Tasks**:
  1. Build responsive SPA in `backend/static/admin/`.
  2. Render interactive Indian Craft Cluster Map with 2.5D markers (Telangana, Rajasthan, Karnataka, Maharashtra, etc.).
  3. Display live KPI counters (Artisans, Catalogues, Orders, GMV, Export Readiness).
  4. Render Demand Intelligence charts (category demand trends).
  5. Provide RFQ & Verification audit action triggers.
* **Verification**: Open in browser and verify map interactivity, cluster inspection, and live telemetry.

### Milestone 6: Flutter Mobile Application & 3D Depth UI
* **Objective**: Deliver a modern, accessible mobile client with real-time 3D/depth interactions.
* **Tasks**:
  1. Project setup with clean architecture (`core/`, `features/`, `widgets/3d/`).
  2. Implement custom 3D depth widgets: `DepthCard`, `Product3DCard` (with touch perspective tilt and parallax), `Stat3DCard`, `HeroSalesCard`.
  3. Implement Seller 3D Dashboard with hero sales card, animated wave chart, and central glowing AI Scan trigger.
  4. Implement 3D AI Scanner with glowing detection box and 5-stage sequential recognition animation.
  5. Implement Voice Cataloguing screen with regional language selector, Before/After image slider, editable cards, and confidence chips.
  6. Implement Explainable Pricing breakdown widget.
  7. Implement Buyer Discovery screen with natural language search bar and 6-factor match score badges.
  8. Implement B2B RFQ creation and "Ask AI" negotiation assistant.
  9. Implement Order tracking, Profile completion gauge, and Offline sync queue.
  10. Theme support: Warm Craft Light mode & Deep Indigo Dark mode.
* **Verification**: Run widget tests and verify navigation flows across both Seller and Buyer roles.

### Milestone 7: Testing, Documentation & Demo Verification
* **Objective**: Ensure complete end-to-end reliability for product presentation.
* **Tasks**:
  1. Comprehensive pytest suite covering unit and integration scenarios.
  2. Create `docs/AI_ARCHITECTURE.md`, `docs/DEMO_SCRIPT.md`, and root `README.md`.
  3. Verify the complete live demo vertical slice:
     $$\text{Seller} \to \text{Scan} \to \text{Voice} \to \text{Enhance} \to \text{Catalog} \to \text{Price} \to \text{Publish} \to \text{Buyer} \to \text{Search} \to \text{Match} \to \text{RFQ} \to \text{Ask AI} \to \text{Order} \to \text{Admin Map}$$
