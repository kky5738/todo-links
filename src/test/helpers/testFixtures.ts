import { TodoItem } from '../../types';

/**
 * 테스트 Fixture - 재사용 가능한 테스트 데이터
 */
export const TestFixtures = {
  /**
   * 샘플 TODO 객체
   */
  sampleTodo: {
    filePath: 'src/test.ts',
    lineNumber: 10,
    content: '[TODO] Sample task',
    priority: 'high' as const,
    assignee: 'developer',
    tags: ['bug', 'critical']
  } as TodoItem,

  /**
   * 간단한 TODO 객체
   */
  simpleTodo: {
    filePath: 'src/simple.ts',
    lineNumber: 1,
    content: '[TODO] Simple task'
  } as TodoItem,

  /**
   * 다양한 TODO 배열
   */
  variedTodos: [
    {
      filePath: 'src/file1.ts',
      lineNumber: 10,
      content: '[TODO] Task 1',
      priority: 'high' as const,
      assignee: 'dev1',
      tags: ['bug']
    },
    {
      filePath: 'src/file2.ts',
      lineNumber: 25,
      content: '[FIXME] Task 2',
      priority: 'medium' as const
    },
    {
      filePath: 'src/file3.ts',
      lineNumber: 50,
      content: '[NOTE] Task 3'
    }
  ] as TodoItem[],

  /**
   * 빈 TODO 배열
   */
  emptyTodos: [] as TodoItem[],

  /**
   * 다양한 우선순위 TODO
   */
  todosByPriority: {
    high: [
      { filePath: 'src/high1.ts', lineNumber: 10, content: '[TODO] High 1', priority: 'high' as const },
      { filePath: 'src/high2.ts', lineNumber: 20, content: '[TODO] High 2', priority: 'high' as const }
    ],
    medium: [
      { filePath: 'src/medium1.ts', lineNumber: 30, content: '[FIXME] Medium 1', priority: 'medium' as const }
    ],
    low: [
      { filePath: 'src/low1.ts', lineNumber: 40, content: '[NOTE] Low 1', priority: 'low' as const }
    ]
  },

  /**
   * 다양한 키워드 TODO
   */
  todosByKeyword: [
    { filePath: 'src/todo.ts', lineNumber: 1, content: '[TODO] Task' },
    { filePath: 'src/fixme.ts', lineNumber: 2, content: '[FIXME] Fix' },
    { filePath: 'src/hack.ts', lineNumber: 3, content: '[HACK] Hack' },
    { filePath: 'src/note.ts', lineNumber: 4, content: '[NOTE] Note' },
    { filePath: 'src/bug.ts', lineNumber: 5, content: '[BUG] Bug' }
  ] as TodoItem[]
};

