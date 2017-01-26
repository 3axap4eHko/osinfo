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
    K: 1000,
    B: 1,
};

function toMetric(value, metric) {
    const metricValue = Math.round(value / metrics[metric]);
    if (metricValue) {
        return `${metricValue}${metric}`;
    }
    return metricValue;
}

module.exports = function (format, {memMetric, diskMetric}) {

    const name = Os.type();
    const disks = diskSize().map(({disk, total, free, path}) => ({
        disk,
        total: toMetric(total, diskMetric),
        free: toMetric(free, diskMetric),
        path
    }));

    const data = {
        platform: {
            arch: Os.arch(),
            type: Os.platform(),
            release: Os.release(),
            name,
            endianness: Os.endianness(),
        },
        disks,
        cpus: {
            list: Os.cpus(),
            loadavg: Os.loadavg(),
        },
        memory: {
            free: toMetric(Os.freemem(), memMetric),
            total: toMetric(Os.totalmem(), memMetric)
        },
        environment: {
            vars: process.env,
            homedir: Os.homedir(),
            hostname: Os.hostname(),
        },
        networks: Os.networkInterfaces()
    };

    return formats[format](data);
};