#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
 
const spider = require('./index');
const program = require('commander');

const config = {
  isSearch: false,
  isDownload: true,
  comicName: '',
  downloadLink: ''
};

program
  .version('0.1.0')
  .option('-s, --search [comic name]', 'Search Comic', function(comicName) {
    config.isSearch = true;
    config.isDownload = false;
    config.comicName = comicName;
  })
  .parse(process.argv);

(function __main() {
  if (config.isDownload) {
    if (!config.downloadLink) {
      config.downloadLink = process.argv.pop();
    }
    spider.download(config.downloadLink);
  } else {
    spider.search(config.comicName);
  }
})();
