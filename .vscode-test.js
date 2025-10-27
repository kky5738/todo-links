const { defineConfig } = require('@vscode/test-cli');

/**
 * VS Code Extension 테스트 설정
 * @see https://code.visualstudio.com/api/working-with-extensions/testing-extension
 */
module.exports = defineConfig({
  files: 'out/test/**/*.test.js',
  version: 'stable',
  workspaceFolder: '.',
  mocha: {
    ui: 'tdd',
    timeout: 10000,
    color: true
  }
});

