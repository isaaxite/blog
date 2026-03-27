const { createHint } = require('../src/hint');

const hint = createHint();

hint.warn('warn text');
hint.error('error text');

hint.warnList(['warn text-1', 'warn text-2'])
