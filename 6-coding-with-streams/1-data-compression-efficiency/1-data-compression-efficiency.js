/* 
  6.1 Data compression efficiency: Write a command-line script that takes a file as input and
  compresses it using the different algorithms available in the zlib module (Brotli, Deflate, Gzip).
  You want to produce a summary table that compares the algorithm's compression time and compression efficiency on the given file.
  Hint: This could be a good use case for the fork pattern, but remember that we made some
  important performance considerations when we discussed it earlier in this chapter.
*/

import { createReadStream, createWriteStream } from 'node:fs';
import { PassThrough, pipeline } from 'node:stream';
import { createGzip, createDeflate, createBrotliCompress } from 'node:zlib';

const src = createReadStream(process.argv[2]) // filename
const gzip = createGzip()
const deflate = createDeflate()
const brotli = createBrotliCompress()

const algorithms = {
  deflate: {
    stream: deflate,
    time: 0,
    original: 0,
    compressed: 0
  },
  brotli: {
    stream: brotli,
    time: 0,
    original: 0,
    compressed: 0
  },
  gzip: {
    stream: gzip,
    time: 0,
    original: 0,
    compressed: 0
  }
}

const setStartTime = (algorithm) => new PassThrough().once('data', () => algorithms[algorithm].time = Date.now())
const setDuration = (algorithm) => new PassThrough().on('finish', () => algorithms[algorithm].time = Date.now() - algorithms[algorithm].time + ' ms')

const getOriginalSize = (algorithm) => new PassThrough().on('data', (chunk) => algorithms[algorithm].original += chunk.length)
const getCompressedSize = (algorithm) => new PassThrough().on('data', (chunk) => algorithms[algorithm].compressed += chunk.length)

function compress() {
  let inProgress = 0;
  for (const algorithm of Object.keys(algorithms)) {
    inProgress++
    pipeline(
      createReadStream(process.argv[2]),
      getOriginalSize(algorithm),
      setStartTime(algorithm),
      algorithms[algorithm].stream,
      setDuration(algorithm),
      getCompressedSize(algorithm),
      createWriteStream(process.argv[2] + '.' + algorithm),
      (err) => {
        if (err) {
          console.error('An error occurred:', err);
          process.exitCode = 1;
        }
    }).on('finish', () => {
      if (--inProgress === 0) {
        console.table(algorithms, ['time', 'original', 'compressed'])
      }
    })
  }
}

compress()
