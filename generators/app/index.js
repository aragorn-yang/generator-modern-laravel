'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');

module.exports = class extends Generator {
  /**
   * initializing - Your initialization methods (checking current project state, getting configs, etc)
   * prompting - Where you prompt users for options (where you’d call this.prompt())
   * configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
   * default - If the method name doesn’t match a priority, it will be pushed to this group.
   * writing - Where you write the generator specific files (routes, controllers, etc)
   * install - Where installations are run (npm, bower)
   * end - Called last, cleanup, say good bye, etc
   */
  prompting() {
    // have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the ${chalk.blue('modern laravel')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'appname',
        message: "What's the name of your application?",
        default: 'awesome-app',
      },
      {
        type: 'list',
        name: 'version',
        message: 'Which Laravel version?',
        choices: ['5.8.*', '5.7.*'],
        default: '5.8.*',
      },
      {
        type: 'list',
        name: 'packagist',
        message: 'Which composer repo?',
        choices: [
          '',
          'https://packagist.org',
          'https://packagist.phpcomposer.com',
          'https://packagist.laravel-china.org',
        ],
        default: '',
      },
    ];

    return this.prompt(prompts).then(props => {
      // to access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  install() {
    this.log(yosay(`Install ${chalk.blue('Laravel')}`));
    this._installLaravel();
    this.log(yosay(`Set ${chalk.blue('packagist')}`));
    this._setPackagist();
    this.log(yosay(`Install ${chalk.blue('Packages for testing')}`));
    this._installLaravelPackagesForTesting();
    this.log(yosay(`Install ${chalk.blue('ide helper')}`));
    this._installLaravelIdeHelper();
    // this._removeFiles();

    this.log(yosay(`Install ${chalk.blue('front-end dependencies')}`));
    this._installFrontEndDependencies();

    this.log(yosay(`Run ${chalk.blue('ide helper')}`));
    this._runIdeHelper();
  }

  end() {
    this.log(yosay(`Run ${chalk.blue('tests')}`));
    this._runTests();
    this.log(yosay(`Run ${chalk.blue('git')}`));
    this._gitInitAddCommit();
    this.log(
      yosay(
        `A ${chalk.blue('modern laravel')} project has been 
        ${chalk.green('successfully')} prepared!`
      )
    );
  }

  _installLaravel() {
    this.spawnCommandSync('composer', [
      'create-project',
      '--prefer-dist',
      'laravel/laravel',
      this.props.appname,
      this.props.version,
    ]);

    this.destinationRoot(this.destinationPath(this.props.appname));
    this.spawnCommandSync('php', ['artisan', 'storage:link']);
  }

  _installLaravelIdeHelper() {
    let composerDevPackages = [
      'require',
      '--dev',
      'barryvdh/laravel-ide-helper',
      'doctrine/dbal',
    ];
    this.spawnCommandSync('composer', composerDevPackages);
    this._addComposerScripts('post-update-cmd', [
      'Illuminate\\Foundation\\ComposerScripts::postUpdate',
      'php artisan ide-helper:generate',
      'php artisan ide-helper:meta',
    ]);
  }

  _installLaravelPackagesForTesting() {
    if (this.props.version === '5.7.*') {
      this.spawnCommandSync('composer', [
        'require',
        '--dev',
        'brianium/paratest:^2.0',
      ]);
    } else {
      this.spawnCommandSync('composer', ['remove', '--dev', 'phpunit/phpunit']);
      this.spawnCommandSync('composer', [
        'require',
        '--dev',
        'brianium/paratest:^3.0',
        'phpunit/phpunit:^8.0',
        'aragorn-yang/laravel-array-redis',
      ]);
    }

    this._installPhpUnitWatcher();
  }

  _installPhpUnitWatcher() {
    this.spawnCommandSync('composer', [
      'require',
      '--dev',
      'spatie/phpunit-watcher',
    ]);

    this.fs.copy(
      this.templatePath('.phpunit-wather.yml'),
      this.destinationPath('.phpunit-wather.yml')
    );
  }

  _installFrontEndDependencies() {
    // this.installDependencies({
    //   npm: true,
    //   bower: false,
    //   yarn: false,
    // });
  }

  _addComposerScripts(name, scripts) {
    let data = fs.readFileSync('composer.json', 'utf8');
    let composer = JSON.parse(data);
    composer.scripts[name] = scripts;
    // composer.scripts.analyze = ['phpmetrics --report-html=phpmetrics ./app'];

    fs.unlinkSync('composer.json');

    this.fs.write(
      this.destinationPath('composer.json'),
      JSON.stringify(composer, null, 2)
    );
  }

  _removeFiles() {
    // fs.unlinkSync("webpack.mix.js");
    // fs.unlinkSync("package.json");
    // fs.unlinkSync(".gitignore");
  }

  _runTests() {
    this.spawnCommandSync('paratest', []);
  }

  _runIdeHelper() {
    this.spawnCommandSync('php', ['artisan', 'clear-compiled']);
    this.spawnCommandSync('php', ['artisan', 'ide-helper:generate']);
    this.spawnCommandSync('php', ['artisan', 'ide-helper:meta']);
  }

  _gitInitAddCommit() {
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['add', '.']);
    this.spawnCommandSync('git', ['status']);
    this.spawnCommandSync('git', ['commit', '-m', 'Initial commit']);
  }

  _setPackagist() {
    if (this.props.packagist !== '') {
      this.spawnCommandSync('composer', [
        'config',
        'repo.packagist',
        'composer',
        this.props.packagist,
      ]);
    }
  }
};
