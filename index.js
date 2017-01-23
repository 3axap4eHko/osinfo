'use strict';

const Os = require('os');
const Xml = require('./libs/xml');
const Yaml = require('./libs/yaml');
const Json = require('./libs/json');

const formats = {
  'yml': Yaml,
  'yaml': Yaml,
  'y': Yaml,
  'xml': Xml,
  'x': Xml,
  'json': Json,
  'j': Json
};

const data = {
  platform: {
    arch: Os.arch(),
    type: Os.platform(),
    release: Os.release(),
    name: Os.type(),
  },
  cpu: {
    list: Os.cpus(),
    loadavg: Os.loadavg(),
  },
  mem: {
    freemem: Os.freemem(),
    totalmem: Os.totalmem(),
  },
  env: {
    endianness: Os.endianness(),
    vars: process.env,
    homedir: Os.homedir(),
    hostname: Os.hostname(),
  },
  networks: Os.networkInterfaces()
};

module.exports = function (format) {
  return formats[format](data);
};