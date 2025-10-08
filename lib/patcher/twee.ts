import { PassagePatches, PatchedPassagesCache } from '../const';
import { PassageBase } from 'twine-sugarcube';

export const patchTweeStory = (c: PassageBase, next: () => void) => {
  const patches = PassagePatches.get(c.name);
  if (!patches) return next();
  
  const cache = PatchedPassagesCache.get(c.name);
  if (cache) {
    c.text = cache;
    return;
  }

  let result = c.text;
  for (const { position, from, to } of patches) {
    if (result.slice(position, position + from.length) === from) {
      result = result.slice(0, position) + to + result.slice(position + from.length);
    } else {
      const nearby = result.indexOf(from, Math.max(0, position - 10));
      if (nearby === -1) continue;
      result = result.slice(0, nearby) + to + result.slice(nearby + from.length);
    }
  }

  c.text = result;
  PatchedPassagesCache.set(c.name, result);
};
