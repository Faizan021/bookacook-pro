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
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email address format'),
  customerPhone: z.string().min(6, 'Valid phone number is required'),
  serviceType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional()
}).refine(data => {
  if (data.serviceType === 'delivery') {
    return !!data.deliveryAddress && data.deliveryAddress.trim().length >= 5;
  }
  return true;
}, {
  message: 'Valid delivery address is required for delivery orders',
  path: ['deliveryAddress']
});
