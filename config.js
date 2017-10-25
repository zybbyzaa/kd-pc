'use strict';

const path = require('path');
const pkg = require('./package.json');

let config = {
  name: pkg.cnname,
  port: 9080,
  building: {
    name: pkg.cnname,
    productName: pkg.cnname,
    arch: 'x64',
    asar: false,
    dir: path.join(__dirname, 'app'),
    icon: path.join(__dirname, 'app/icons/icon'),
    ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))|\.gitkeep/,
    out: path.join(__dirname, 'builds'),
    overwrite: true,
    platform: process.env.PLATFORM_TARGET || 'all'
  }
};

config.building.name = config.name;

module.exports = config;
