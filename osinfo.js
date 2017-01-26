#!/usr/bin/env node
'use strict';

const commander = require('commander');
const chalk = require('chalk');
const osinf = require('./index');

commander
  .version('0.5.0')
  .option('-f, --format <format>', 'Display data format yaml, json, xml', /(y(aml)?|y(ml)?|x(ml)?|j(son)?)/i, 'yaml')
  .option('-m, --mem-metric <metric>', 'Memory metric format T, G, M, k, b', /(T|G|M|k|B)/, 'M')
  .option('-d, --disk-metric <metric>', 'Disk metric format T, G, M, k, b', /(T|G|M|k|B)/, 'G');

commander.on('--help', function(){
  console.log('Example');
  console.log('');
  console.log('osinfo -f json -m G -d T');
});

commander.parse(process.argv);

console.log(osinf(commander.format, commander));