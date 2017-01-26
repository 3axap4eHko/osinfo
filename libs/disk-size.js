'use strict';

const Os = require('os');
const {execSync} = require('child_process');

function trim(str) {
    return (str || '').replace(/^\s*/, '').replace(/\s*$/, '');
}

function parse(output, options = {}) {
    const {skipRows = 0, named = false} = options;
    const [header, ...rows] = output.split('\n').slice(skipRows).filter(row => trim(row).length);
    const columns = header
        .match(/(.+?\s+)/g)
        .map(column => ({
            width: column.length,
            name: trim(column)
        }));
    if (named) {
        return rows.map(row => {
            return columns.reduce((result, {width, name}) => {
                result[name] = trim(row.slice(0, width));
                row = row.slice(width);
                return result;
            }, {});
        });
    }
    return rows.map(row => {
        return columns.reduce((result, {width}) => {
            result.push(trim(row.slice(0, width)));
            row = row.slice(width);
            return result;
        }, []);
    });
}

function linuxSize() {
    return parse(execSync('df -b', {encoding: 'utf8'}))
        .filter(([fs]) => /^\/dev\//.test(fs))
        .map(row => {
            const [disk, blocks, free, , , , , path] = row;
            return {
                disk,
                total: parseInt(blocks),
                free: parseInt(free),
                path
            };
        });
}

function darwinSize() {
    return parse(execSync('df -k', {encoding: 'utf8'}))
        .filter(([fs]) => /^\/dev\//.test(fs))
        .map(row => {
            const [disk, blocks, free, , , , , path] = row;
            return {
                disk,
                total: parseInt(blocks) * 1000,
                free: parseInt(free) * 1000,
                path
            };
        });
}

function winSize() {

    return parse(execSync('wmic logicaldisk list brief', {encoding: 'utf8'}))
        .filter(([, type]) => /(3)/.test(type))
        .map(row => {
            const [path, , free, , total, disk] = row;
            return {
                disk: disk || '(no label)',
                total: parseInt(total),
                free: parseInt(free),
                path: `${path}\\`
            };
        });
}

module.exports = () => {
    switch (Os.type()) {
        case 'Darwin':
            return darwinSize();
        case 'Windows_NT':
            return winSize();
    }
    return linuxSize();
};