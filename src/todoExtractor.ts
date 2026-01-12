import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import pLimit from 'p-limit';
import { TodoItem, TodoExtractorConfig } from './types';

export class TodoExtractor {
  private config: TodoExtractorConfig;
  private assigneePatterns: string;
  private tagPatterns: string;
  private excludeRegexes: RegExp[] = [];
  private commentPatterns: RegExp[] = [];

  constructor(config: TodoExtractorConfig) {
    this.config = config;
    this.assigneePatterns = config.assigneePatterns;
    this.tagPatterns = config.tagPatterns;
    this.initializeRegexes();
  }

  private initializeRegexes() {
    // Exclude patterns
    this.excludeRegexes = this.config.excludePatterns.map(pattern => {
      const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '[^/]');
      return new RegExp(`^${regexPattern}$`);
    });

    // Comment patterns
    const keywordsArray = this.config.customKeywords
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    const keywordsPattern = keywordsArray.join('|');

    this.commentPatterns = [
      new RegExp(`^\\s*//\\s*(${keywordsPattern})\\s*:?\\s*(.+)`, 'i'),
      new RegExp(`^\\s*/\\*\\s*(${keywordsPattern})\\s*:?\\s*(.+?)(?:\\*/|$)`, 'i'),
      new RegExp(`^\\s*#\\s*(${keywordsPattern})\\s*:?\\s*(.+)`, 'i'),
      new RegExp(`^\\s*<!--\\s*(${keywordsPattern})\\s*:?\\s*(.+?)(?:-->|$)`, 'i')
    ];
  } 

  /**
   * 프로젝트에서 TODO 주석을 추출합니다.
   */
  async extractTodos(): Promise<TodoItem[]> {
    const todos: TodoItem[] = [];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('워크스페이스가 열려있지 않습니다.');
      return todos;
    }

    const files = await this.getSourceFiles(workspaceFolder.uri.fsPath);
    
    const limit = pLimit(10); // Concurrency limit
    const promises = files.map(file => limit(() => this.extractTodosFromFile(file)));
    const results = await Promise.all(promises);
    
    todos.push(...results.flat());

    return todos;
  }

  /**
   * 지정된 디렉토리에서 소스 파일들을 찾습니다.
   */
  private async getSourceFiles(rootPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = async (dirPath: string) => {
      try {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          
          // 제외할 폴더인지 확인
          if (entry.isDirectory() && this.shouldExcludeFolder(entry.name, fullPath)) {
            continue;
          }
          
          if (entry.isDirectory()) {
            await scanDirectory(fullPath);
          } else if (entry.isFile()) {
            if (this.isSourceFile(entry.name)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`디렉토리 스캔 오류: ${dirPath}`, error);
      }
    };

    await scanDirectory(rootPath);
    return files;
  }

  /**
   * 폴더가 제외되어야 하는지 확인합니다.
   */
  private shouldExcludeFolder(folderName: string, fullPath: string): boolean {
    // 기본 제외 폴더 목록 확인
    if (this.config.excludeFolders.includes(folderName)) {
      return true;
    }

    // Glob 패턴 확인
    const relativePath = path.relative(vscode.workspace.workspaceFolders![0].uri.fsPath, fullPath);
    const normalizedPath = relativePath.replace(/\\/g, '/'); // Windows 경로를 Unix 스타일로 변환
    
    return this.excludeRegexes.some(regex => regex.test(normalizedPath));
  }

  /**
   * 파일이 소스 파일인지 확인합니다.
   */
  private isSourceFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();
    const patterns = this.config.includeFileTypes.map(pattern => 
      pattern.replace('*', '').toLowerCase()
    );
    
    return patterns.some(pattern => ext === pattern);
  }

  /**
   * 단일 파일에서 TODO 주석을 추출합니다.
   */
  private async extractTodosFromFile(filePath: string): Promise<TodoItem[]> {
    const todos: TodoItem[] = [];
    
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const todoMatch = this.findTodoInLine(line);
        
        if (todoMatch) {
          const relativePath = path.relative(vscode.workspace.workspaceFolders![0].uri.fsPath, filePath);
          
          todos.push({
            filePath: relativePath,
            lineNumber: i + 1,
            content: todoMatch.content,
            priority: todoMatch.priority,
            assignee: todoMatch.assignee,
            tags: todoMatch.tags
          });
        }
      }
    } catch (error) {
      console.error(`파일 읽기 오류: ${filePath}`, error);
    }
    
    return todos;
  }

  /**
   * 라인에서 TODO 주석을 찾고 파싱합니다.
   */
  private findTodoInLine(line: string): { content: string; priority?: 'high' | 'medium' | 'low'; assignee?: string; tags?: string[] } | null {
    // 미리 컴파일된 정규식 패턴 사용
    for (const pattern of this.commentPatterns) {
      const match = line.match(pattern);
      if (match) {
        const type = match[1].toUpperCase();
        const content = match[2].trim();
        
        // 우선순위 파싱 (HIGH, MEDIUM, LOW) - 더 정확한 매칭
        const priorityMatch = content.match(/\b(HIGH|MEDIUM|LOW|H|M|L)\b\s*[:\-]?\s*/i);
        const priority = priorityMatch ? this.normalizePriority(priorityMatch[1]) : undefined;
        
        // 담당자 파싱 (@username) - 더 정확한 매칭
        const assigneeMatches = content.match(/@(\w+)/g);
        const assignee = assigneeMatches ? assigneeMatches[0].substring(1) : undefined;
        
        // 태그 파싱 (#tag) - 모든 태그 수집
        const tagMatches = content.match(/#(\w+)/g);
        const tags = tagMatches ? tagMatches.map(tag => tag.substring(1)) : undefined;
        
        // 내용에서 메타데이터 제거 (순서대로 제거)
        let cleanContent = content;
        
        // 우선순위 제거
        if (priorityMatch) {
          cleanContent = cleanContent.replace(/\b(HIGH|MEDIUM|LOW|H|M|L)\b\s*[:\-]?\s*/i, '');
        }
        
        // 담당자 제거
        if (assigneeMatches) {
          cleanContent = cleanContent.replace(/@\w+/g, '');
        }
        
        // 태그 제거
        if (tagMatches) {
          cleanContent = cleanContent.replace(/#\w+/g, '');
        }
        
        // 연속된 공백 정리 및 콜론 정리
        cleanContent = cleanContent.replace(/\s+/g, ' ').replace(/^\s*:\s*/, '').trim();

        return {
          content: `[${type}] ${cleanContent}`,
          priority,
          assignee,
          tags
        };
      }
    }

    return null;
  }

  /**
   * 우선순위를 정규화합니다.
   */
  private normalizePriority(priority: string): 'high' | 'medium' | 'low' {
    const p = priority.toUpperCase();
    if (p === 'HIGH' || p === 'H') return 'high';
    if (p === 'MEDIUM' || p === 'M') return 'medium';
    return 'low';
  }
}
