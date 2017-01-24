'use strict';

const Path = require('path');
const Fs = require('fs');
const Os = require('os');
const {execSync} = require('child_process');

function unixSize() {
  return execSync('df -k',{encoding: 'utf8'})
    .split('\n')
    .filter( data => /^\/dev\//.test(data))
    .map( data => {
      const [disk, blocks, used, free, capacity] = data.split(/ +/);
      return {
        disk,
        total: parseInt(blocks) * 1000,
        used: parseInt(used) * 1000,
        free: parseInt(free) * 1000,
        capacity
      };
    });
}

function tempfile(content, callback) {
  const tmpFilename = Path.join(Os.tmpdir(), 'osinfo-' + Math.random());
  Fs.writeFileSync(tmpFilename, content);
  const result = callback(tmpFilename);
  Fs.unlinkSync(tmpFilename);
  return result;
}

function winSize() {
  const drives = execSync('fsutil fsinfo drives')
    .match(/\w+:\\/g)
    .map(drive => {
      return execSync('fsutil fsinfo drives');
    });

  return tempfile(`list disk`, filename => execSync(`diskpart /s ${filename}`,{encoding: 'utf8'}))
    .split('\n')
    .slice(2)
}

module.exports = () => {
  switch (Os.platform()) {
    case 'win32':
      return winSize();
  }
  return unixSize();
};