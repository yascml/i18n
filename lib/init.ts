import { JSONParser } from '@streamparser/json';
import { PassagePatches, UserScriptPatches } from './const';
import { ReplaceInfo, PassagePatch } from './types';
import { ParsedElementInfo } from '@streamparser/json/utils/types/parsedElementInfo.js';

// TODO: types
declare global {
  interface Window {
    YASCML: any;
    YASCHook: any;
  }
}

export const initI18nData = () => new Promise<void>(async (res, rej) => {
  const mod = window.YASCML.api.mod.get(__MOD_ID__);
  const modZip = mod.zip;
  if (!modZip) {
    return rej('Mod zip not loaded, this mod will not be loaded');
  }

  const i18nFile = modZip.file('i18n.json');
  if (!i18nFile) {
    return rej('i18n.json not found, this mod will not be loaded');
  }

  const parser = new JSONParser({
    stringBufferSize: 1024,
    keepStack: false,
    paths: [ '$.typeB.TypeBInputStoryScript.*', '$.typeB.TypeBOutputText.*' ]
  });

  parser.onValue = ({ value, stack }: ParsedElementInfo) => {
    if (!value) return;

    const parent = stack[stack.length - 1];
    if (!parent) return;

    const v = value as ReplaceInfo;
    if (parent.key === 'TypeBInputStoryScript') {
      if (!v.pN) return;

      let patches: PassagePatch[] = PassagePatches.get(v.pN)!;
      if (!patches) {
        patches = [];
        PassagePatches.set(v.pN, patches);
      }

      patches.push({
        position: v.pos,
        from: v.f,
        to: v.t,
      });
      patches.sort((a, b) => a.position - b.position);
    }

    if (parent.key === 'TypeBOutputText') {
      if (v.js) {
        if (v.fileName) {
          let patches: ReplaceInfo[] = UserScriptPatches.get(v.fileName)!;
          if (!patches) {
            patches = [];
            UserScriptPatches.set(v.fileName, patches);
          }
          patches.push(v);
        }
      }
    }
  };

  const stream = i18nFile.internalStream('string');
  stream
    .on('data', (chunk: string) => parser.write(chunk))
    .on('error', (e: Error) => rej(e))
    .on('end', () => res(void 0))
    .resume();
});
