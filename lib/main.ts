import { PassagePatches, PatchedPassagesCache } from './const';
import { patchUserScript } from './patcher/script';
import { initI18nData } from './init';
import { PassageBase } from 'twine-sugarcube';

declare global {
  interface Window {
    YASCML: any;
    YASCHook: any;
    __AfterInit: (() => void | Promise<void>)[];
  }
}

window.YASCHook.passage.hook(patchUserScript);
window.YASCHook.passage.hook((c: PassageBase, next: () => void) => {
  const patches = PassagePatches.get(c.name);
  if (!patches) return next();
  
  const cache = PatchedPassagesCache.get(c.name);
  if (cache) {
    c.text = cache;
    return;
  }

  const parts: string[] = [];
  let lastIndex = 0;

  for (const { position, from, to } of patches) {
    let index = c.text.indexOf(from, position - 10);
    if (index === -1) index = position;

    parts.push(c.text.slice(lastIndex, index));
    parts.push(to);
    lastIndex = index + from.length;
  }
  parts.push(c.text.slice(lastIndex));

  const result = parts.join('');
  c.text = result;
  PatchedPassagesCache.set(c.name, result);
});

window.__AfterInit.push(
  initI18nData,
  () => window.YASCML.api.mod.releaseFiles(__MOD_ID__)
);
