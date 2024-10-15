import {z} from "zod";

export const point = z.object({
  date: z.date(),
  value: z.number(),
})

export const backDeliveryChartDataSchema = z.array(point);

export type BackDeliveryChartData = z.infer<typeof backDeliveryChartDataSchema>;
export type Point = z.infer<typeof point>;
