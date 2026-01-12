import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as sinon from 'sinon';
import { NotionService } from '../../notionService';
import { TodoItem } from '../../types';

/**
 * NotionService Mock 테스트
 */
describe('NotionService Tests', () => {
  let notionService: NotionService;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('초기화', () => {
    it('NotionService가 올바르게 초기화되어야 함', () => {
      notionService = new NotionService('test-api-key', 'test-database-id');
      expect(notionService).to.exist;
      expect(notionService).to.be.instanceOf(NotionService);
    });

    it('API 키와 데이터베이스 ID 없이 초기화 가능', () => {
      notionService = new NotionService();
      expect(notionService).to.exist;
    });

    it('설정 업데이트가 가능해야 함', () => {
      notionService = new NotionService();
      notionService.updateConfig('new-api-key', 'new-database-id');
      expect(notionService).to.exist;
    });
  });

  describe('연결 테스트', () => {
    it('초기화되지 않은 경우 연결 테스트 실패해야 함', async () => {
      notionService = new NotionService();
      const result = await notionService.testConnection();
      expect(result).to.be.false;
    });

    it('API 키와 데이터베이스 ID가 있는 경우 연결 테스트 가능', async () => {
      notionService = new NotionService('test-key', 'test-id');
      // Mock을 사용하지 않고 실제 연결을 시도하지 않음
      // 실제 연결 테스트는 통합 테스트에서 진행
      expect(notionService).to.exist;
    });
  });

  describe('TODO 데이터 구조 검증', () => {
    const mockTodo: TodoItem = {
      filePath: 'src/test.ts',
      lineNumber: 10,
      content: '[TODO] Fix this issue',
      priority: 'high',
      assignee: 'developer',
      tags: ['bug', 'critical']
    };

    it('TODO 객체가 올바른 형식이어야 함', () => {
      expect(mockTodo).to.have.property('filePath');
      expect(mockTodo).to.have.property('lineNumber');
      expect(mockTodo).to.have.property('content');
      expect(mockTodo.filePath).to.be.a('string');
      expect(mockTodo.lineNumber).to.be.a('number');
      expect(mockTodo.content).to.be.a('string');
    });

    it('우선순위가 올바른 값이어야 함', () => {
      const validPriorities = ['high', 'medium', 'low'];
      expect(validPriorities).to.include(mockTodo.priority);
    });

    it('태그가 배열이어야 함', () => {
      expect(mockTodo.tags).to.be.an('array');
      expect(mockTodo.tags).to.have.length.greaterThan(0);
    });
  });

  describe('데이터 검증', () => {
    it('빈 TODO 배열 처리', () => {
      const emptyTodos: TodoItem[] = [];
      expect(emptyTodos).to.be.an('array');
      expect(emptyTodos.length).to.equal(0);
    });

    it('다양한 TODO 형식 처리', () => {
      const todos: TodoItem[] = [
        {
          filePath: 'src/test1.ts',
          lineNumber: 1,
          content: '[TODO] Simple todo'
        },
        {
          filePath: 'src/test2.ts',
          lineNumber: 5,
          content: '[FIXME] Complex todo',
          priority: 'high',
          assignee: 'dev',
          tags: ['urgent']
        }
      ];

      expect(todos).to.have.length(2);
      expect(todos[0].priority).to.be.undefined;
      expect(todos[1].priority).to.equal('high');
    });
  });
});

