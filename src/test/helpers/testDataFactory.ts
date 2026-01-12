import { TodoItem, TodoExtractorConfig } from '../../types';

/**
 * 테스트 데이터 생성 Factory
 * 확장 가능한 테스트 데이터 생성을 위한 빌더 패턴
 */
export class TestDataFactory {
  /**
   * 기본 Todo 객체 생성
   */
  static createTodo(overrides?: Partial<TodoItem>): TodoItem {
    return {
      filePath: 'src/test.ts',
      lineNumber: 10,
      content: '[TODO] Default todo',
      ...overrides
    };
  }

  /**
   * 여러 Todo 객체 생성
   */
  static createTodos(count: number, overrides?: Partial<TodoItem>): TodoItem[] {
    return Array.from({ length: count }, (_, i) => ({
      filePath: `src/test${i}.ts`,
      lineNumber: (i + 1) * 10,
      content: `[TODO] Task ${i + 1}`,
      ...overrides
    }));
  }

  /**
   * 우선순위가 있는 Todo 생성
   */
  static createTodoWithPriority(priority: 'high' | 'medium' | 'low'): TodoItem {
    return this.createTodo({
      content: `[TODO] ${priority} priority task`,
      priority
    });
  }

  /**
   * 담당자가 있는 Todo 생성
   */
  static createTodoWithAssignee(assignee: string): TodoItem {
    return this.createTodo({
      content: `[TODO] Assigned to @${assignee}`,
      assignee
    });
  }

  /**
   * 태그가 있는 Todo 생성
   */
  static createTodoWithTags(tags: string[]): TodoItem {
    return this.createTodo({
      content: '[TODO] Tagged task',
      tags
    });
  }

  /**
   * 완전한 Todo 생성 (모든 선택적 필드 포함)
   */
  static createCompleteTodo(): TodoItem {
    return {
      filePath: 'src/complete.ts',
      lineNumber: 42,
      content: '[FIXME] Complete task',
      priority: 'high',
      assignee: 'developer',
      tags: ['bug', 'urgent', 'critical']
    };
  }

  /**
   * 빈 Todo 배열 생성
   */
  static createEmptyTodoArray(): TodoItem[] {
    return [];
  }

  /**
   * 다양한 형식의 Todo 배열 생성
   */
  static createVariedTodos(): TodoItem[] {
    return [
      this.createTodo({ filePath: 'src/simple.ts', content: '[TODO] Simple' }),
      this.createTodo({ filePath: 'src/high.ts', priority: 'high', content: '[TODO] High priority' }),
      this.createTodo({ filePath: 'src/assigned.ts', assignee: 'dev', content: '[TODO] Assigned' }),
      this.createTodo({ filePath: 'src/tagged.ts', tags: ['bug', 'test'], content: '[TODO] Tagged' }),
      this.createCompleteTodo()
    ];
  }

  /**
   * 기본 설정 생성
   */
  static createDefaultConfig(): TodoExtractorConfig {
    return {
      includeFileTypes: ['*.ts', '*.js', '*.tsx', '*.jsx'],
      excludeFolders: ['node_modules', '.git', 'out', 'dist'],
      excludePatterns: ['**/node_modules/**', '**/.git/**', '**/out/**', '**/dist/**'],
      customKeywords: 'TODO, FIXME, HACK, NOTE, BUG',
      assigneePatterns: '@',
      tagPatterns: '#'
    };
  }

  /**
   * 커스텀 설정 생성
   */
  static createCustomConfig(overrides?: Partial<TodoExtractorConfig>): TodoExtractorConfig {
    return {
      ...this.createDefaultConfig(),
      ...overrides
    };
  }

  /**
   * 특정 키워드가 포함된 Todo 생성
   */
  static createTodoWithKeyword(keyword: 'TODO' | 'FIXME' | 'HACK' | 'NOTE' | 'BUG'): TodoItem {
    return this.createTodo({
      content: `[${keyword}] Task with keyword ${keyword}`
    });
  }
}

