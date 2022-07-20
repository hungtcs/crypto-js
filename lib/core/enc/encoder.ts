import { WordArray } from '../lib/word-array.js';

export interface Encoder {
  /**
   * Converts a word array to a hex string.
   */
  stringify(wordArray: WordArray): string;

  /**
   * Converts a hex string to a word array.
   */
  parse(str: string): WordArray;
}
