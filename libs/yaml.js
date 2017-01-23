'use strict';

const Yaml = require('js-yaml');

module.exports = data => Yaml.safeDump(data);