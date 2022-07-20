import { Utf8 } from '../enc/utf8.js';
import { Base } from './base.js';
import { WordArray } from './word-array.js';

export class BufferedBlockAlgorithm extends Base {
  protected _minBufferSize: number = 0;
  protected _data!: WordArray;
  protected _nDataBytes!: number;

  public blockSize!: number;

  /**
   * Resets this block algorithm's data buffer to its initial state.
   */
  public reset() {
    // Initial values
    this._data = new WordArray();
    this._nDataBytes = 0;
  }

  /**
   * Adds new data to this block algorithm's buffer.
   */
  public _append(data: string | any) {
    // Convert string to WordArray, else assume WordArray already
    if (typeof data == 'string') {
      data = Utf8.parse(data);
    }

    // Append
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }

  /**
   * Processes available data blocks.
   */
  public _process(doFlush?: boolean) {
    let processedWords;

    // Shortcuts
    const data = this._data;
    const dataWords = data.words;
    const dataSigBytes = data.sigBytes;
    const blockSize = this.blockSize;
    const blockSizeBytes = blockSize * 4;

    // Count blocks ready
    let nBlocksReady = dataSigBytes / blockSizeBytes;
    if (doFlush) {
      // Round up to include partial blocks
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      // Round down to include only full blocks,
      // less the number of blocks that must remain in the buffer
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }

    // Count words ready
    const nWordsReady = nBlocksReady * blockSize;

    // Count bytes ready
    const nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

    // Process blocks
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += blockSize) {
        // Perform concrete-algorithm logic
        this._doProcessBlock(dataWords, offset);
      }

      // Remove processed words
      processedWords = dataWords.splice(0, nWordsReady);
      data.sigBytes -= nBytesReady;
    }

    // Return processed words
    return new WordArray(processedWords, nBytesReady);
  }

  public _doProcessBlock(_dataWords: number[], _offset: number) {

  }

}
