# DATABASE_SCHEMA.md: KARIGASETU AI

## 1. Overview & Storage Engine
KARIGASETU AI utilizes a relational model designed for **PostgreSQL 15+** with the **pgvector** extension for vector similarity search, while maintaining full compatibility with SQLite for zero-dependency local development, automated testing, and embedded environments.

---

## 2. Table Specifications

### 2.1 Identity & Authentication

#### `users`
Core user identity for sellers, buyers, and administrators.
* `id` (VARCHAR(36), PK): UUID primary key.
* `email` (VARCHAR(255), UNIQUE, NULLABLE): Verified email address.
* `mobile` (VARCHAR(20), UNIQUE, NULLABLE): E.164 formatted phone number.
* `google_id` (VARCHAR(128), UNIQUE, NULLABLE): Google OAuth sub identifier.
* `role` (VARCHAR(20), NOT NULL): Enum: `SELLER`, `BUYER`, `ADMIN`.
* `email_verified` (BOOLEAN, DEFAULT FALSE): Email verification status.
* `mobile_verified` (BOOLEAN, DEFAULT FALSE): Mobile verification status.
* `status` (VARCHAR(20), DEFAULT 'ACTIVE'): Enum: `ACTIVE`, `SUSPENDED`, `PENDING_REVIEW`.
* `created_at` (TIMESTAMP, DEFAULT NOW()): Account creation timestamp.
* `updated_at` (TIMESTAMP, DEFAULT NOW()): Last modification timestamp.
* `last_login` (TIMESTAMP, NULLABLE): Timestamp of most recent session.

#### `oauth_accounts`
Linked third-party identity accounts.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, ON DELETE CASCADE).
* `provider` (VARCHAR(50), NOT NULL): e.g., 'google'.
* `provider_user_id` (VARCHAR(255), NOT NULL): Unique ID from provider.
* `access_token` (TEXT, NULLABLE): Encrypted token.
* `refresh_token` (TEXT, NULLABLE): Encrypted token.
* `expires_at` (TIMESTAMP, NULLABLE).
* *Index*: `(provider, provider_user_id)` UNIQUE.

