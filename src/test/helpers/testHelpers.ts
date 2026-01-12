import { expect } from 'chai';
import { TodoItem } from '../../types';

/**
 * 테스트 헬퍼 함수
 * 공통 검증 로직을 재사용 가능하게 만듦
 */
export class TestHelpers {
  /**
   * Todo 객체의 기본 구조 검증
   */
  static validateTodoStructure(todo: TodoItem): void {
    expect(todo).to.have.property('filePath');
    expect(todo).to.have.property('lineNumber');
    expect(todo).to.have.property('content');
    expect(todo.filePath).to.be.a('string');
    expect(todo.lineNumber).to.be.a('number');
    expect(todo.content).to.be.a('string');
  }

  /**
   * Todo 배열의 모든 항목 검증
   */
  static validateTodoArray(todos: TodoItem[]): void {
    expect(todos).to.be.an('array');
    todos.forEach(todo => this.validateTodoStructure(todo));
  }

  /**
   * 우선순위 유효성 검증
   */
  static validatePriority(priority?: string): void {
    if (priority) {
      expect(['high', 'medium', 'low']).to.include(priority);
    }
  }

  /**
   * 태그 배열 검증
   */
  static validateTags(tags?: string[]): void {
    if (tags) {
      expect(tags).to.be.an('array');
      expect(tags.every(tag => typeof tag === 'string')).to.be.true;
      expect(tags.length).to.be.greaterThan(0);
    }
  }

  /**
   * 담당자 형식 검증
   */
  static validateAssignee(assignee?: string): void {
    if (assignee) {
      expect(assignee).to.be.a('string');
      expect(assignee.length).to.be.greaterThan(0);
    }
  }

  /**
   * 완전한 Todo 검증 (모든 필드 포함)
   */
  static validateCompleteTodo(todo: TodoItem): void {
    this.validateTodoStructure(todo);
    
    if (todo.priority) {
      this.validatePriority(todo.priority);
    }
    
    if (todo.assignee) {
      this.validateAssignee(todo.assignee);
    }
    
    if (todo.tags) {
      this.validateTags(todo.tags);
    }
  }

  /**
   * 파일 경로 유효성 검증
   */
  static validateFilePath(filePath: string): void {
    expect(filePath).to.be.a('string');
    expect(filePath.length).to.be.greaterThan(0);
  }

  /**
   * 라인 번호 유효성 검증
   */
  static validateLineNumber(lineNumber: number): void {
    expect(lineNumber).to.be.a('number');
    expect(lineNumber).to.be.greaterThan(0);
  }

  /**
   * TODO 콘텐츠 형식 검증
   */
  static validateContent(content: string): void {
    expect(content).to.be.a('string');
    expect(content.length).to.be.greaterThan(0);
  }

  /**
   * 배열이 비어있는지 확인
   */
  static validateEmptyArray<T>(array: T[]): void {
    expect(array).to.be.an('array');
    expect(array.length).to.equal(0);
  }

  /**
   * 배열 길이 검증
   */
  static validateArrayLength<T>(array: T[], expectedLength: number): void {
    expect(array).to.be.an('array');
    expect(array.length).to.equal(expectedLength);
  }
}

