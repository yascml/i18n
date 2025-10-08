import { JSONParser } from '@streamparser/json';
import { PassagePatches } from './const';
import { ReplaceInfo, PassagePatch } from './types';
import { ParsedElementInfo } from '@streamparser/json/utils/types/parsedElementInfo.js';

// TODO: types
declare global {
  interface Window {
    YASCML: any;
    YASCHook: any;
  }
}

const FilePathSliptReg = /[\\\/]{1,2}/;
const UserScriptFileReg = /\/\*\stwine-user-script\s#(\d+):\s"([a-zA-Z\d\/\\\-\.]+)"\s\*\//g;

const userScriptPatchesWithName = new Map<string, ReplaceInfo[]>();

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
          let patches: ReplaceInfo[] = userScriptPatchesWithName.get(v.fileName)!;
          if (!patches) {
            patches = [];
            userScriptPatchesWithName.set(v.fileName, patches);
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

export const patchUserScript = () => {
  if (userScriptPatchesWithName.size <= 0) return;

  const scriptDOM = document.querySelector<HTMLScriptElement>('tw-storydata > script#twine-user-script');
  if (!scriptDOM) {
    console.warn('User script was not found in game data, skipping...');
    return;
  }

  const scriptTextNode = scriptDOM.firstChild as Text;
  if (!scriptTextNode) {
    console.warn('Cannot find TextNode in user script DOM, skipping...');
    return;
  }
  let result = scriptTextNode.data;

  const fileHeads = [ ...result.matchAll(UserScriptFileReg) ].reverse();
  for (let i = 0; i < fileHeads.length; i++) {
    const match = fileHeads[i];
    const fileName = match[2]!.split(FilePathSliptReg).pop()!;

    const patches = userScriptPatchesWithName.get(fileName);
    if (!patches) continue;

    const startIndex = match.index! + match[0].length;
    const endIndex = i === 0 ? result.length : fileHeads[i - 1].index;
    const block = result.slice(startIndex, endIndex);

    patches.sort((a, b) => b.pos - a.pos);
    let newBlock = block;
    for (const patch of patches) {
      const index = patch.pos;
      if (newBlock.slice(index, index + patch.f.length) === patch.f) {
        newBlock = newBlock.slice(0, index) + patch.t + newBlock.slice(index + patch.f.length);
      } else {
        const nearby = newBlock.indexOf(patch.f, Math.max(0, index - 10));
        if (nearby === -1) continue;
        newBlock = newBlock.slice(0, nearby) + patch.t + newBlock.slice(nearby + patch.f.length);
      }
    }

    result = result.slice(0, startIndex) + newBlock + result.slice(endIndex);
    userScriptPatchesWithName.delete(fileName);
  }
  userScriptPatchesWithName.clear();

  scriptTextNode.data = result;
};
