'use strict';

const Path = require('path');
const Fs = require('fs');
const Os = require('os');
const {execSync} = require('child_process');

function trim(str) {
  return (str || '').replace(/^\s*/,'').replace(/\s*$/,'');
}

function parse(output, options) {
  const {skipRows = 0, named = false} = options;
  const [header, ...rows] = output.split('\n').slice(skipRows);
  const columns = header
    .match(/(.+?\s+)/g)
    .map( column => ({
      width: column.length,
      name: trim(column)
    }));
  if (named) {
    return rows.map( row => {
      return columns.reduce( (result, {width, name}) => {
        result[name] = trim(row.slice(0, width));
        row = row.slice(width);
        return result;
      }, {});
    });
  }
  return rows.map( row => {
    return columns.reduce( (result, {width}) => {
      result.push(trim(row.slice(0, width)));
      row = row.slice(width);
      return result;
    }, []);
  });
}

function tempfile(content, callback) {
  const tmpFilename = Path.join(Os.tmpdir(), 'osinfo-' + Math.random());
  Fs.writeFileSync(tmpFilename, content);
  const result = callback(tmpFilename);
  Fs.unlinkSync(tmpFilename);
  return result;
}


function unixSize() {
  return parse(execSync('df -k',{encoding: 'utf8'}))
    .filter( ([fs]) => /^\/dev\//.test(fs))
    .map( row => {
      const [disk, blocks, used, free, capacity,,,,path] = row;
      return {
        disk,
        total: parseInt(blocks) * 1000,
        used: parseInt(used) * 1000,
        free: parseInt(free) * 1000,
        capacity,
        path
      };
    });
}

function winSize() {

  return parse(execSync('wmic diskdrive list brief /format:list',{encoding: 'utf8'}));

  //
  // return tempfile(`list disk`, filename => execSync(`diskpart /s ${filename}`,{encoding: 'utf8'}))
  //   .split('\n')
  //   .slice(2)
}

module.exports = () => {
  switch (Os.platform()) {
    case 'win32':
      return winSize();
  }
  return unixSize();
};