#### `otp_verifications`
Short-lived 6-digit challenge codes for email/mobile login.
* `id` (VARCHAR(36), PK): UUID primary key.
* `recipient` (VARCHAR(255), NOT NULL): Email or mobile number.
* `channel` (VARCHAR(10), NOT NULL): Enum: `EMAIL`, `SMS`.
* `otp_hash` (VARCHAR(128), NOT NULL): Cryptographic hash of the 6-digit code.
* `attempts` (INTEGER, DEFAULT 0): Failed entry attempts (max 3).
* `is_used` (BOOLEAN, DEFAULT FALSE): Consumed flag.
* `expires_at` (TIMESTAMP, NOT NULL): Expiry timestamp (typically 3 minutes).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `sessions`
Active JWT bearer tokens and client device sessions.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, ON DELETE CASCADE).
* `token_jti` (VARCHAR(64), UNIQUE, NOT NULL): JWT Unique Identifier.
* `device_info` (VARCHAR(255), NULLABLE): Client User-Agent or Android device model.
* `ip_address` (VARCHAR(45), NULLABLE).
* `expires_at` (TIMESTAMP, NOT NULL).
* `is_revoked` (BOOLEAN, DEFAULT FALSE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

---

### 2.2 Profiles & Clusters

#### `artisan_clusters`
Traditional geographical craft clusters across India.
* `id` (VARCHAR(36), PK): UUID primary key.
* `name` (VARCHAR(150), NOT NULL): e.g., "Pochampally Handloom Cluster".
* `state` (VARCHAR(100), NOT NULL): e.g., "Telangana".
* `district` (VARCHAR(100), NOT NULL): e.g., "Yadadri Bhuvanagiri".
* `primary_craft` (VARCHAR(100), NOT NULL): e.g., "Ikat Weaving".
* `latitude` (DOUBLE PRECISION, NOT NULL).
* `longitude` (DOUBLE PRECISION, NOT NULL).
* `artisan_count` (INTEGER, DEFAULT 0).
* `description` (TEXT, NULLABLE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `seller_profiles`
Comprehensive profile for artisans and craft collectives.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, UNIQUE, ON DELETE CASCADE).
* `full_name` (VARCHAR(150), NOT NULL): Artisan name.
* `business_name` (VARCHAR(200), NULLABLE): Enterprise / self-help group name.
* `cluster_id` (VARCHAR(36), FK -> artisan_clusters.id, NULLABLE).
* `primary_craft` (VARCHAR(100), NOT NULL): e.g., "Handloom", "Leathercraft".
* `experience_years` (INTEGER, DEFAULT 0).
* `monthly_capacity_units` (INTEGER, DEFAULT 10): Monthly production capacity.
* `preferred_language` (VARCHAR(10), DEFAULT 'en'): ISO 639-1 language code.
* `location` (VARCHAR(255), NOT NULL): City, State.
* `profile_image_url` (TEXT, NULLABLE).
* `story` (TEXT, NULLABLE): Artisan origin and heritage story.
* `story_audio_url` (TEXT, NULLABLE): Raw spoken voice recording.
* `verification_badge` (VARCHAR(30), DEFAULT 'UNVERIFIED'): `UNVERIFIED`, `PROFILE_VERIFIED`, `ARTISAN_VERIFIED`.
* `readiness_score` (INTEGER, DEFAULT 40): Digital Business Readiness score (0-100).
* `export_readiness_score` (INTEGER, DEFAULT 30): Export readiness checklist score (0-100).
* `created_at` (TIMESTAMP, DEFAULT NOW()).
* `updated_at` (TIMESTAMP, DEFAULT NOW()).

#### `buyer_profiles`
Purchaser profile for retailers, institutions, and corporate buyers.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, UNIQUE, ON DELETE CASCADE).
* `contact_name` (VARCHAR(150), NOT NULL).
* `company_name` (VARCHAR(200), NOT NULL).
* `buyer_type` (VARCHAR(30), NOT NULL): `INDIVIDUAL`, `RETAILER`, `WHOLESALER`, `CORPORATE`, `INSTITUTIONAL`, `GOVERNMENT`.
* `location` (VARCHAR(255), NOT NULL).
* `typical_order_size` (INTEGER, DEFAULT 50).
* `verified_buyer` (BOOLEAN, DEFAULT FALSE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `buyer_preferences`
Stored preference weights for personalized recommendations.
* `id` (VARCHAR(36), PK): UUID primary key.
* `buyer_id` (VARCHAR(36), FK -> buyer_profiles.id, ON DELETE CASCADE).
* `craft_categories` (TEXT, NOT NULL): Comma-separated or JSON list of interests.
* `max_budget` (NUMERIC(12, 2), NULLABLE).
* `preferred_regions` (TEXT, NULLABLE).

---

### 2.3 Product Catalog & AI Pipeline

#### `products`
The core handmade product catalogue.
* `id` (VARCHAR(36), PK): UUID primary key.
* `seller_id` (VARCHAR(36), FK -> seller_profiles.id, ON DELETE CASCADE).
* `name` (VARCHAR(255), NOT NULL): Product title.
* `description` (TEXT, NOT NULL): Comprehensive description.
* `category` (VARCHAR(100), NOT NULL): e.g., "Textiles & Apparels", "Leather Goods".
* `subcategory` (VARCHAR(100), NULLABLE): e.g., "Sarees", "Handbags".
* `material` (VARCHAR(150), NOT NULL): e.g., "Pure Silk", "Vegetable Tanned Leather".
* `craft_type` (VARCHAR(100), NOT NULL): e.g., "Handloom Ikat", "Hand Tooled".
* `color` (VARCHAR(50), NULLABLE).
* `dimensions` (VARCHAR(100), NULLABLE): Length x Width x Height.
* `weight` (VARCHAR(50), NULLABLE): In grams or kg.
* `production_time` (VARCHAR(50), NOT NULL): e.g., "3 days".
* `price` (NUMERIC(10, 2), NOT NULL): Base retail price in INR.
* `quantity` (INTEGER, DEFAULT 1): Stock on hand.
* `status` (VARCHAR(20), DEFAULT 'PUBLISHED'): `DRAFT`, `PUBLISHED`, `SOLD_OUT`, `ARCHIVED`.
* `quality_score` (INTEGER, DEFAULT 85): Photographic quality index (0-100).
* `ai_confidence` (NUMERIC(4, 2), DEFAULT 0.90): Extraction confidence (0.00-1.00).
* `verified_product` (BOOLEAN, DEFAULT FALSE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).
* `updated_at` (TIMESTAMP, DEFAULT NOW()).

#### `product_images`
Product imagery including raw uploads and AI-enhanced studio renders.
* `id` (VARCHAR(36), PK): UUID primary key.
* `product_id` (VARCHAR(36), FK -> products.id, ON DELETE CASCADE).
* `raw_image_url` (TEXT, NOT NULL): Artisan camera photo.
* `enhanced_image_url` (TEXT, NULLABLE): Studio lighting and balanced photo.
* `thumbnail_url` (TEXT, NULLABLE).
* `is_primary` (BOOLEAN, DEFAULT TRUE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `product_ai_analysis`
Diagnostic computer vision assessment of captured imagery.
* `id` (VARCHAR(36), PK): UUID primary key.
* `product_id` (VARCHAR(36), FK -> products.id, ON DELETE CASCADE).
* `sharpness_score` (INTEGER, NOT NULL): Laplacian variance rating (0-100).
* `lighting_score` (INTEGER, NOT NULL): Luminance balance (0-100).
* `background_score` (INTEGER, NOT NULL): Background clutter score (0-100).
* `overall_score` (INTEGER, NOT NULL): Composite score (0-100).
* `recommendation_tip` (TEXT, NULLABLE): Actionable advice for the artisan.
* `detected_objects` (TEXT, NULLABLE): JSON array of detected object labels.
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `product_translations`
Multilingual localized catalogue versions for national and global buyers.
* `id` (VARCHAR(36), PK): UUID primary key.
* `product_id` (VARCHAR(36), FK -> products.id, ON DELETE CASCADE).
* `language_code` (VARCHAR(10), NOT NULL): `en`, `hi`, `te`, etc.
* `translated_name` (VARCHAR(255), NOT NULL).
* `translated_description` (TEXT, NOT NULL).
* `created_at` (TIMESTAMP, DEFAULT NOW()).
* *Index*: `(product_id, language_code)` UNIQUE.

#### `pricing_predictions`
Transparent cost-plus and demand breakdown for AI price suggestions.
* `id` (VARCHAR(36), PK): UUID primary key.
* `product_id` (VARCHAR(36), FK -> products.id, ON DELETE CASCADE).
* `material_cost` (NUMERIC(10, 2), NOT NULL).
* `labour_hours` (NUMERIC(6, 2), NOT NULL).
* `labour_cost` (NUMERIC(10, 2), NOT NULL).
* `packaging_cost` (NUMERIC(10, 2), NOT NULL).
* `shipping_cost` (NUMERIC(10, 2), NOT NULL).
* `desired_margin` (NUMERIC(10, 2), NOT NULL).
* `demand_premium` (NUMERIC(10, 2), DEFAULT 0.00).
* `market_average` (NUMERIC(10, 2), NOT NULL).
* `recommended_price` (NUMERIC(10, 2), NOT NULL).
* `min_price` (NUMERIC(10, 2), NOT NULL).
* `max_price` (NUMERIC(10, 2), NOT NULL).
* `confidence` (NUMERIC(4, 2), NOT NULL).
* `explanation` (TEXT, NOT NULL): Human-readable breakdown.
* `model_version` (VARCHAR(20), DEFAULT 'v1.0').
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `market_prices`
Benchmarking registry of historic and regional craft market values.
* `id` (VARCHAR(36), PK): UUID primary key.
* `category` (VARCHAR(100), NOT NULL).
* `craft_type` (VARCHAR(100), NOT NULL).
* `average_retail_price` (NUMERIC(10, 2), NOT NULL).
* `low_price` (NUMERIC(10, 2), NOT NULL).
* `high_price` (NUMERIC(10, 2), NOT NULL).
* `region` (VARCHAR(100), NULLABLE).
* `updated_at` (TIMESTAMP, DEFAULT NOW()).

---

### 2.4 B2B Market Linkage & Orders

#### `rfqs` (Request For Quotations)
Bulk sourcing requisitions submitted by B2B buyers.
* `id` (VARCHAR(36), PK): UUID primary key.
* `buyer_id` (VARCHAR(36), FK -> buyer_profiles.id, ON DELETE CASCADE).
* `target_product_id` (VARCHAR(36), FK -> products.id, NULLABLE).
* `category` (VARCHAR(100), NOT NULL).
* `quantity` (INTEGER, NOT NULL).
* `target_price` (NUMERIC(10, 2), NOT NULL): Target budget per unit.
* `delivery_deadline` (TIMESTAMP, NOT NULL).
* `delivery_location` (VARCHAR(255), NOT NULL).
* `custom_requirements` (TEXT, NULLABLE).
* `notes` (TEXT, NULLABLE).
* `status` (VARCHAR(20), DEFAULT 'OPEN'): `OPEN`, `MATCHED`, `CLOSED`, `CANCELLED`.
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `rfq_responses`
Proposals, counters, and acceptance records between artisans and buyers.
* `id` (VARCHAR(36), PK): UUID primary key.
* `rfq_id` (VARCHAR(36), FK -> rfqs.id, ON DELETE CASCADE).
* `seller_id` (VARCHAR(36), FK -> seller_profiles.id, ON DELETE CASCADE).
* `quoted_price` (NUMERIC(10, 2), NOT NULL): Unit offer.
* `quantity` (INTEGER, NOT NULL).
* `delivery_date` (TIMESTAMP, NOT NULL).
* `message` (TEXT, NULLABLE).
* `ai_suggested_counter` (NUMERIC(10, 2), NULLABLE): "Ask AI" negotiation recommendation.
* `status` (VARCHAR(20), DEFAULT 'SUBMITTED'): `SUBMITTED`, `COUNTERED`, `ACCEPTED`, `REJECTED`.
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `orders`
Commercial orders finalized between buyers and artisans.
* `id` (VARCHAR(36), PK): UUID primary key.
* `buyer_id` (VARCHAR(36), FK -> buyer_profiles.id, ON DELETE RESTRICT).
* `seller_id` (VARCHAR(36), FK -> seller_profiles.id, ON DELETE RESTRICT).
* `rfq_id` (VARCHAR(36), FK -> rfqs.id, NULLABLE).
* `total_amount` (NUMERIC(12, 2), NOT NULL).
* `status` (VARCHAR(20), DEFAULT 'PENDING'): `PENDING`, `ACCEPTED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
* `payment_status` (VARCHAR(20), DEFAULT 'ESCROW_HELD'): `PENDING`, `ESCROW_HELD`, `RELEASED`, `REFUNDED`.
* `shipping_status` (VARCHAR(20), DEFAULT 'NOT_DISPATCHED'): `NOT_DISPATCHED`, `IN_TRANSIT`, `DELIVERED`.
* `tracking_number` (VARCHAR(100), NULLABLE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).
* `updated_at` (TIMESTAMP, DEFAULT NOW()).

#### `order_items`
Line items within each order.
* `id` (VARCHAR(36), PK): UUID primary key.
* `order_id` (VARCHAR(36), FK -> orders.id, ON DELETE CASCADE).
* `product_id` (VARCHAR(36), FK -> products.id, ON DELETE RESTRICT).
* `unit_price` (NUMERIC(10, 2), NOT NULL).
* `quantity` (INTEGER, NOT NULL).
* `total_price` (NUMERIC(12, 2), NOT NULL).

#### `payments`
Escrow and settlement records.
* `id` (VARCHAR(36), PK): UUID primary key.
* `order_id` (VARCHAR(36), FK -> orders.id, ON DELETE CASCADE).
* `amount` (NUMERIC(12, 2), NOT NULL).
* `provider` (VARCHAR(50), DEFAULT 'DEMO_ESCROW').
* `transaction_ref` (VARCHAR(100), UNIQUE, NOT NULL).
* `status` (VARCHAR(20), DEFAULT 'SUCCESS').
* `created_at` (TIMESTAMP, DEFAULT NOW()).

---

### 2.5 Discovery, Semantic Search & AI Support

#### `embeddings`
Vector representations for semantic natural-language matching.
* `id` (VARCHAR(36), PK): UUID primary key.
* `entity_type` (VARCHAR(20), NOT NULL): `PRODUCT`, `BUYER_QUERY`, `ARTISAN_PROFILE`.
* `entity_id` (VARCHAR(36), NOT NULL).
* `vector_json` (TEXT, NOT NULL): Stored float array (pgvector column in PostgreSQL).
* `created_at` (TIMESTAMP, DEFAULT NOW()).
* *Index*: `(entity_type, entity_id)`.

#### `search_history`
Natural language search records and demand signal telemetry.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, NULLABLE).
* `query` (TEXT, NOT NULL).
* `parsed_category` (VARCHAR(100), NULLABLE).
* `parsed_budget` (NUMERIC(10, 2), NULLABLE).
* `results_count` (INTEGER, DEFAULT 0).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `ai_conversations`
Voice and text session interactions with the AI Business Assistant.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, ON DELETE CASCADE).
* `role` (VARCHAR(20), NOT NULL): `user` or `assistant`.
* `content` (TEXT, NOT NULL).
* `language` (VARCHAR(10), DEFAULT 'en').
* `audio_url` (TEXT, NULLABLE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `notifications`
Alerts for RFQ responses, counter-offers, and order updates.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, ON DELETE CASCADE).
* `title` (VARCHAR(200), NOT NULL).
* `body` (TEXT, NOT NULL).
* `type` (VARCHAR(50), NOT NULL): e.g., `RFQ_NEW`, `ORDER_STATUS`, `PRICE_TIP`.
* `is_read` (BOOLEAN, DEFAULT FALSE).
* `action_url` (VARCHAR(255), NULLABLE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

---

### 2.6 Governance, Offline Sync & Auditing

#### `verification_records`
Audit trail of artisan identity and craft authenticity inspections.
* `id` (VARCHAR(36), PK): UUID primary key.
* `seller_id` (VARCHAR(36), FK -> seller_profiles.id, ON DELETE CASCADE).
* `verifier_id` (VARCHAR(36), FK -> users.id, NULLABLE).
* `verification_type` (VARCHAR(50), NOT NULL): `IDENTITY`, `CRAFT_SKILL`, `WORKSHOP_GEO`.
* `status` (VARCHAR(20), DEFAULT 'VERIFIED'): `PENDING`, `VERIFIED`, `REJECTED`.
* `notes` (TEXT, NULLABLE).
* `created_at` (TIMESTAMP, DEFAULT NOW()).

#### `sync_queue`
Pending offline actions queued on mobile clients for reliable synchronization.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), FK -> users.id, ON DELETE CASCADE).
* `client_mutation_id` (VARCHAR(64), UNIQUE, NOT NULL): Client idempotency key.
* `action_type` (VARCHAR(50), NOT NULL): e.g., `CREATE_PRODUCT_DRAFT`, `UPDATE_PRICE`.
* `payload_json` (TEXT, NOT NULL).
* `status` (VARCHAR(20), DEFAULT 'PENDING'): `PENDING`, `PROCESSED`, `FAILED`.
* `attempts` (INTEGER, DEFAULT 0).
* `created_at` (TIMESTAMP, DEFAULT NOW()).
* `processed_at` (TIMESTAMP, NULLABLE).

#### `audit_logs`
Immutable administrative event trail.
* `id` (VARCHAR(36), PK): UUID primary key.
* `user_id` (VARCHAR(36), NULLABLE).
* `action` (VARCHAR(100), NOT NULL).
* `resource` (VARCHAR(100), NOT NULL).
* `details` (TEXT, NULLABLE).
* `ip_address` (VARCHAR(45), NULLABLE).
* `timestamp` (TIMESTAMP, DEFAULT NOW()).
