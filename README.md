# KARIGASETU AI

> **"From Craft to Commerce"**  
> *AI-Driven Market Linkage and Smart Cataloging Platform for Marginalized Artisans*  
> **2026 Prototype**

---

## 🌟 Executive Summary

**Karigasetu AI** is not another generic marketplace. It is an **AI-powered digital business manager** engineered to dismantle the digital literacy barriers confronting India's traditional craftspeople.

With **one photograph and 20 seconds of regional voice input**, an artisan transforms an uncatalogued handmade craft into a verified, studio-grade digital listing with transparent, explainable pricing, connects directly to institutional B2B buyers via a 6-factor AI matching engine, and negotiates fair bulk orders with an AI co-pilot.

```
                    +-----------------------------+
                    |    KARIGASETU HERO FLOW     |
                    +-----------------------------+
                                   |
         1. Take Photo 📷          |         2. Spoken Voice 🎙️
    (Handloom, Leather, Clay)      |     (Telugu, Hindi, Tamil, etc.)
                   \               |               /
                    v              v              v
            +---------------------------------------------+
            |          AI VISION & SPEECH ENGINE          |
            |  - Laplacian Sharpness & Exposure Scoring   |
            |  - Automatic Studio Lighting & Contrast     |
            |  - Vernacular STT & Trade Normalization     |
            +---------------------------------------------+
                                   |
                                   v
            +---------------------------------------------+
            |         STRUCTURED CATALOG & PRICING        |
            |  - Zero-Hallucination LLM Schema Extraction |
            |  - Cost-Plus Explainable Pricing Breakdown  |
            |  - Human-in-the-Loop Artisan Approval      |
            +---------------------------------------------+
                                   |
                                   v
            +---------------------------------------------+
            |         B2B MARKET LINKAGE & ORDERS         |
            |  - Natural Language Intent Search           |
            |  - 6-Factor Compatibility Matching          |
            |  - RFQs & "Ask AI" Fair Negotiation Assist  |
            +---------------------------------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Mobile** | **Flutter 3.x** (Android-first, iOS/Web ready), Provider/ChangeNotifier, Custom Matrix4 2.5D/3D Depth Widgets |
| **Backend API** | **Python 3.10+ / FastAPI**, Pydantic v2, Uvicorn, SQLAlchemy Async ORM |
| **Database & Search**| **PostgreSQL 15+** with **pgvector** (Production) / **SQLite** (Zero-dependency local demo), In-Memory Caching |
| **AI / Machine Learning**| **Google Gemini API**, OpenCV / Pillow for computer vision quality scoring, regional multilingual STT normalizer |
| **Auth & Security** | Google OAuth 2.0, Passwordless 6-digit Email & SMS OTP, JWT HS256 sessions, RBAC guards |
| **External Integrations**| Google Lens intent abstraction with fallback, ONDC (Beckn protocol) adapter |
| **Admin & Visuals** | Interactive **2.5D Indian Craft Cluster Map**, Demand Intelligence analytics |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
* Python 3.10+
* Node.js v18+ (for admin tools if desired)
* Flutter SDK (for mobile building)

### 2. Backend Setup & Startup
```powershell
# 1. Navigate to backend
cd backend

# 2. Install dependencies
py -3 -m pip install -r requirements.txt

# 3. Initialize database with seed data (20+ artisans, 50+ products, clusters, RFQs)
py -3 -m app.seed.demo_data

# 4. Launch the FastAPI server
py -3 -m uvicorn app.main:app --reload --port 8000
```
* **API Documentation (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Interactive Admin Web Dashboard**: [http://localhost:8000/admin](http://localhost:8000/admin)

### 3. Run Automated Tests
```powershell
cd backend
py -3 -m pytest tests/ -v
```

### 4. Flutter Mobile App
```powershell
cd karigasetu_mobile
flutter pub get
flutter run
```

---

## 📚 Complete Project Documentation

| Document | Description |
| :--- | :--- |
| [PROJECT_SPEC.md](docs/PROJECT_SPEC.md) | Comprehensive product vision, problem statement, and user personas |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Clean architecture, data flow diagrams, 3D visual engine, and security |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | 26 tables detailed with datatypes, indexes, foreign keys, and status enums |
| [API_SPEC.md](docs/API_SPEC.md) | Full REST OpenAPI endpoint contracts, request/response bodies |
| [AI_ARCHITECTURE.md](docs/AI_ARCHITECTURE.md) | Computer vision algorithms, STT pipeline, pricing equations, and matching formula |
| [DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) | Phased development roadmap, milestones, and testing gates |
| [DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | Step-by-step product presentation walkthrough |

---

## 🌟 Key Features & Innovations

### 1. 3D Tactile Design System
* **DepthCard**: Real-time perspective transformations giving cards elevation and tactile feedback.
* **Product3DCard**: Perspective tilt responding to user pointer/touch, with parallax image separation.
* **HeroSalesCard**: Floating 3D sales card featuring animated Bezier growth curves and live metrics.

### 2. 3D AI Scanner & Sequential Recognition
* Glowing animated detection bounding box.
* Sequential 5-stage inspection: Image Quality $\to$ Object Detection $\to$ Craft Recognition $\to$ Material Analysis $\to$ Catalogue Generation.
* Integrated **Google Lens** discovery button with native Android intent and graceful web fallback.

### 3. Voice-First Regional Experience
* Supports 7 Indian languages: **Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, and English**.
* Artisan speaks naturally; AI extracts dimensions, craft style, materials, and production timeline without tedious manual typing.

### 4. Explainable Cost-Plus Pricing Engine
* Transparent mathematical breakdown: Material + Labour + Packaging + Shipping + Demand + Margin.
* Protects artisans from exploitative middlemen with market benchmark ranges.

### 5. 6-Factor AI B2B Matching & RFQ Negotiation
* Matches institutional buyers with artisans based on Product, Price, Capacity, Location, Lead Time, and Verification rating.
* **"Ask AI" Negotiation Assistant**: Suggests equitable counter-offers to safeguard artisan profit margins.

### 6. Interactive 2.5D Artisan Cluster Map & Impact Analytics
* Visualizes craft clusters across India (Telangana, Rajasthan, Karnataka, Maharashtra, Bihar).
* Live telemetry: Artisans digitized, B2B GMV, and Category Demand Trends.

---

## ⚖️ License
Developed for artisan communities and buyers. All rights reserved.
