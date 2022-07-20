import { SHA1 } from '../lib/algo/sha1';
import { SHA256 } from '../lib/algo/sha256';
import { MD5 } from '../lib/algo/md5';

function sha1test() {
  const sha1 = new SHA1();
  console.log({sha1});
  sha1.update('hello');
  sha1.update(' world!');
  const hash = sha1.finalize('\n');
  const sum = hash.toString();
  console.log(sum);
}

function sha256test() {
  const sha256 = new SHA256();
  console.log({sha1: sha256});
  sha256.update('hello');
  sha256.update(' world!');
  const hash = sha256.finalize('\n');
  const sum = hash.toString();
  console.log(sum);
}

function md5test() {
  const md5 = new MD5();
  console.log({sha1: md5});
  md5.update('hello');
  md5.update(' world!');
  const hash = md5.finalize('\n');
  const sum = hash.toString();
  console.log(sum);
}

async function main() {
  sha1test();
  sha256test();
  md5test();
}

main().catch(err => console.error(err));
