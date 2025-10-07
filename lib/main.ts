import { initI18nData } from './init';

declare global {
  interface Window {
    __AfterInit: (void | Promise<void>)[];
  }
}

window.__AfterInit.push(initI18nData());