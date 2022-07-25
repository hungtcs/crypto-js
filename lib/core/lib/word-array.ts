import { Base } from './base.js';
import { Hex } from '../enc/hex.js';
import { Encoder } from '../enc/encoder.js';
import { cryptoSecureRandomInt } from '../util.js';

export class WordArray extends Base {
  public words: Array<number>;
  public sigBytes: number;

  constructor(typedArray?: ArrayBuffer, sigBytes?: number);
  constructor(typedArray?: Uint8Array, sigBytes?: number);
  constructor(typedArray?: Array<number>, sigBytes?: number);
  constructor(typedArray: Array<number> | Uint8Array | ArrayBuffer = [], sigBytes?: number) {
    super();

    // Convert buffers to uint8
    if (typedArray instanceof ArrayBuffer) {
      typedArray = new Uint8Array(typedArray);
    }

    // Convert other array views to uint8
    if (
      typedArray instanceof Int8Array ||
      (typeof Uint8ClampedArray !== 'undefined' &&
        typedArray instanceof Uint8ClampedArray) ||
      typedArray instanceof Int16Array ||
      typedArray instanceof Uint16Array ||
      typedArray instanceof Int32Array ||
      typedArray instanceof Uint32Array ||
      typedArray instanceof Float32Array ||
      typedArray instanceof Float64Array
    ) {
      typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    }

    // Handle Uint8Array
    if (typedArray instanceof Uint8Array) {
      // Shortcut
      const typedArrayByteLength = typedArray.byteLength;

      // Extract bytes
      const words: number[] = [];
      for (let i = 0; i < typedArrayByteLength; i++) {
        words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
      }

      this.words = words;
      this.sigBytes = typedArrayByteLength;
    } else {
      this.words = typedArray as Array<number>;
      this.sigBytes = sigBytes ?? (typedArray as Array<number>).length * 4;
    }
  }

  /**
   * Converts this word array to a string.
   */
  public override toString(encoder?: Encoder) {
    return (encoder || Hex).stringify(this);
  }

  /**
   * Concatenates a word array to this word array.
   */
  public concat(wordArray: WordArray) {
    // Shortcuts
    const thisWords = this.words;
    const thatWords = wordArray.words;
    const thisSigBytes = this.sigBytes;
    const thatSigBytes = wordArray.sigBytes;

    // Clamp excess bits
    this.clamp();

    // Concat
    if (thisSigBytes % 4) {
      // Copy one byte at a time
      for (let i = 0; i < thatSigBytes; i++) {
        const thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        thisWords[(thisSigBytes + i) >>> 2] |=
          thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
      }
    } else {
      // Copy one word at a time
      for (let j = 0; j < thatSigBytes; j += 4) {
        thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
      }
    }
    this.sigBytes += thatSigBytes;

    // Chainable
    return this;
  }

  /**
   * Removes insignificant bits.
   */
  public clamp() {
    // Shortcuts
    const words = this.words;
    const sigBytes = this.sigBytes;

    // Clamp
    words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
    words.length = Math.ceil(sigBytes / 4);
  }

  /**
   * Creates a copy of this word array.
   */
  public clone() {
    return new WordArray(this.words.slice(), this.sigBytes);
  }

  /**
   * Creates a word array filled with random bytes.
   */
  public random(nBytes: number) {
    const words: number[] = [];

    for (let i = 0; i < nBytes; i += 4) {
      words.push(cryptoSecureRandomInt());
    }

    return new WordArray(words, nBytes);
  }
}
