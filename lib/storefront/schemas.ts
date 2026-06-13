import { z } from 'zod';

/**
 * Validates the storefront order payload from the client.
 * Fix #3: Ensure valid emails, positive quantities, and required delivery addresses.
 */
export const storefrontOrderSchema = z.object({
  caterer_id: z.string().uuid('Invalid caterer ID'),
  items: z.array(z.object({
    product_id: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be greater than 0')
  })).min(1, 'Order must contain at least one item'),
  customer_name: z.string().min(1, 'Name is required'),
  customer_email: z.string().email('Invalid email address format').optional().or(z.literal('')),
  customer_phone: z.string().min(6, 'Valid phone number is required'),
  fulfillment_type: z.enum(['pickup', 'delivery']),
  delivery_address: z.string().optional(),
  requested_time: z.string().optional(),
  notes: z.string().optional()
}).refine(data => {
  if (data.fulfillment_type === 'delivery') {
    return !!data.delivery_address && data.delivery_address.trim().length >= 5;
  }
  return true;
}, {
  message: 'Valid delivery address is required for delivery orders',
  path: ['delivery_address']
});
