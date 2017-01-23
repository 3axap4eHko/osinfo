#!/usr/bin/env node
'use strict';

const commander = require('commander');
const chalk = require('chalk');
const osinf = require('./index');

commander
  .version('0.1.0')
  .option('-f, --format <format>', 'Display data format yaml, json, xml', /(y(aml)?|y(ml)?|x(ml)?|j(son)?)/i, 'yaml');

commander.on('--help', function(){
  console.log('');
});

commander.parse(process.argv);

console.log(osinf(commander.format));