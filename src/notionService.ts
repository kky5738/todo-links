import { Client } from '@notionhq/client';
import * as vscode from 'vscode';
import pLimit from 'p-limit';
import { TodoItem } from './types';

export class NotionService {
  private client: Client | null = null;
  private databaseId: string | null = null;
  private databasePropsCache: Record<string, any> | null = null;

  constructor(apiKey?: string, databaseId?: string) {
    if (apiKey && databaseId) {
      this.client = new Client({ auth: apiKey });
      this.databaseId = databaseId;
    }
  }

  /**
   * Notion 설정을 업데이트합니다.
   */
  updateConfig(apiKey: string, databaseId: string): void {
    this.client = new Client({ auth: apiKey });
    this.databaseId = databaseId;
    this.databasePropsCache = null;
  }

  /**
   * TODO 목록을 Notion 데이터베이스에 전송합니다.
   */
  async sendTodosToNotion(todos: TodoItem[]): Promise<void> {
    if (!this.client || !this.databaseId) {
      vscode.window.showErrorMessage('Notion API 키와 데이터베이스 ID를 설정해주세요.');
      return;
    }

    if (todos.length === 0) {
      vscode.window.showInformationMessage('전송할 TODO가 없습니다.');
      return;
    }

    try {
      const progress = vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Notion에 TODO 전송 중...',
        cancellable: false
      }, async (progress) => {
        let completed = 0;
        const total = todos.length;

        const limit = pLimit(3); // Concurrency limit
        const promises = todos.map(todo => limit(async () => {
          try {
            await this.createNotionPage(todo);
            completed++;
            progress.report({ increment: (1 / total) * 100, message: `${completed}/${total} 완료` });
          } catch (error) {
            console.error(`Notion 페이지 생성 오류 (${todo.filePath}:${todo.lineNumber}):`, error);
          }
        }));

        await Promise.all(promises);
      });

