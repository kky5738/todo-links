import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { TodoItem, ExportOptions } from './types';

export class TodoExporter {
  /**
   * TODO 목록을 터미널에 출력합니다.
   */
  static async printToTerminal(todos: TodoItem[]): Promise<void> {
    const outputChannel = vscode.window.createOutputChannel('TODO Extractor');
    outputChannel.show();
    
    if (todos.length === 0) {
      outputChannel.appendLine('❌ TODO를 찾을 수 없습니다.');
      return;
    }

    outputChannel.appendLine('📋 발견된 TODO 목록:');
    outputChannel.appendLine('='.repeat(50));

    // 파일별로 그룹화
    const todosByFile = this.groupTodosByFile(todos);
    
    for (const [filePath, fileTodos] of todosByFile) {
      outputChannel.appendLine(`\n📁 ${filePath}`);
      outputChannel.appendLine('-'.repeat(filePath.length + 4));
      
      for (const todo of fileTodos) {
        const priority = todo.priority ? ` [${todo.priority.toUpperCase()}]` : '';
        const assignee = todo.assignee ? ` @${todo.assignee}` : '';
        const tags = todo.tags ? ` ${todo.tags.map(tag => `#${tag}`).join(' ')}` : '';
        
        outputChannel.appendLine(`  ${todo.lineNumber}: ${todo.content}${priority}${assignee}${tags}`);
      }
    }

    outputChannel.appendLine(`\n📊 총 ${todos.length}개의 TODO를 찾았습니다.`);
  }

  /**
   * TODO 목록을 TXT 파일로 내보냅니다.
   */
  static async exportToTxt(todos: TodoItem[], options: ExportOptions): Promise<void> {
    const outputPath = options.outputPath || path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, 'todos.txt');
    
    let content = `TODO 목록 - ${new Date().toLocaleString('ko-KR')}\n`;
    content += '='.repeat(50) + '\n\n';

    if (todos.length === 0) {
      content += '❌ TODO를 찾을 수 없습니다.\n';
    } else {
      const todosByFile = this.groupTodosByFile(todos);
      
      for (const [filePath, fileTodos] of todosByFile) {
        content += `📁 ${filePath}\n`;
        content += '-'.repeat(filePath.length + 4) + '\n';
        
        for (const todo of fileTodos) {
          const priority = todo.priority ? ` [${todo.priority.toUpperCase()}]` : '';
          const assignee = todo.assignee ? ` @${todo.assignee}` : '';
          const tags = todo.tags ? ` ${todo.tags.map(tag => `#${tag}`).join(' ')}` : '';
          
          content += `  ${todo.lineNumber}: ${todo.content}${priority}${assignee}${tags}\n`;
        }
        content += '\n';
      }
      
      content += `📊 총 ${todos.length}개의 TODO를 찾았습니다.\n`;
    }

    try {
      await fs.promises.writeFile(outputPath, content, 'utf-8');
      vscode.window.showInformationMessage(`TODO 목록이 저장되었습니다: ${outputPath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`파일 저장 오류: ${error}`);
    }
  }

  /**
   * TODO 목록을 JSON 파일로 내보냅니다.
   */
  static async exportToJson(todos: TodoItem[], options: ExportOptions): Promise<void> {
    const outputPath = options.outputPath || path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, 'todos.json');
    
    const data = {
      timestamp: new Date().toISOString(),
      totalCount: todos.length,
      todos: todos
    };

    try {
      await fs.promises.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
      vscode.window.showInformationMessage(`TODO 목록이 JSON으로 저장되었습니다: ${outputPath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`JSON 파일 저장 오류: ${error}`);
    }
  }

  /**
   * TODO 목록을 CSV 파일로 내보냅니다.
   */
  static async exportToCsv(todos: TodoItem[], options: ExportOptions): Promise<void> {
    const outputPath = options.outputPath || path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, 'todos.csv');
    
    let content = '파일경로,라인번호,내용,우선순위,담당자,태그\n';
    
    for (const todo of todos) {
      const priority = todo.priority || '';
      const assignee = todo.assignee || '';
      const tags = todo.tags ? todo.tags.join(';') : '';
      
      content += `"${todo.filePath}",${todo.lineNumber},"${todo.content}","${priority}","${assignee}","${tags}"\n`;
    }

    try {
      await fs.promises.writeFile(outputPath, content, 'utf-8');
      vscode.window.showInformationMessage(`TODO 목록이 CSV로 저장되었습니다: ${outputPath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`CSV 파일 저장 오류: ${error}`);
    }
  }

  /**
   * TODO 목록을 파일별로 그룹화합니다.
   */
  private static groupTodosByFile(todos: TodoItem[]): Map<string, TodoItem[]> {
    const grouped = new Map<string, TodoItem[]>();
    
    for (const todo of todos) {
      if (!grouped.has(todo.filePath)) {
        grouped.set(todo.filePath, []);
      }
      grouped.get(todo.filePath)!.push(todo);
    }
    
    return grouped;
  }
}
