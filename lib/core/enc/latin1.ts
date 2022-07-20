import { WordArray } from '../lib/word-array.js';
import { Encoder } from './encoder.js';

export const Latin1: Encoder = {
  stringify(wordArray: WordArray) {
    // Shortcuts
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;

    // Convert
    const latin1Chars: any[] = [];
    for (let i = 0; i < sigBytes; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      latin1Chars.push(String.fromCharCode(bite));
    }

    return latin1Chars.join('');
  },
  parse(latin1Str: string) {
    // Shortcut
    const latin1StrLength = latin1Str.length;

    // Convert
    const words: any[] = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    }

    return new WordArray(words, latin1StrLength);
  }
};
