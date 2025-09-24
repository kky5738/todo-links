import * as vscode from 'vscode';
import { TodoExtractor } from './todoExtractor';
import { TodoExporter } from './exporters';
import { NotionService } from './notionService';
import { SlackService } from './slackService';
import { TodoExtractorConfig } from './types';

export function activate(context: vscode.ExtensionContext) {
  console.log('TODO Extractor 확장이 활성화되었습니다.');

  // 설정 가져오기
  const config = vscode.workspace.getConfiguration('todoLinks');
  const extractorConfig: TodoExtractorConfig = {
    includeFileTypes: config.get('includeFileTypes', ['*.js', '*.ts', '*.jsx', '*.tsx', '*.py', '*.java', '*.cpp', '*.c', '*.cs', '*.php', '*.rb', '*.go', '*.rs', '*.swift', '*.kt', '*.scala', '*.vue', '*.svelte']),
    excludeFolders: config.get('excludeFolders', ['node_modules', '.git', 'dist', 'build', 'out', '.vscode', 'coverage', '.nyc_output', 'logs', 'tmp', 'temp', 'todotest']),
    excludePatterns: config.get('excludePatterns', ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/out/**', '**/.vscode/**', '**/coverage/**', '**/.nyc_output/**', '**/logs/**', '**/tmp/**', '**/temp/**', '**/todotest/**']),
    notionApiKey: config.get('notionApiKey'),
    notionDatabaseId: config.get('notionDatabaseId'),
    slackWebhookUrl: config.get('slackWebhookUrl')
  };

  const todoExtractor = new TodoExtractor(extractorConfig);
  const notionService = new NotionService(extractorConfig.notionApiKey, extractorConfig.notionDatabaseId);
  const slackService = new SlackService(extractorConfig.slackWebhookUrl);

  // TODO 추출 명령어
  const extractCommand = vscode.commands.registerCommand('todo-links.extractTodos', async () => {
    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'TODO 추출 중...',
        cancellable: false
      }, async (progress) => {
        const todos = await todoExtractor.extractTodos();
        await TodoExporter.printToTerminal(todos);
      });
    } catch (error) {
      vscode.window.showErrorMessage(`TODO 추출 오류: ${error}`);
    }
  });

  // TXT 파일로 내보내기 명령어
  const exportTxtCommand = vscode.commands.registerCommand('todo-links.exportToTxt', async () => {
    try {
      const todos = await todoExtractor.extractTodos();
      
      if (todos.length === 0) {
        vscode.window.showInformationMessage('내보낼 TODO가 없습니다.');
        return;
      }

      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file('todos.txt'),
        filters: {
          'Text files': ['txt'],
          'All files': ['*']
        }
      });

      if (uri) {
        await TodoExporter.exportToTxt(todos, { 
          outputPath: uri.fsPath, 
          format: 'txt' 
        });
      }
    } catch (error) {
      vscode.window.showErrorMessage(`TXT 내보내기 오류: ${error}`);
    }
  });

  // JSON 파일로 내보내기 명령어
  const exportJsonCommand = vscode.commands.registerCommand('todo-links.exportToJson', async () => {
    try {
      const todos = await todoExtractor.extractTodos();
      
      if (todos.length === 0) {
        vscode.window.showInformationMessage('내보낼 TODO가 없습니다.');
        return;
      }

      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file('todos.json'),
        filters: {
          'JSON files': ['json'],
          'All files': ['*']
        }
      });

      if (uri) {
        await TodoExporter.exportToJson(todos, { 
          outputPath: uri.fsPath, 
          format: 'json' 
        });
      }
    } catch (error) {
      vscode.window.showErrorMessage(`JSON 내보내기 오류: ${error}`);
    }
  });

  // CSV 파일로 내보내기 명령어
  const exportCsvCommand = vscode.commands.registerCommand('todo-links.exportToCsv', async () => {
    try {
      const todos = await todoExtractor.extractTodos();
      
      if (todos.length === 0) {
        vscode.window.showInformationMessage('내보낼 TODO가 없습니다.');
        return;
      }

      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file('todos.csv'),
        filters: {
          'CSV files': ['csv'],
          'All files': ['*']
        }
      });

      if (uri) {
        await TodoExporter.exportToCsv(todos, { 
          outputPath: uri.fsPath, 
          format: 'csv' 
        });
      }
    } catch (error) {
      vscode.window.showErrorMessage(`CSV 내보내기 오류: ${error}`);
    }
  });

  // Notion으로 전송 명령어
  const sendToNotionCommand = vscode.commands.registerCommand('todo-links.sendToNotion', async () => {
    try {
      // 설정 확인
      const config = vscode.workspace.getConfiguration('todoLinks');
      const notionApiKey = config.get('notionApiKey');
      const notionDatabaseId = config.get('notionDatabaseId');

      if (!notionApiKey || !notionDatabaseId) {
        const action = await vscode.window.showWarningMessage(
          'Notion API 키와 데이터베이스 ID를 설정해주세요.',
          '설정 열기'
        );
        
        if (action === '설정 열기') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'todoLinks');
        }
        return;
      }

      // 설정 업데이트
      notionService.updateConfig(notionApiKey as string, notionDatabaseId as string);

      // 연결 테스트
      const isConnected = await notionService.testConnection();
      if (!isConnected) {
        vscode.window.showErrorMessage('Notion 연결에 실패했습니다. API 키와 데이터베이스 ID를 확인해주세요.');
        return;
      }

      const todos = await todoExtractor.extractTodos();
      await notionService.sendTodosToNotion(todos);
    } catch (error) {
      vscode.window.showErrorMessage(`Notion 전송 오류: ${error}`);
    }
  });

  // Slack으로 전송 명령어
  const sendToSlackCommand = vscode.commands.registerCommand('todo-links.sendToSlack', async () => {
    try {
      // 설정 확인
      const config = vscode.workspace.getConfiguration('todoLinks');
      const slackWebhookUrl = config.get('slackWebhookUrl');

      if (!slackWebhookUrl) {
        const action = await vscode.window.showWarningMessage(
          'Slack 웹훅 URL을 설정해주세요.',
          '설정 열기'
        );
        
        if (action === '설정 열기') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'todoLinks');
        }
        return;
      }

      // 설정 업데이트
      slackService.updateConfig(slackWebhookUrl as string);

      // 연결 테스트
      const isConnected = await slackService.testConnection();
      if (!isConnected) {
        vscode.window.showErrorMessage('Slack 연결에 실패했습니다. 웹훅 URL을 확인해주세요.');
        return;
      }

      const todos = await todoExtractor.extractTodos();
      await slackService.sendTodosToSlack(todos);
    } catch (error) {
      vscode.window.showErrorMessage(`Slack 전송 오류: ${error}`);
    }
  });

  // 설정 변경 감지
  const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('todoLinks')) {
      const config = vscode.workspace.getConfiguration('todoLinks');
      const newConfig: TodoExtractorConfig = {
        includeFileTypes: config.get('includeFileTypes', ['*.js', '*.ts', '*.jsx', '*.tsx', '*.py', '*.java', '*.cpp', '*.c', '*.cs', '*.php', '*.rb', '*.go', '*.rs', '*.swift', '*.kt', '*.scala', '*.vue', '*.svelte']),
        excludeFolders: config.get('excludeFolders', ['node_modules', '.git', 'dist', 'build', 'out', '.vscode', 'coverage', '.nyc_output', 'logs', 'tmp', 'temp', 'todotest']),
        excludePatterns: config.get('excludePatterns', ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/out/**', '**/.vscode/**', '**/coverage/**', '**/.nyc_output/**', '**/logs/**', '**/tmp/**', '**/temp/**', '**/todotest/**']),
        notionApiKey: config.get('notionApiKey'),
        notionDatabaseId: config.get('notionDatabaseId'),
        slackWebhookUrl: config.get('slackWebhookUrl')
      };
      
      // 새로운 설정으로 업데이트
      Object.assign(extractorConfig, newConfig);
      notionService.updateConfig(newConfig.notionApiKey || '', newConfig.notionDatabaseId || '');
      slackService.updateConfig(newConfig.slackWebhookUrl || '');
    }
  });

  // 명령어 등록
  context.subscriptions.push(
    extractCommand,
    exportTxtCommand,
    exportJsonCommand,
    exportCsvCommand,
    sendToNotionCommand,
    sendToSlackCommand,
    configChangeListener
  );
}

export function deactivate() {
  console.log('TODO Extractor 확장이 비활성화되었습니다.');
}
