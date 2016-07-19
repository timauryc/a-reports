'use strict';

var nconf = require('nconf');

nconf.argv()
  .env()
  .file(process.cwd() + '/conf/axpo-reports.json');

module.exports = nconf;