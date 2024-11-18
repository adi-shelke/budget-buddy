import { currencies } from "@/lib/constants";
import { z } from "zod";
export const updatedUserCurrency = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((c) => value === value);

    if (!found) {
      throw new Error("Invalid currency");
    }

    return value;
  }),
});
