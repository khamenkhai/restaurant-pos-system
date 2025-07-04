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
