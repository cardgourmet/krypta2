import { z } from 'zod';

export const cardDetailDefaults = { lang: 'en' };
export const cardDetailSearchSchema = z.object({
  lang: z.string().default(cardDetailDefaults.lang),
});
export type CardDetailsSearch = z.infer<typeof cardDetailSearchSchema>;
