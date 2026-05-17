# Catering Platform Blueprint

## Core Concept

Build a catering-specific platform that combines:

- Foodieway-style discovery: customers can browse and compare caterers.
- Listando-style booking and payments: customers book and pay through the platform.
- Smalt-style free websites: every caterer gets a free professional website.
- Speisely AI matching: large events are matched to the best caterers automatically.

The platform is not a general restaurant marketplace. It is focused only on catering services: private events, corporate events, weddings, birthdays, buffets, food trucks, office lunches, and premium event catering.

## Positioning

Speisely becomes the operating system for caterers:

- A free public website for each caterer.
- A booking and payment system.
- A lead-generation marketplace.
- AI matching for high-value events.
- A dashboard for orders, revenue, availability, and insights.

The pitch to caterers is simple:

> Get a professional catering website for free. Receive direct bookings and event leads. Pay only 10% commission when you earn money.

## Revenue Model

### Channel 1: Small Direct Orders

Customers visit a caterer's free website and book directly.

Example:

- Office lunch for 20 people.
- Birthday buffet for 30 people.
- Small private catering order.

Flow:

1. Customer lands on `speisely.de/catering/[caterer-slug]`.
2. Customer views packages, menus, gallery, pricing, and availability.
3. Customer submits booking request or pays directly.
4. Speisely processes the payment.
5. Speisely takes 10% commission.
6. Caterer receives 90%.

Revenue example:

- 100 small orders/month.
- Average order value: EUR 300.
- Monthly GMV: EUR 30,000.
- Speisely commission: EUR 3,000/month.

### Channel 2: Big Catering Events

Customers with larger event needs use the AI concierge.

Example:

- Wedding with 120 guests.
- Corporate event with 300 guests.
- Conference catering.
- Gala dinner.

Flow:

1. Customer describes the event in natural language or voice.
2. AI extracts structured event data: location, guests, budget, cuisine, dietary needs, style, date, service type.
3. Matching engine scores caterers.
4. Customer receives the best-fit caterers with reasons.
5. Customer requests offers or books a selected caterer.
6. Payment runs through Speisely.
7. Speisely takes 10% commission.

Revenue example:

- 30 big events/month.
- Average order value: EUR 3,000.
- Monthly GMV: EUR 90,000.
- Speisely commission: EUR 9,000/month.

## Combined Revenue Potential

Conservative monthly scenario:

- Small direct orders: EUR 30,000 GMV -> EUR 3,000 commission.
- Big AI-matched events: EUR 90,000 GMV -> EUR 9,000 commission.
- Total commission: EUR 12,000/month.
- Annualized revenue: EUR 144,000/year.

Growth scenario:

- 100 onboarded caterers.
- 300 small orders/month at EUR 300 average.
- 60 large events/month at EUR 3,000 average.
- Total monthly GMV: EUR 270,000.
- Total monthly commission: EUR 27,000.
- Annualized revenue: EUR 324,000/year.

## Caterer Website Features

Each caterer receives a free website such as:

`speisely.de/catering/berlin-event-catering`

Required pages:

- Profile page with brand, description, location, gallery, reviews, and specialties.
- Packages page with menus, price per person, minimum guests, and service types.
- Booking page with date, guest count, location, dietary needs, and event notes.
- Contact or inquiry page.

Dashboard features:

- Edit website content.
- Upload food and event photos.
- Manage packages and menus.
- Set service areas.
- Set minimum and maximum guest count.
- Manage availability.
- See website views, leads, bookings, revenue, and conversion rate.

## AI Matching System

The AI system should help customers describe events naturally.

Example input:

> I need catering for a company summer party in Berlin for 120 people, mostly buffet, vegetarian options, around EUR 45 per person.

AI extracts:

- Occasion: corporate summer party.
- City: Berlin.
- Guests: 120.
- Budget: EUR 45 per person.
- Service style: buffet.
- Dietary needs: vegetarian options.
- Event size: large.
- Confidence score.

Matching criteria:

