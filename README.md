# ESCrypto

This is a typescript refactoring of [crypto-js](https://github.com/brix/crypto-js).

## Installation

```shell
npm i escrypto
```

## Example

```typescript
import { SHA1 } from 'escrypto';

const sha1 = new SHA1();
console.log({sha1});
sha1.update('hello');
sha1.update(' world!');
const hash = sha1.finalize('\n');
const sum = hash.toString();
console.log(sum);
```

## Warning

Only supported md5, sha1 and sha256 currently.

I'm not an algorithm expert, I just want to reduce the size of my app, so there is no comprehensive test.
