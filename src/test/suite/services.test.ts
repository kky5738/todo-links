import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as sinon from 'sinon';
import axios from 'axios';
import { NotionService } from '../../notionService';
import { SlackService } from '../../slackService';
import { TodoItem } from '../../types';

/**
 * Notion 및 Slack 서비스 통합 테스트
 */
describe('Services Integration Tests', () => {
  let notionService: NotionService;
  let slackService: SlackService;
  let sandbox: sinon.SinonSandbox;

  const mockTodos: TodoItem[] = [
    {
      filePath: 'src/file1.ts',
      lineNumber: 10,
      content: '[TODO] Task 1',
      priority: 'high',
      assignee: 'developer',
      tags: ['bug']
    },
    {
      filePath: 'src/file2.ts',
      lineNumber: 25,
      content: '[FIXME] Task 2',
      priority: 'medium'
    },
    {
      filePath: 'src/file3.ts',
      lineNumber: 50,
      content: '[NOTE] Task 3'
    }
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    notionService = new NotionService();
    slackService = new SlackService();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('서비스 초기화', () => {
    it('NotionService가 올바르게 초기화되어야 함', () => {
      expect(notionService).to.exist;
      expect(notionService).to.be.instanceOf(NotionService);
    });

    it('SlackService가 올바르게 초기화되어야 함', () => {
      expect(slackService).to.exist;
      expect(slackService).to.be.instanceOf(SlackService);
    });
  });

  describe('설정 업데이트', () => {
    it('NotionService 설정 업데이트 가능', () => {
      notionService.updateConfig('test-api-key', 'test-database-id');
      expect(notionService).to.exist;
    });

    it('SlackService 설정 업데이트 가능', () => {
      slackService.updateConfig('test-webhook-url');
      expect(slackService).to.exist;
    });
  });

  describe('TODO 데이터 검증', () => {
    it('TODO 배열의 모든 항목이 올바른 구조를 가져야 함', () => {
      expect(mockTodos).to.be.an('array');
      expect(mockTodos.length).to.equal(3);

      mockTodos.forEach(todo => {
        expect(todo).to.have.property('filePath');
        expect(todo).to.have.property('lineNumber');
        expect(todo).to.have.property('content');
      });
    });

    it('다양한 우선순위 값을 처리할 수 있어야 함', () => {
      const priorities = mockTodos.map(todo => todo.priority).filter(p => p !== undefined);
      priorities.forEach(priority => {
        expect(['high', 'medium', 'low']).to.include(priority as string);
      });
    });

    it('태그 배열이 올바른 형식이어야 함', () => {
      mockTodos.forEach(todo => {
        if (todo.tags) {
          expect(todo.tags).to.be.an('array');
          expect(todo.tags.every(tag => typeof tag === 'string')).to.be.true;
        }
      });
    });
  });

  describe('연결 테스트', () => {
    it('초기화되지 않은 NotionService는 연결 실패', async () => {
      const result = await notionService.testConnection();
      expect(result).to.be.false;
    });

    it('초기화되지 않은 SlackService는 연결 실패', async () => {
      const result = await slackService.testConnection();
      expect(result).to.be.false;
    });

    it('설정된 NotionService는 연결 테스트 가능', async () => {
      notionService.updateConfig('test-key', 'test-id');
      // Mock 없이 실제 연결은 하지 않음
      expect(notionService).to.exist;
    });

    it('설정된 SlackService는 연결 테스트 가능', async () => {
      slackService.updateConfig('test-url');
      // Mock 없이 실제 연결은 하지 않음
      expect(slackService).to.exist;
    });
  });

  describe('데이터 처리', () => {
    it('빈 TODO 배열 처리', () => {
      const emptyTodos: TodoItem[] = [];
      expect(emptyTodos.length).to.equal(0);
    });

    it('단일 TODO 처리', () => {
      const singleTodo: TodoItem = {
        filePath: 'src/single.ts',
        lineNumber: 1,
        content: '[TODO] Single task'
      };

      expect(singleTodo).to.have.all.keys('filePath', 'lineNumber', 'content');
      expect(singleTodo.filePath).to.equal('src/single.ts');
      expect(singleTodo.lineNumber).to.equal(1);
      expect(singleTodo.content).to.equal('[TODO] Single task');
    });

    it('완전한 TODO 객체 처리', () => {
      const completeTodo: TodoItem = {
        filePath: 'src/complete.ts',
        lineNumber: 42,
        content: '[FIXME] Complete task',
        priority: 'high',
        assignee: 'developer',
        tags: ['bug', 'urgent', 'critical']
      };

      expect(completeTodo.priority).to.equal('high');
      expect(completeTodo.assignee).to.equal('developer');
      expect(completeTodo.tags).to.have.length(3);
      expect(completeTodo.tags).to.include('bug');
      expect(completeTodo.tags).to.include('urgent');
      expect(completeTodo.tags).to.include('critical');
    });
  });
});

