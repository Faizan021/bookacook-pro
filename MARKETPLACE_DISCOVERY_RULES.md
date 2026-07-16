# Speisely Marketplace Discovery Program

This document outlines the rules and fee structures associated with the **Marketplace Discovery** toggle available to restaurant partners in their dashboard.

## Overview
The Speisely Marketplace Discovery Program is an optional acquisition channel for restaurant partners. When enabled (`marketplace_discovery = true`), Speisely will actively promote the restaurant through:
- Priority placement in marketplace search results.
- Recommendations and "Featured" collections on the homepage.
- Email newsletters and social media campaigns aimed at acquiring new customers.

## Rules & Eligibility
1. **Storefront Must Be Published**: To participate in the discovery program, a restaurant must have an active, published storefront (`is_published = true`).
2. **Marketplace Visibility Must Be Enabled**: A restaurant must be opted into general marketplace visibility (`show_in_marketplace = true`).
3. **Payment Methods**: The restaurant must have at least one active payment method (Stripe Connect, PayPal, or Cash).

## Fee Structure
Orders generated through the Marketplace Discovery program carry an increased service fee compared to direct storefront orders.

- **Direct Storefront Orders**: Standard platform fee (e.g., 2% or as defined in the partner's subscription).
- **Marketplace Discovery Orders**:
  - If a customer places an order after discovering the restaurant through a Speisely promotional surface (tracked via `referral_source = 'marketplace'`), a **Marketplace Fee of 15%** will apply.
  - This fee only applies to new customers acquired through Speisely's discovery surfaces. Existing customers who order directly via the restaurant's public URL will continue to incur the standard platform fee.

## Analytics & Tracking
Admin/System operators can track the performance of the Marketplace Discovery program by querying the `restaurant_orders` table. Orders subject to the Marketplace Fee will have `referral_source` set to `'marketplace'`.
