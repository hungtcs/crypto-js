import { WordArray } from '../lib';
import { SHA1 } from '../lib/algo/sha1';

function readFile(file: File, chunkSize: number, callback: (buffer: ArrayBuffer, stat: any, next: null | (() => void)) => void) {
  let offset = 0;
  const next = () => {
    let end: number;
    if ((end = offset + chunkSize) > file.size) {
      end = file.size;
    }
    const partial = file.slice(offset, end);
    const stat = { offset, end };
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      callback(buffer, stat, stat.end >= file.size ? null : next);
    };
    fileReader.readAsArrayBuffer(partial);
    offset = end;
  };
  next();
}

function onFileChange(event: Event) {
  const [file] = Array.from((event.currentTarget as HTMLInputElement).files ?? []);
  const sha1 = new SHA1();
  readFile(
    file,
    1 * 1024 * 1024,
    (chunk, stat, next) => {
      sha1.update(new WordArray(chunk));
      if (next) {
        next();
      } else {
        console.log(sha1.finalize().toString());
      }
    },
  );
}

async function main() {

  document.querySelector('#file-selector')?.addEventListener('change', onFileChange);

}

main().catch(err => console.error(err));
