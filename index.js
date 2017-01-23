'use strict';

const Os = require('os');
const diskSize = require('./libs/disk-size');
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

const metrics = {
  T: Math.pow(1000, 4),
  G: Math.pow(1000, 3),
  M: Math.pow(1000, 2),
  k: 1000,
  b: 1,
};

function toMetric(value, metric) {
  return `${Math.round(value / metrics[metric])}${metric}`;
}

module.exports = function (format, {memMetric, diskMetric}) {

  const name = Os.type();
  const disks = diskSize().map( ({disk, total, used, free}) => ({
    disk,
    total: toMetric(total, diskMetric),
    used: toMetric(used, diskMetric),
    free: toMetric(free, diskMetric)
  }));

  const data = {
    platform: {
      arch: Os.arch(),
      type: Os.platform(),
      release: Os.release(),
      name
    },
    disks,
    cpus: {
      list: Os.cpus(),
      loadavg: Os.loadavg(),
    },
    mem: {
      freemem: toMetric(Os.freemem(), memMetric),
      totalmem: toMetric(Os.totalmem(), memMetric)
    },
    env: {
      endianness: Os.endianness(),
      vars: process.env,
      homedir: Os.homedir(),
      hostname: Os.hostname(),
    },
    networks: Os.networkInterfaces()
  };

  return formats[format](data);
};