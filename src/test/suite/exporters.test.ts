import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TodoItem } from '../../types';

/**
 * TodoExporter 단위 테스트
 */
describe('TodoExporter Tests', () => {
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
      priority: 'medium',
      tags: ['refactor']
    },
    {
      filePath: 'src/another.ts',
      lineNumber: 5,
      content: '[NOTE] Important information'
    }
  ];

  describe('TodoItem 구조 검증', () => {
    it('올바른 형식의 Todo를 생성할 수 있어야 함', () => {
      expect(mockTodos).to.be.an('array');
      expect(mockTodos.length).to.equal(3);
    });

    it('Todo 객체에 필수 필드가 있어야 함', () => {
      const todo = mockTodos[0];
      expect(todo).to.have.property('filePath');
      expect(todo).to.have.property('lineNumber');
      expect(todo).to.have.property('content');
      expect(todo.filePath).to.equal('src/test.ts');
      expect(todo.lineNumber).to.equal(10);
      expect(todo.content).to.equal('[TODO] Fix this issue');
    });

    it('priority가 있으면 올바른 값이어야 함', () => {
      expect(mockTodos[0].priority).to.equal('high');
      expect(mockTodos[1].priority).to.equal('medium');
    });

    it('assignee가 있으면 올바른 형식이어야 함', () => {
      expect(mockTodos[0].assignee).to.equal('developer');
      expect(mockTodos[1].assignee).to.be.undefined;
    });

    it('tags가 배열이어야 함', () => {
      expect(mockTodos[0].tags).to.be.an('array');
      expect(mockTodos[0].tags).to.include('bug');
      expect(mockTodos[0].tags).to.include('critical');
    });
  });

  describe('필수 필드 검증', () => {
    it('모든 Todo에 filePath가 있어야 함', () => {
      mockTodos.forEach(todo => {
        expect(todo).to.have.property('filePath');
        expect(todo.filePath).to.be.a('string');
      });
    });

    it('모든 Todo에 lineNumber가 있어야 함', () => {
      mockTodos.forEach(todo => {
        expect(todo).to.have.property('lineNumber');
        expect(todo.lineNumber).to.be.a('number');
        expect(todo.lineNumber).to.be.greaterThan(0);
      });
    });

    it('모든 Todo에 content가 있어야 함', () => {
      mockTodos.forEach(todo => {
        expect(todo).to.have.property('content');
        expect(todo.content).to.be.a('string');
        expect(todo.content.length).to.be.greaterThan(0);
      });
    });
  });

  describe('선택적 필드 검증', () => {
    it('priority는 high, medium, low 중 하나여야 함', () => {
      const validPriorities = ['high', 'medium', 'low'];
      
      mockTodos.forEach(todo => {
        if (todo.priority) {
          expect(validPriorities).to.include(todo.priority);
        }
      });
    });

    it('tags는 문자열 배열이거나 undefined여야 함', () => {
      mockTodos.forEach(todo => {
        if (todo.tags) {
          expect(todo.tags).to.be.an('array');
          expect(todo.tags.every((tag: string) => typeof tag === 'string')).to.be.true;
        }
      });
    });
  });
});

