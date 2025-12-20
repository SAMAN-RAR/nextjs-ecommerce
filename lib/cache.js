import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

export const cache = (cb, keyParts, options) => {
  return nextCache(reactCache(cb), keyParts, options);
};
