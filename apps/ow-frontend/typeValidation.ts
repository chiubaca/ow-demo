import { z } from 'zod';

export const titleInfoSchema = z.object({
  'Title Number': z.string(),
  'Property Address': z.string(),
  Tenure: z.string(),
  X: z.number(),
  Y: z.number(),
});

export const titlesInfoSchema = z.array(titleInfoSchema);

export type TitleInfo = z.infer<typeof titleInfoSchema>;
