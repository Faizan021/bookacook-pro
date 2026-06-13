import { z } from 'zod';

// ---------------------------------------------------------------------------
// Restaurant order validation schemas
// Mirrors lib/storefront/schemas.ts but targets the restaurant_orders flow.
// ---------------------------------------------------------------------------

/**
 * Validates the restaurant order payload coming from the client.
 * All pricing is recalculated server-side; these fields are informational only.
 */
export const restaurantOrderSchema = z.object({
  restaurant_id: z.string().uuid('Invalid restaurant ID'),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be greater than 0'),
      })
    )
    .min(1, 'Order must contain at least one item'),
  customer_name: z.string().min(1, 'Name is required'),
  customer_email: z
    .string()
    .email('Invalid email address format')
    .optional()
    .or(z.literal('')),
  customer_phone: z.string().min(6, 'Valid phone number is required'),
  fulfillment_type: z.enum(['pickup', 'delivery']),
  delivery_address: z.string().optional(),
  requested_time: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.fulfillment_type === 'delivery') {
      return !!data.delivery_address && data.delivery_address.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'Valid delivery address is required for delivery orders',
    path: ['delivery_address'],
  }
);

export type RestaurantOrderInput = z.infer<typeof restaurantOrderSchema>;

// ---------------------------------------------------------------------------
// Restaurant profile / settings validation (used by createRestaurant, updateRestaurant)
// ---------------------------------------------------------------------------

export const createRestaurantSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(60, 'Slug must be at most 60 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  description: z.string().optional(),
  phone: z.string().min(6, 'Valid phone number is required').optional(),
  email: z.string().email('Invalid email').optional(),
  business_address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  cuisine_type: z.string().optional(),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  logo_url: z.string().url().optional().or(z.literal('')),
  banner_image_url: z.string().url().optional().or(z.literal('')),
  opening_hours: z.record(z.string(), z.unknown()).optional(),
  delivery_radius_km: z.number().min(0).optional(),
  min_order_amount: z.number().min(0).optional(),
  delivery_fee: z.number().min(0).optional(),
  accepts_pickup: z.boolean().optional(),
  accepts_delivery: z.boolean().optional(),
});

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

// ---------------------------------------------------------------------------
// Restaurant product validation
// ---------------------------------------------------------------------------

export const restaurantProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  image_url: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  dietary_tags: z.array(z.string()).optional().default([]),
  allergen_info: z.string().optional(),
  is_available: z.boolean().optional().default(true),
  display_order: z.number().int().min(0).optional().default(0),
});

export type RestaurantProductInput = z.infer<typeof restaurantProductSchema>;
