import { expect } from '@esm-bundle/chai';
import { MD5 } from './md5.js';

describe('algo/md5', () => {
  it('should get md5sum', () => {
    const md5sum = new MD5().finalize('hello world!\n').toString();
    expect(md5sum).equals('c897d1410af8f2c74fba11b1db511e9e');
  });
  it('should support progressive hashing', () => {
    const md5 = new MD5();
    md5.update('hello');
    md5.update(' ');
    md5.update('world!');
    const md5sum = md5.finalize('\n').toString();
    expect(md5sum).equals('c897d1410af8f2c74fba11b1db511e9e');
  });
});
