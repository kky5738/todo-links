const { defineConfig } = require('@vscode/test-cli');

/**
 * VS Code Extension 테스트 설정
 * @see https://code.visualstudio.com/api/working-with-extensions/testing-extension
 */
module.exports = defineConfig([
  {
    label: 'unitTests',
    files: [
      'out/test/**/todoExtractor.test.js',
      'out/test/**/todoExtractor-improved.test.js',
      'out/test/**/exporters.test.js',
      'out/test/**/notionService.test.js',
      'out/test/**/slackService.test.js',
      'out/test/**/services.test.js',
      'out/test/**/improved-example.test.js'
    ],
    version: 'stable',
    workspaceFolder: '.',
    mocha: {
      ui: 'tdd',
      timeout: 10000,
      color: true
    }
  },
  {
    label: 'integrationTests',
    files: [
      'out/test/**/integration.test.js',
      'out/test/**/extension.test.js'
    ],
    version: 'stable',
    workspaceFolder: '.',
    mocha: {
      ui: 'tdd',
      timeout: 10000,
      color: true
    }
  }
]);

