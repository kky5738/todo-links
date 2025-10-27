import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TestDataFactory } from '../helpers/testDataFactory';
import { TestHelpers } from '../helpers/testHelpers';
import { TestFixtures } from '../helpers/testFixtures';

/**
 * 개선된 테스트 예제
 * Factory, Fixture, Helper를 사용한 확장 가능한 테스트 구조
 */
describe('Improved Test Example', () => {
  describe('Factory 사용 - 동적 데이터 생성', () => {
    it('기본 Todo 생성', () => {
      const todo = TestDataFactory.createTodo();
      TestHelpers.validateTodoStructure(todo);
    });

    it('커스텀 속성을 가진 Todo 생성', () => {
      const todo = TestDataFactory.createTodo({
        filePath: 'custom/path.ts',
        lineNumber: 99,
        content: 'Custom content',
        priority: 'high'
      });
      
      expect(todo.filePath).to.equal('custom/path.ts');
      expect(todo.lineNumber).to.equal(99);
      expect(todo.content).to.equal('Custom content');
      expect(todo.priority).to.equal('high');
    });

    it('여러 Todo 생성', () => {
      const todos = TestDataFactory.createTodos(5);
      TestHelpers.validateArrayLength(todos, 5);
      TestHelpers.validateTodoArray(todos);
    });

    it('우선순위별 Todo 생성', () => {
      const highTodo = TestDataFactory.createTodoWithPriority('high');
      const mediumTodo = TestDataFactory.createTodoWithPriority('medium');
      const lowTodo = TestDataFactory.createTodoWithPriority('low');
      
      TestHelpers.validatePriority(highTodo.priority);
      TestHelpers.validatePriority(mediumTodo.priority);
      TestHelpers.validatePriority(lowTodo.priority);
    });
  });

  describe('Fixture 사용 - 재사용 가능한 데이터', () => {
    it('샘플 TODO 검증', () => {
      TestHelpers.validateCompleteTodo(TestFixtures.sampleTodo);
      expect(TestFixtures.sampleTodo.priority).to.equal('high');
      expect(TestFixtures.sampleTodo.assignee).to.equal('developer');
      expect(TestFixtures.sampleTodo.tags).to.include('bug');
    });

    it('간단한 TODO 검증', () => {
      TestHelpers.validateTodoStructure(TestFixtures.simpleTodo);
      expect(TestFixtures.simpleTodo.priority).to.be.undefined;
      expect(TestFixtures.simpleTodo.assignee).to.be.undefined;
      expect(TestFixtures.simpleTodo.tags).to.be.undefined;
    });

    it('다양한 TODO 배열 검증', () => {
      TestHelpers.validateTodoArray(TestFixtures.variedTodos);
      expect(TestFixtures.variedTodos).to.have.length(3);
    });
  });

  describe('Helper 사용 - 공통 검증 로직', () => {
    it('빈 배열 검증', () => {
      TestHelpers.validateEmptyArray(TestFixtures.emptyTodos);
    });

    it('다양한 TODO 형식 검증', () => {
      const todos = TestDataFactory.createVariedTodos();
      TestHelpers.validateTodoArray(todos);
      
      todos.forEach(todo => {
        TestHelpers.validateFilePath(todo.filePath);
        TestHelpers.validateLineNumber(todo.lineNumber);
        TestHelpers.validateContent(todo.content);
        
        if (todo.priority) {
          TestHelpers.validatePriority(todo.priority);
        }
        
        if (todo.tags) {
          TestHelpers.validateTags(todo.tags);
        }
      });
    });
  });

  describe('복잡한 시나리오 테스트', () => {
    it('완전한 Todo 생성 및 검증', () => {
      const completeTodo = TestDataFactory.createCompleteTodo();
      TestHelpers.validateCompleteTodo(completeTodo);
      
      expect(completeTodo.priority).to.equal('high');
      expect(completeTodo.assignee).to.equal('developer');
      expect(completeTodo.tags).to.have.length(3);
      expect(completeTodo.tags).to.include('bug');
      expect(completeTodo.tags).to.include('urgent');
      expect(completeTodo.tags).to.include('critical');
    });

    it('다양한 키워드 TODO 생성', () => {
      const keywords: Array<'TODO' | 'FIXME' | 'HACK' | 'NOTE' | 'BUG'> = ['TODO', 'FIXME', 'HACK'];
      
      keywords.forEach(keyword => {
        const todo = TestDataFactory.createTodoWithKeyword(keyword);
        expect(todo.content).to.include(keyword);
        TestHelpers.validateTodoStructure(todo);
      });
    });
  });
});

