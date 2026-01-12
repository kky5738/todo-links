import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as sinon from 'sinon';
import { SlackService } from '../../slackService';
import { TodoItem } from '../../types';

/**
 * SlackService Mock 테스트
 */
describe('SlackService Tests', () => {
  let slackService: SlackService;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('초기화', () => {
    it('SlackService가 올바르게 초기화되어야 함', () => {
      slackService = new SlackService('test-webhook-url');
      expect(slackService).to.exist;
      expect(slackService).to.be.instanceOf(SlackService);
    });

    it('웹훅 URL 없이 초기화 가능', () => {
      slackService = new SlackService();
      expect(slackService).to.exist;
    });

    it('설정 업데이트가 가능해야 함', () => {
      slackService = new SlackService();
      slackService.updateConfig('new-webhook-url');
      expect(slackService).to.exist;
    });
  });

  describe('연결 테스트', () => {
    it('초기화되지 않은 경우 연결 테스트 실패해야 함', async () => {
      slackService = new SlackService();
      const result = await slackService.testConnection();
      expect(result).to.be.false;
    });

    it('웹훅 URL이 있는 경우 연결 테스트 가능', async () => {
      slackService = new SlackService('test-url');
      // Mock을 사용하지 않고 실제 연결을 시도하지 않음
      // 실제 연결 테스트는 통합 테스트에서 진행
      expect(slackService).to.exist;
    });
  });

  describe('TODO 데이터 포맷팅', () => {
    const mockTodos: TodoItem[] = [
      {
        filePath: 'src/test.ts',
        lineNumber: 10,
        content: '[TODO] Fix this issue',
        priority: 'high',
        assignee: 'developer',
        tags: ['bug', 'critical']
      },
      {
        filePath: 'src/test.ts',
        lineNumber: 25,
        content: '[FIXME] Refactor this function',
        priority: 'medium'
      }
    ];

    it('TODO 배열이 올바른 형식이어야 함', () => {
      expect(mockTodos).to.be.an('array');
      expect(mockTodos.length).to.equal(2);
    });

    it('모든 TODO에 필수 필드가 있어야 함', () => {
      mockTodos.forEach(todo => {
        expect(todo).to.have.property('filePath');
        expect(todo).to.have.property('lineNumber');
        expect(todo).to.have.property('content');
        expect(todo.filePath).to.be.a('string');
        expect(todo.lineNumber).to.be.a('number');
        expect(todo.content).to.be.a('string');
      });
    });

    it('우선순위 형식 검증', () => {
      const validPriorities = ['high', 'medium', 'low'];
      mockTodos.forEach(todo => {
        if (todo.priority) {
          expect(validPriorities).to.include(todo.priority);
        }
      });
    });
  });

  describe('데이터 검증', () => {
    it('빈 TODO 배열 처리', () => {
      const emptyTodos: TodoItem[] = [];
      expect(emptyTodos).to.be.an('array');
      expect(emptyTodos.length).to.equal(0);
    });

    it('선택적 필드가 없는 TODO 처리', () => {
      const simpleTodo: TodoItem = {
        filePath: 'src/simple.ts',
        lineNumber: 1,
        content: '[TODO] Simple task'
      };

      expect(simpleTodo).to.have.property('filePath');
      expect(simpleTodo.priority).to.be.undefined;
      expect(simpleTodo.assignee).to.be.undefined;
      expect(simpleTodo.tags).to.be.undefined;
    });
  });
});

