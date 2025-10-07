import QuickLRU from 'quick-lru';
import { PassagePatch } from './types';

export const PassagePatches = new Map<string, PassagePatch[]>();

export const PatchedPassagesCache = new QuickLRU<string, string>({
  maxSize: 20,
});
