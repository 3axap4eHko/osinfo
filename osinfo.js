#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const chalk = require('chalk');
const osinf = require('./index');
const {version} = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));

if (!~process.argv.indexOf('--no-banner') || process.argv.length === 2) {
    console.log(chalk.green(`
 ██████╗ ███████╗    ██╗███╗   ██╗███████╗ ██████╗ 
██╔═══██╗██╔════╝    ██║████╗  ██║██╔════╝██╔═══██╗
██║   ██║███████╗    ██║██╔██╗ ██║█████╗  ██║   ██║
██║   ██║╚════██║    ██║██║╚██╗██║██╔══╝  ██║   ██║
╚██████╔╝███████║    ██║██║ ╚████║██║     ╚██████╔╝
 ╚═════╝ ╚══════╝    ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝
`));
}

commander
    .version(version)
    .option('-f, --format <format>', 'Display data format yaml, json or xml (required)', /(y(aml)?|y(ml)?|x(ml)?|j(son)?)/i)
    .option('-m, --mem-metric <metric>', 'Memory metric format T, G, M, K, B', /(T|G|M|K|B)/, 'M')
    .option('-d, --disk-metric <metric>', 'Disk metric format T, G, M, K, B', /(T|G|M|K|B)/, 'G');

commander.on('--help', function () {
    console.log('Example');
    console.log('');
    console.log('\tDisplay info in json format where disk size in TB and memory size in GB');
    console.log('\t$ osinfo -f json -m G -d T');
});

commander.parse(process.argv);

if (!commander.format) {
    console.log(chalk.red(`Error: <format> is required`));
    commander.outputHelp();
    // Check if it does not forget to close fds from RPC
    process.exit(1);
} else {
    console.log(osinf(commander.format, commander));
}
