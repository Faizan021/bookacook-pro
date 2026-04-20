function toRow(data: Partial<PackageFormData>) {
  const status = data.status ?? "draft";
  const eventTypes = data.event_types ?? [];
  const includedItems = data.included_items ?? [];

  return {
    title: data.title ?? "",
    summary: data.summary ?? "",
    short_summary: data.summary ?? "",

    description: data.description ?? "",
    category: data.category ?? "",
    cuisine_type: data.cuisine_type ?? "",

    status,
    is_published: status === "active",
    is_active: status !== "paused",

    price_type: data.price_type ?? "per_person",
    price_amount: data.price_amount ?? 0,
    currency: data.currency ?? "EUR",

    min_guests: data.min_guests ?? null,
    max_guests: data.max_guests ?? null,

    event_types: eventTypes,
    event_type: eventTypes[0] ?? null,

    dietary_options: data.dietary_options ?? [],

    included_items: includedItems,
    includes: includedItems,

    add_ons: data.add_ons ?? [],

    service_area: data.service_area ?? "",
    setup_time_hours: data.setup_time_hours ?? null,
    setup_time_minutes: data.setup_time_minutes ?? null,
    cleanup_time_minutes: data.cleanup_time_minutes ?? null,
    booking_notice_days: data.booking_notice_days ?? null,
    max_bookings_per_day: data.max_bookings_per_day ?? null,
    cancellation_policy: data.cancellation_policy ?? null,

    images: data.images ?? [],
    image_url: data.image_url ?? null,
    cover_image_url: data.image_url ?? null,
    gallery_images: data.gallery_images ?? [],

    tags: data.tags ?? [],
    keywords: data.keywords ?? [],
    featured: data.featured ?? false,

    updated_at: new Date().toISOString(),
  };
}
