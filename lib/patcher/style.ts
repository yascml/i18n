import { UserStylePatches } from '../const';
import { PassageBase } from 'twine-sugarcube';

const StylePassageNameReg = /^tw-user-style-\d+$/;
const UserStyleFileReg = /\/\*\stwine-user-stylesheet\s#(\d+):\s"([a-zA-Z\d\/\\\-\.]+)"\s\*\//g;
const FilePathSliptReg = /[\\\/]{1,2}/;
let stylesCount = document.querySelectorAll<HTMLScriptElement>('tw-storydata style').length;

export const patchUserStyle = (context: PassageBase, next: () => void) => {
  if (!StylePassageNameReg.test(context.name)) return next();
  if (UserStylePatches.size === 0) return next();
  if (stylesCount === 0) {
    next();
    return UserStylePatches.clear();
  }

  let result = context.text;
  const fileHeads = [ ...result.matchAll(UserStyleFileReg) ].reverse();
  for (let i = 0; i < fileHeads.length; i++) {
    const match = fileHeads[i];
    const fileName = match[2]!.split(FilePathSliptReg).pop()!;

    const patches = UserStylePatches.get(fileName);
    if (!patches) continue;

    const startIndex = match.index! + match[0].length;
    const endIndex = i === 0 ? result.length : fileHeads[i - 1].index;
    const block = result.slice(startIndex, endIndex);

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
    UserStylePatches.delete(fileName);
  }

  context.text = result;
  stylesCount--;
};
