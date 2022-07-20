import { Latin1 } from './latin1.js';
import { Encoder } from './encoder.js';
import { WordArray } from '../lib/word-array.js';

export const Utf8: Encoder = {
  stringify(wordArray: any) {
    try {
      return decodeURIComponent(escape(Latin1.stringify(wordArray)));
    } catch (e) {
      throw new Error('Malformed UTF-8 data');
    }
  },
  parse(utf8Str: string): WordArray {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