- Location and service area.
- Guest capacity.
- Cuisine and menu fit.
- Dietary compatibility.
- Budget fit.
- Event type experience.
- Reviews and reliability.
- Availability.
- Response speed.

The result should show not only the ranked caterers, but also why each one is a good fit.

## Platform Differentiation

Compared with restaurant discovery platforms:

- Speisely is focused on catering, not dining out.
- Customers are booking events, not tables.
- Average order value is much higher.
- Caterers need operational tools, not just visibility.

Compared with lead marketplaces:

- Speisely handles booking and payment.
- Customers get AI-guided matching.
- Caterers get free websites, not just paid leads.
- The platform earns when transactions happen, not by selling low-quality leads.

Compared with generic website builders:

- Speisely websites are connected to real bookings and payments.
- Caterers do not need to maintain hosting, plugins, or payment integrations.
- Every website also feeds into the marketplace.

## MVP Scope

Build first:

1. Free caterer profile websites.
2. Caterer package/menu management.
3. Direct booking form.
4. Booking source tracking: `website` or `marketplace`.
5. 10% commission logic for both channels.
6. AI event understanding.
7. Basic AI matching results.
8. Caterer dashboard stats.

Avoid at MVP:

- Complex subscriptions.
- Too many pricing tiers.
- Full CRM automation.
- Overbuilt design customization.
- Manual lead-sale model.

## Recommended Data Fields

Add or support these caterer fields:

- `website_slug`
- `website_enabled`
- `website_description`
- `website_hero_image_url`
- `minimum_guests`
- `maximum_guests`
- `service_areas`
- `catering_styles`
- `cuisines`
- `dietary_options`
- `average_price_per_person`
- `website_views`
- `website_bookings_count`
- `marketplace_bookings_count`

Add or support these booking fields:

- `booking_source`: `website` or `marketplace`
- `commission_rate`: default `0.10`
- `gross_amount`
- `commission_amount`
- `net_payout`
- `event_type`
- `guest_count`
- `service_city`
- `dietary_requirements`

## Go-To-Market

Start with one city and one clear segment.

Best first market:

- Independent caterers in Berlin.
- Small restaurants that already do catering.
- Food trucks and event food providers.
- Wedding and corporate caterers.

Pilot pitch:

> We build your catering website for free, connect it to online bookings and payments, and bring you event leads. You only pay 10% when you receive a paid booking.

Pilot target:

- 10 caterers.
- 30 days.
- At least 20 direct booking requests.
- At least 5 paid bookings.
- At least 1 large AI-matched event.

## Implementation Timeline

### Week 1

- Finalize business model.
- Define caterer fields.
- Design caterer website template.
- Create onboarding checklist.

### Week 2

- Build public caterer website pages.
- Build caterer profile and package editing.
- Add website slug routing.

### Week 3

- Build direct booking flow.
- Connect booking source tracking.
- Connect commission tracking.
- Add basic dashboard analytics.

### Week 4

- Add AI event understanding.
- Add matching algorithm.
- Show AI match results on large event requests.

### Week 5

- Onboard 5 to 10 pilot caterers.
- Add real packages and photos.
- Test payments, commissions, and payouts.

### Week 6

- Launch pilot publicly.
- Measure conversion.
- Fix friction in booking flow.
- Prepare sales outreach for next 50 caterers.

## Key Metrics

Marketplace metrics:

- Caterers onboarded.
- Active caterer websites.
- Website visits.
- Booking conversion rate.
- Average order value.
- Large event request volume.
- AI match-to-booking conversion.

Revenue metrics:

- Gross merchandise value.
- Commission revenue.
- Revenue per caterer.
- Website revenue vs marketplace revenue.
- Refund/dispute rate.

Caterer success metrics:

- Time to first booking.
- Monthly booking count.
- Monthly revenue.
- Repeat customer rate.
- Response time.

## Final Recommendation

Use one simple model:

- Free websites for caterers.
- 10% commission on small direct orders.
- 10% commission on big AI-matched events.
- No monthly fee at launch.
- No paid lead model at launch.

This keeps the offer easy to understand and easy to sell:

> Free website. More catering bookings. You only pay when you earn.

