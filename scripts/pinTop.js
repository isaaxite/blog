'use strict';

const util = require('util');

const generator = require('hexo-generator-index-pin-top/lib/generator');

hexo.extend.generator.register('pin-top', function(locals) {
  return generator.call(this, locals);
});