import { z } from "zod";

export const OrderItemSchema = z.object({
  product_id: z.number(),
  variant_id: z.number().optional(), // optional if nullable
  quantity: z.number().min(1),
});

export const CreateOrderSchema = z.object({
  table_id: z.number(),
  tax: z.number().nonnegative(),
  order_items: z.array(OrderItemSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// Validate buffet order request
export const CreateBuffetOrderSchema = z.object({
  table_id: z.number(),
  buffet_id: z.number(),
  people_count: z.number().min(1),
  tax: z.number().optional(),
});


export const createReservationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().min(7, { message: 'Phone number is too short' }),
  date: z.union([
    z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    z.date()
  ]),
  people: z.number().int().positive({ message: 'People must be a positive integer' }),
  table_id: z.number().int().positive({ message: 'Table ID must be a positive integer' }),
});