      await progress;
      vscode.window.showInformationMessage(`${todos.length}개의 TODO가 Notion에 전송되었습니다.`);
    } catch (error) {
      vscode.window.showErrorMessage(`Notion 전송 오류: ${error}`);
    }
  }

  /**
   * 단일 TODO를 Notion 페이지로 생성합니다.
   */
  private async createNotionPage(todo: TodoItem): Promise<void> {
    if (!this.client || !this.databaseId) {
      throw new Error('Notion 클라이언트가 초기화되지 않았습니다.');
    }

    // 데이터베이스 스키마를 조회하여 실제 속성명과 타입을 동적으로 결정
    const props = await this.getDatabaseProperties();

    const titleName = this.findPropertyNameByType(props, 'title');
    if (!titleName) {
      throw new Error('Notion 데이터베이스에 title 속성이 없습니다.');
    }

    // 상태 속성 우선순위: status 타입 > 이름에 상태/Status가 포함된 select 타입 > 첫 select 타입
    const statusPropName = this.findPropertyNameByType(props, 'status');
    const selectStatusPropName = statusPropName
      ? null
      : this.findSelectStatusLikePropertyName(props);

    // 기타 속성들은 존재할 때만 설정 (없으면 건너뜀)
    const filePathPropName = this.findPropertyNameByTypeWithNames(props, 'rich_text', ['파일 경로', 'File', 'Path', 'File Path']);
    const lineNumberPropName = this.findPropertyNameByTypeWithNames(props, 'number', ['라인 번호', 'Line', 'Line Number']);
    const priorityPropName = this.findPropertyNameByTypeWithNames(props, 'select', ['우선순위', 'Priority']);
    const assigneePropName = this.findPropertyNameByTypeWithNames(props, 'rich_text', ['담당자', 'Assignee', 'Owner']);
    const tagsPropName = this.findPropertyNameByTypeWithNames(props, 'multi_select', ['태그', 'Tags', 'labels']);

    const properties: any = {};
    properties[titleName] = {
      title: [
        {
          text: { content: todo.content }
        }
      ]
    };

    if (filePathPropName) {
      properties[filePathPropName] = {
        rich_text: [ { text: { content: todo.filePath } } ]
      };
    }
    if (lineNumberPropName) {
      properties[lineNumberPropName] = { number: todo.lineNumber };
    }

    if (statusPropName) {
      const optionName = this.pickBestOptionName(props[statusPropName]);
      if (optionName) {
        properties[statusPropName] = { status: { name: optionName } };
      }
    } else if (selectStatusPropName) {
      const optionName = this.pickBestOptionName(props[selectStatusPropName]);
      if (optionName) {
        properties[selectStatusPropName] = { select: { name: optionName } };
      }
    }

    if (priorityPropName && todo.priority) {
      properties[priorityPropName] = { select: { name: this.mapPriorityToNotion(todo.priority) } };
    }
    if (assigneePropName && todo.assignee) {
      properties[assigneePropName] = {
        rich_text: [ { text: { content: todo.assignee } } ]
      };
    }
    if (tagsPropName && todo.tags && todo.tags.length > 0) {
      properties[tagsPropName] = { multi_select: todo.tags.map(tag => ({ name: tag })) };
    }

    await this.performWithRetry(async () => {
      await this.client!.pages.create({
        parent: { database_id: this.databaseId! },
        properties
      });
    });
  }

  /**
   * 우선순위를 Notion 형식으로 매핑합니다.
   */
  private mapPriorityToNotion(priority: string): string {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '보통';
    }
  }

  /**
   * DB 스키마 캐시를 보장합니다.
   */
  private async getDatabaseProperties(): Promise<Record<string, any>> {
    if (!this.client || !this.databaseId) {
      throw new Error('Notion 클라이언트가 초기화되지 않았습니다.');
    }
    if (this.databasePropsCache) {
      return this.databasePropsCache;
    }
    const db = await this.client.databases.retrieve({ database_id: this.databaseId });
    // @ts-ignore - notion sdk typings are broad
    const props: Record<string, any> = (db as any).properties || {};
    this.databasePropsCache = props;
    return props;
  }

  /**
   * 타입으로 속성명을 찾습니다.
   */
  private findPropertyNameByType(props: Record<string, any>, type: string): string | null {
    for (const [name, def] of Object.entries(props)) {
      if ((def as any).type === type) {
        return name;
      }
    }
    return null;
  }

  /**
   * 타입과 후보 이름들 중 하나가 일치하는 속성명을 찾습니다.
   */
  private findPropertyNameByTypeWithNames(props: Record<string, any>, type: string, names: string[]): string | null {
    const lowerNames = names.map(n => n.toLowerCase());
    for (const [name, def] of Object.entries(props)) {
      if ((def as any).type === type && lowerNames.includes(name.toLowerCase())) {
        return name;
      }
    }
    return null;
  }

  /**
   * 상태로 사용할 만한 select 속성의 이름을 찾습니다.
   */
  private findSelectStatusLikePropertyName(props: Record<string, any>): string | null {
    // 이름에 status/상태가 포함된 select 우선
    const candidates: string[] = [];
    for (const [name, def] of Object.entries(props)) {
      if ((def as any).type === 'select') {
        candidates.push(name);
      }
    }
    const byName = candidates.find(n => /status|상태/i.test(n));
    if (byName) return byName;
    // 아니면 첫 번째 select 반환
    return candidates[0] || null;
  }

  /**
   * 상태/셀렉트 속성에서 사용할 유효한 옵션명을 고릅니다.
   * 우선 순위: TODO/To Do/Not started/할 일 등 공통 명칭 -> 첫 번째 옵션
   */
  private pickBestOptionName(propDef: any): string | null {
    const type = propDef?.type;
    const options = type === 'status' ? propDef.status?.options : type === 'select' ? propDef.select?.options : null;
    if (!Array.isArray(options) || options.length === 0) return null;
    const preferred = [
      'To Do', 'TODO', 'Not started', 'Not Started', '할 일', '대기',
      'Todo', 'Backlog', 'Open'
    ];
    const byPreferred = options.find((o: any) => preferred.some(p => o?.name?.toLowerCase() === p.toLowerCase()));
    return byPreferred?.name || options[0].name;
  }

  /**
   * 간단한 재시도 유틸 (네트워크 일시 오류 대응)
   */
  private async performWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let attempt = 0;
    let lastErr: any;
    while (attempt < maxRetries) {
      try {
        return await fn();
      } catch (err: any) {
        lastErr = err;
        const code = err?.code || err?.errno;
        if (code === 'ECONNRESET' || code === 'ENOTFOUND' || code === 'ETIMEDOUT') {
          const delay = 300 * Math.pow(2, attempt);
          await new Promise(res => setTimeout(res, delay));
          attempt++;
          continue;
        }
        throw err;
      }
    }
    throw lastErr;
  }

  /**
   * Notion 연결을 테스트합니다.
   */
  async testConnection(): Promise<boolean> {
    if (!this.client || !this.databaseId) {
      return false;
    }

    try {
      await this.client.databases.retrieve({ database_id: this.databaseId });
      return true;
    } catch (error) {
      console.error('Notion 연결 테스트 실패:', error);
      return false;
    }
  }
}
