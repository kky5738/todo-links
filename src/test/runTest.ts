import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    // Extension 파일이 있는 폴더
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // 테스트 실행 스크립트
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // VS Code를 다운로드하고 테스트 실행
    await runTests({ 
      extensionDevelopmentPath, 
      extensionTestsPath,
      launchArgs: ['--disable-extensions']
    });
  } catch (err) {
    console.error('Failed to run tests');
    console.error(err);
    process.exit(1);
  }
}

main();

