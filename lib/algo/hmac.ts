import { Base } from '../core/lib/base.js';
import { Utf8 } from '../core/enc/utf8.js';
import { WordArray } from '../core/lib/word-array.js';
import { Hasher as _Hasher } from '../core/lib/hasher.js';

export class HMAC extends Base {
  private _hasher: _Hasher;
  private _oKey: any;
  private _iKey: any;

  constructor(Hasher: typeof _Hasher, _key: string | WordArray) {
    super();
    // Init hasher
    this._hasher = new Hasher();

    // Convert string to WordArray, else assume WordArray already
    let key = typeof _key === 'string' ? Utf8.parse(_key) : _key;

    // Shortcuts
    const hasherBlockSize = this._hasher.blockSize;
    const hasherBlockSizeBytes = hasherBlockSize * 4;

    // Allow arbitrary length keys
    if (key.sigBytes > hasherBlockSizeBytes) {
      key = this._hasher.finalize(key);
    }

    // Clamp excess bits
    key.clamp();

    // Clone key for inner and outer pads
    const oKey = (this._oKey = key.clone());
    const iKey = (this._iKey = key.clone());

    // Shortcuts
    const oKeyWords = oKey.words;
    const iKeyWords = iKey.words;

    // XOR keys with pad constants
    for (let i = 0; i < hasherBlockSize; i++) {
      oKeyWords[i] ^= 0x5c5c5c5c;
      iKeyWords[i] ^= 0x36363636;
    }
    oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

    // Set initial values
    this.reset();
  }

  /**
   * Resets this HMAC to its initial state.
   *
   * @example
   *
   *     hmacHasher.reset();
   */
  public reset() {
    // Shortcut
    const hasher = this._hasher;

    // Reset
    hasher.reset();
    hasher.update(this._iKey);
  }

  /**
   * Updates this HMAC with a message.
   */
  public update(messageUpdate: string | WordArray) {
    this._hasher.update(messageUpdate);

    // Chainable
    return this;
  }

  /**
   * Finalizes the HMAC computation.
   * Note that the finalize operation is effectively a destructive, read-once operation.
   */
  public finalize(messageUpdate: string | WordArray) {
    // Shortcut
    const hasher = this._hasher;

    // Compute HMAC
    const innerHash = hasher.finalize(messageUpdate);
    hasher.reset();
    const hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

    return hmac;
  }
}
