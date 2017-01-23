'use strict';

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

function winSize() {
  return execSync('diskpart -c list disk',{encoding: 'utf8'});
}

module.exports = () => {
  switch (Os.platform()) {
    case 'win32':
      return winSize();
  }
  return unixSize();
};