const {describe, it} = require('node:test')
const {deepStrictEqual} = require('assert')
const {main} = require('../src/guess-the-number.js')
describe('Testing scaffolding', function() {
    it('Should pass.', function() {
        deepStrictEqual(main(), 1);
        });

    it('Should fail.', function() {
        deepStrictEqual(main(), 0);
        });

    });
