# API_SPEC.md: KARIGASETU AI REST API

All requests and responses use JSON. Authenticated endpoints require a standard Bearer token:
`Authorization: Bearer <jwt_access_token>`.

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/google`
Authenticates a user via Google OAuth id_token.
* **Request**:
  ```json
  {
    "id_token": "eyJhbGciOiJSUzI1NiIs...",
    "role": "SELLER" // or "BUYER", optional if already registered
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "user": {
      "id": "u-101",
      "email": "savita.pochampally@example.com",
      "role": "SELLER",
      "status": "ACTIVE"
    }
  }
  ```

### `POST /api/v1/auth/send-email-otp`
Sends a 6-digit verification code to the given email address.
* **Request**: `{"email": "artisan@example.com"}`
* **Response (200 OK)**: `{"status": "SENT", "expires_in_seconds": 180, "channel": "EMAIL"}`

### `POST /api/v1/auth/verify-email-otp`
Verifies OTP code and establishes an authenticated session.
* **Request**: `{"email": "artisan@example.com", "otp": "481920", "role": "SELLER"}`
* **Response (200 OK)**: `{"access_token": "...", "user": {...}}`

### `POST /api/v1/auth/send-mobile-otp`
Dispatches an SMS OTP via the telephony provider (or dev mock provider).
* **Request**: `{"mobile": "+919876543210"}`
* **Response (200 OK)**: `{"status": "SENT", "expires_in_seconds": 180, "channel": "SMS"}`

### `POST /api/v1/auth/verify-mobile-otp`
Verifies SMS OTP code.
* **Request**: `{"mobile": "+919876543210", "otp": "481920", "role": "SELLER"}`
* **Response (200 OK)**: `{"access_token": "...", "user": {...}}`

### `POST /api/v1/auth/demo-login`
Quick-switch login for product evaluation.
* **Request**: `{"role": "SELLER"}` (options: `SELLER`, `BUYER`, `ADMIN`)
* **Response (200 OK)**: `{"access_token": "...", "user": {...}, "profile": {...}}`

---

## 2. Artisan / Seller Endpoints (`/api/v1/seller`)

### `GET /api/v1/seller/profile`
Returns the active seller's profile, including readiness score.
* **Response (200 OK)**:
  ```json
  {
    "id": "sel-1",
    "full_name": "Savita Devi",
    "business_name": "Savita Ikat Weavers",
    "location": "Pochampally, Telangana",
    "primary_craft": "Handloom Ikat",
    "experience_years": 18,
    "monthly_capacity_units": 25,
    "verification_badge": "ARTISAN_VERIFIED",
    "readiness_score": 84,
    "export_readiness_score": 78
  }
  ```

### `PUT /api/v1/seller/profile`
Updates artisan profile attributes and production capacity.

### `GET /api/v1/seller/dashboard`
Returns 3D hero dashboard metrics: monthly sales, chart points, active buyers, AI business insights.
* **Response (200 OK)**:
  ```json
  {
    "artisan_name": "Savita",
    "greeting": "Good Morning, Savita 👋",
    "subtitle": "Your craft is ready for the world.",
    "hero_sales": {
      "monthly_sales_inr": 42850,
      "growth_percentage": 18.4,
      "chart_series": [28000, 31500, 36200, 39400, 42850]
    },
    "kpis": {
      "products_count": 24,
      "buyers_count": 18,
      "pending_rfqs": 3
    },
    "ai_business_insight": {
      "title": "✨ AI BUSINESS INSIGHT",
      "message": "Demand for your handmade bags increased this week (+28%). Consider increasing production."
    }
  }
  ```

---

## 3. Buyer Endpoints (`/api/v1/buyer`)

### `GET /api/v1/buyer/profile` / `PUT /api/v1/buyer/profile`
Manages buyer profile, corporate credentials, and sourcing criteria.

### `GET /api/v1/buyer/dashboard`
Returns trending crafts, active RFQs, and tailored AI recommendations.

---

## 4. Product Catalog (`/api/v1/products`)

### `POST /api/v1/products`
Creates a verified product catalogue entry.
* **Request**:
  ```json
  {
    "name": "Handwoven Silk Ikat Saree",
    "description": "Authentic double-ikat pure silk handloom saree woven over 3 days in Pochampally.",
    "category": "Textiles & Apparels",
    "subcategory": "Sarees",
    "material": "Pure Mulberry Silk",
    "craft_type": "Pochampally Ikat",
    "color": "Royal Blue & Crimson",
    "dimensions": "5.5m x 1.15m",
    "weight": "650g",
    "production_time": "3 days",
    "price": 3850.00,
    "quantity": 5,
    "image_urls": ["/uploads/saree_enhanced.jpg"],
    "quality_score": 94,
    "ai_confidence": 0.94
  }
  ```

### `GET /api/v1/products`
Lists published products with filtering by category, craft type, and price range.

### `GET /api/v1/products/{id}`
Returns complete product details with artisan profile and storytelling highlights.

---

## 5. AI Pipelines (`/api/v1/ai`)

### `POST /api/v1/ai/image-quality`
Analyzes raw product photograph for lighting, sharpness, and composition.
* **Request**: Multipart file (`file`) or base64.
* **Response (200 OK)**:
  ```json
  {
    "quality_score": 92,
    "sharpness": 94,
    "lighting": 89,
    "background": 93,
    "verdict": "OPTIMAL",
    "tip": "Image is crisp and well-lit. Ideal for catalogue generation."
  }
  ```

### `POST /api/v1/ai/image-enhance`
Performs contrast equalization, sharpness boosting, and studio framing.
* **Response (200 OK)**:
  ```json
  {
    "original_image_url": "/uploads/raw_bag.jpg",
    "enhanced_image_url": "/uploads/enhanced_bag.jpg",
    "enhancements_applied": ["CONTRAST_BOOST", "STUDIO_LIGHTING", "EDGE_SHARPEN"]
  }
  ```

### `POST /api/v1/ai/speech-to-text`
Transcribes regional spoken audio (e.g., Telugu, Hindi) and normalizes it.
* **Request**: Multipart audio file (`audio`) or text simulation string.
* **Response (200 OK)**:
  ```json
  {
    "detected_language": "te",
    "language_name": "Telugu",
    "original_transcript": "ఇది నేను చేతితో తయారు చేసిన చీర. దీనికి రెండు రోజులు పట్టింది.",
    "english_translation": "This is a handwoven saree made by hand. It took two days to make."
  }
  ```

### `POST /api/v1/ai/generate-catalog`
Synthesizes vision results and voice transcript into structured catalogue metadata.
* **Response (200 OK)**:
  ```json
  {
    "product_name": "Handwoven Mulberry Silk Saree",
    "category": "Textiles & Apparels",
    "subcategory": "Sarees",
    "material": "Pure Silk",
    "craft_type": "Pochampally Ikat",
    "color": "Royal Blue",
    "dimensions": "5.5m x 1.15m",
    "production_time": "2 days",
    "description": "Exquisite handwoven Pochampally double-ikat saree with traditional geometric motifs.",
    "keywords": ["handloom", "ikat", "silk saree", "pochampally"],
    "confidence": 0.94
  }
  ```

### `POST /api/v1/ai/suggest-price`
Itemizes an explainable cost-plus pricing recommendation.
* **Request**:
  ```json
  {
    "material_cost": 420.0,
    "labour_hours": 6.0,
    "labour_rate_per_hour": 50.0,
    "packaging_cost": 50.0,
    "shipping_cost": 80.0,
    "category": "Bags"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "recommended_price": 1199.00,
    "market_range": {"min": 1000.00, "max": 1400.00},
    "expected_margin": 479.00,
    "confidence": 0.87,
    "explanation": "Material (₹420) + Labour (₹300) + Packaging (₹50) + Shipping (₹80) + Market Demand (+₹180) + Desired Margin (+₹169)."
  }
  ```

### `POST /api/v1/ai/buyer-match`
Runs the 6-factor compatibility matcher for an RFQ.
* **Response (200 OK)**:
  ```json
  {
    "matches": [
      {
        "seller_id": "sel-1",
        "seller_name": "Savita Crafts",
        "match_percentage": 94,
        "reasons": [
          "✓ Product category matches Handloom Bags",
          "✓ Capacity of 200 units meets 100 unit request",
          "✓ Price within ₹500 budget limit",
          "✓ Verified Artisan badge"
        ]
      }
    ]
  }
  ```

### `POST /api/v1/ai/negotiate`
AI Negotiation Assistant suggestion for RFQ counter-offers.
* **Response (200 OK)**:
  ```json
  {
    "suggested_counter_price": 320.00,
    "advice": "Buyer proposed ₹280. Based on your ₹240 production cost and market demand, counter at ₹320 to preserve a 25% healthy margin."
  }
  ```

---

## 6. Search & B2B Discovery (`/api/v1/search`)

### `GET /api/v1/search/products`
Natural language intent parser and attribute filter search.
* **Query Parameters**: `q=100 handmade jute bags under 500`
* **Response (200 OK)**: Parses query into `category="Jute Bags"`, `budget=500`, `quantity=100`, returning matching catalog items.

---

## 7. RFQ & Orders (`/api/v1/rfqs`, `/api/v1/orders`)

### `POST /api/v1/rfqs`
Buyer submits B2B Request For Quotation.

### `POST /api/v1/rfqs/{id}/respond`
Seller responds with quote, acceptance, or counter-offer.

### `POST /api/v1/orders` / `GET /api/v1/orders`
Manages order fulfillment states: `PENDING` -> `ACCEPTED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`.

---

## 8. Admin & Impact Analytics (`/api/v1/admin`)

### `GET /api/v1/admin/overview`
High-level KPIs: Registered Artisans, Digitized Catalogues, Active RFQs, Gross Merchandise Value.

### `GET /api/v1/admin/clusters`
Geo-coordinates, artisan population, and primary crafts for the interactive 2.5D Cluster Map.

### `GET /api/v1/admin/demand-trends`
Aggregated search and inquiry demand curves across categories.
