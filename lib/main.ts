import { patchUserScript } from './patcher/script';
import { patchTweeStory } from './patcher/twee';
import { initI18nData } from './init';

declare global {
  interface Window {
    YASCML: any;
    YASCHook: any;
    __AfterInit: (() => void | Promise<void>)[];
  }
}

window.YASCHook.passage.hook(patchUserScript);
window.YASCHook.passage.hook(patchTweeStory);

window.__AfterInit.push(
  initI18nData,
  () => window.YASCML.api.mod.releaseFiles(__MOD_ID__)
);
