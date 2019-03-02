/* eslint-env jest */
'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-modern-laravel:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ appname: 'test-app', version: '5.8.*' });
  }, 1200000);

  it('creates files', () => {
    assert.file([
      'app/User.php',
      '.env',
      '.gitignore',
      '.git/config',
      '.phpstorm.meta.php',
      '_ide_helper.php',
      '.phpunit-wather.yml',
      'composer.json',
      'composer.lock',
      'package.json',
      'phpunit.xml',
    ]);
  });

  it('composer.json contains laravel packages and script', () => {
    assert.fileContent('composer.json', 'doctrine/dbal');
    assert.fileContent('composer.json', 'barryvdh/laravel-ide-helper');
    assert.fileContent('composer.json', 'spatie/phpunit-watcher');
    assert.fileContent('composer.json', 'brianium/paratest');
    assert.fileContent('composer.json', 'phpunit/phpunit');
    assert.fileContent('composer.json', 'aragorn-yang/laravel-array-redis');
  });
});
