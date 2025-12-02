import axios from 'axios';
import * as vscode from 'vscode';
import { TodoItem } from './types';

export class SlackService {
  private webhookUrl: string | null = null;

  constructor(webhookUrl?: string) {
    if (webhookUrl) {
      this.webhookUrl = webhookUrl;
    }
  }

  /**
   * Slack 설정을 업데이트합니다.
   */
  updateConfig(webhookUrl: string): void {
    this.webhookUrl = webhookUrl;
  }

  /**
   * TODO 목록을 Slack으로 전송합니다.
   */
  async sendTodosToSlack(todos: TodoItem[]): Promise<void> {
    if (!this.webhookUrl) {
      vscode.window.showErrorMessage('Slack 웹훅 URL을 설정해주세요.');
      return;
    }

    if (todos.length === 0) {
      vscode.window.showInformationMessage('전송할 TODO가 없습니다.');
      return;
    }

    try {
      const messageChunks = this.formatSlackMessage(todos);
      
      for (const chunk of messageChunks) {
        const response = await axios.post(this.webhookUrl, {
          text: '📋 TODO 목록',
          blocks: chunk
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status !== 200) {
          vscode.window.showErrorMessage('Slack 전송에 실패했습니다.');
          return;
        }
      }

      vscode.window.showInformationMessage(`${todos.length}개의 TODO가 Slack에 전송되었습니다.`);
    } catch (error) {
      vscode.window.showErrorMessage(`Slack 전송 오류: ${error}`);
    }
  }

  /**
   * TODO 목록을 Slack 메시지 형식으로 포맷합니다.
   */
  private formatSlackMessage(todos: TodoItem[]): any[][] {
    const chunks: any[][] = [];
    let currentBlocks: any[] = [];
    
    const addBlock = (block: any) => {
      if (currentBlocks.length >= 45) { // Slack block limit is 50, keeping safety margin
        chunks.push(currentBlocks);
        currentBlocks = [];
      }
      currentBlocks.push(block);
    };

    addBlock({
      type: 'header',
      text: {
        type: 'plain_text',
        text: `📋 TODO 목록 (${todos.length}개)`
      }
    });
    
    addBlock({
      type: 'divider'
    });

    // 파일별로 그룹화
    const todosByFile = this.groupTodosByFile(todos);
    
    for (const [filePath, fileTodos] of todosByFile) {
      // 파일 헤더
      addBlock({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📁 ${filePath}*`
        }
      });

      // TODO 항목들
      for (const todo of fileTodos) {
        const priority = todo.priority ? ` *[${todo.priority.toUpperCase()}]*` : '';
        const assignee = todo.assignee ? ` @${todo.assignee}` : '';
        const tags = todo.tags ? ` ${todo.tags.map(tag => `#${tag}`).join(' ')}` : '';
        
        addBlock({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `• *라인 ${todo.lineNumber}:* ${todo.content}${priority}${assignee}${tags}`
          }
        });
      }

      // 파일 구분선
      if (todosByFile.size > 1) {
        addBlock({
          type: 'divider'
        });
      }
    }

    // 요약 정보
    addBlock({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `📊 총 ${todos.length}개의 TODO | 생성일: ${new Date().toLocaleString('ko-KR')}`
        }
      ]
    });

    if (currentBlocks.length > 0) {
      chunks.push(currentBlocks);
    }

    return chunks;
  }

  /**
   * TODO 목록을 파일별로 그룹화합니다.
   */
  private groupTodosByFile(todos: TodoItem[]): Map<string, TodoItem[]> {
    const grouped = new Map<string, TodoItem[]>();
    
    for (const todo of todos) {
      if (!grouped.has(todo.filePath)) {
        grouped.set(todo.filePath, []);
      }
      grouped.get(todo.filePath)!.push(todo);
    }
    
    return grouped;
  }

  /**
   * Slack 연결을 테스트합니다.
   */
  async testConnection(): Promise<boolean> {
    if (!this.webhookUrl) {
      return false;
    }

    try {
      const response = await axios.post(this.webhookUrl, {
        text: '🔗 TODO Extractor 연결 테스트'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Slack 연결 테스트 실패:', error);
      return false;
    }
  }
}
