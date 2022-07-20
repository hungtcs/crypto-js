import { HMAC } from '../../algo/hmac.js';
import { WordArray } from './word-array.js';
import { BufferedBlockAlgorithm } from './buffered-block-algorithm.js';

export class Hasher extends BufferedBlockAlgorithm {
  public _hash!: WordArray;

  /**
   * Configuration options.
   */
  public cfg: any = {};

  constructor(cfg?: any) {
    super();
    // Apply config defaults
    this.cfg = cfg;

    // Set initial values
    this.reset();
  }

  /**
   * Resets this hasher to its initial state.
   */
  public reset() {
    // Reset data buffer
    super.reset();

    // Perform concrete-hasher logic
    this._doReset();
  }

  public _doReset() {}

  /**
   * Updates this hasher with a message.
   */
  public update(messageUpdate: string | WordArray) {
    // Append
    this._append(messageUpdate);

    // Update the hash
    this._process();

    // Chainable
    return this;
  }

  /**
   * Finalizes the hash computation.
   * Note that the finalize operation is effectively a destructive, read-once operation.
   */
  public finalize(messageUpdate?: string | WordArray) {
    // Final message update
    if (messageUpdate) {
      this._append(messageUpdate);
    }

    // Perform concrete-hasher logic
    const hash = this._doFinalize();

    return hash;
  }

  public _doFinalize() {
    return this._hash;
  }

  public blockSize = 512 / 32;

  /**
   * Creates a shortcut function to a hasher's object interface.
   */
  public _createHelper(Hasher: any) {
    return function (message: any, cfg: any) {
      return new Hasher(cfg).finalize(message);
    };
  }

  /**
   * Creates a shortcut function to the HMAC's object interface.
   */
  public _createHmacHelper(hasher: any) {
    return function (message: any, key: any) {
      return new HMAC(hasher, key).finalize(message);
    };
  }
}
