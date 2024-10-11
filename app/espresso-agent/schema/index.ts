import { z } from "zod";

export type EspressoShot = z.infer<typeof espressoShotSchema>;

export const espressoShotSchema = z.object({
  grindSize: z.number(),
  grindTime: z.number(),
  grindWeight: z.number(),
  shotTime: z.number(),
  shotWeight: z.number(),
  notes: z.string().optional(),
});
