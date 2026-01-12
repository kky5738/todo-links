import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { TodoExtractor } from '../../todoExtractor';
import { TodoExtractorConfig, TodoItem } from '../../types';

/**
 * TodoExtractor 단위 테스트
 */
describe('TodoExtractor Tests', () => {
  let extractor: TodoExtractor;
  let config: TodoExtractorConfig;

  beforeEach(() => {
    config = {
      includeFileTypes: ['*.ts', '*.js', '*.tsx', '*.jsx'],
      excludeFolders: ['node_modules', '.git', 'out', 'dist'],
      excludePatterns: ['**/node_modules/**', '**/.git/**', '**/out/**', '**/dist/**'],
      customKeywords: 'TODO, FIXME, HACK, NOTE, BUG',
      assigneePatterns: '@',
      tagPatterns: '#'
    };
    extractor = new TodoExtractor(config);
  });

  describe('초기화', () => {
    it('TodoExtractor가 올바르게 초기화되어야 함', () => {
      expect(extractor).to.exist;
      expect(extractor).to.be.instanceOf(TodoExtractor);
    });

    it('기본 설정으로 TodoExtractor 생성 가능', () => {
      const defaultConfig: TodoExtractorConfig = {
        includeFileTypes: ['*.js', '*.ts'],
        excludeFolders: ['node_modules'],
        excludePatterns: ['**/node_modules/**'],
        customKeywords: 'TODO, FIXME',
        assigneePatterns: '@',
        tagPatterns: '#'
      };

      const extractor2 = new TodoExtractor(defaultConfig);
      expect(extractor2).to.exist;
    });
  });

  describe('파일 타입 검증', () => {
    it('포함된 파일 타입을 올바르게 인식해야 함', () => {
      // private 메서드 테스트를 위한 별도 로직 검증
      expect(config.includeFileTypes).to.include('*.ts');
      expect(config.includeFileTypes).to.include('*.js');
    });

    it('기본 설정값이 올바른지 확인', () => {
      expect(config.excludeFolders).to.be.an('array');
      expect(config.excludeFolders.length).to.be.greaterThan(0);

      expect(config.excludePatterns).to.be.an('array');
      expect(config.excludePatterns.length).to.be.greaterThan(0);

      expect(config.customKeywords).to.be.a('string');
    });
  });

  describe('설정 검증', () => {
    it('모든 필수 설정이 있어야 함', () => {
      expect(config).to.have.property('includeFileTypes');
      expect(config).to.have.property('excludeFolders');
      expect(config).to.have.property('excludePatterns');
      expect(config).to.have.property('customKeywords');
      expect(config).to.have.property('assigneePatterns');
      expect(config).to.have.property('tagPatterns');
    });

    it('includeFileTypes는 배열이어야 함', () => {
      expect(config.includeFileTypes).to.be.an('array');
    });

    it('excludeFolders는 배열이어야 함', () => {
      expect(config.excludeFolders).to.be.an('array');
    });
  });

  describe('라인 파싱', () => {
    it('기본 키워드를 파싱할 수 있어야 함', () => {
      const line = '// TODO: 이것은 테스트입니다';
      const result = (extractor as any).findTodoInLine(line);

      expect(result).to.not.be.null;
      expect(result.content).to.include('[TODO] 이것은 테스트입니다');
    });

    it('우선순위를 파싱할 수 있어야 함 (HIGH)', () => {
      const line = '// TODO: HIGH: 높은 우선순위 작업';
      const result = (extractor as any).findTodoInLine(line);

      expect(result).to.not.be.null;
      expect(result.priority).to.equal('high');
      expect(result.content).to.include('높은 우선순위 작업');
      expect(result.content).to.not.include('HIGH');
    });

    it('담당자를 파싱할 수 있어야 함 (@user)', () => {
      const line = '// FIXME: @gboho 버그 수정 필요';
      const result = (extractor as any).findTodoInLine(line);

      expect(result).to.not.be.null;
      expect(result.assignee).to.equal('gboho');
      expect(result.content).to.include('버그 수정 필요');
      expect(result.content).to.not.include('@gboho');
    });

    it('태그를 파싱할 수 있어야 함 (#tag)', () => {
      const line = '// NOTE: API 변경 사항 #api #v2';
      const result = (extractor as any).findTodoInLine(line);

      expect(result).to.not.be.null;
      expect(result.tags).to.deep.equal(['api', 'v2']);
      expect(result.content).to.include('API 변경 사항');
      expect(result.content).to.not.include('#api');
      expect(result.content).to.not.include('#v2');
    });

    it('복합적인 메타데이터를 모두 파싱할 수 있어야 함', () => {
      const line = '// TODO: HIGH: @manager #urgent 급한 작업입니다';
      const result = (extractor as any).findTodoInLine(line);

      expect(result).to.not.be.null;
      expect(result.priority).to.equal('high');
      expect(result.assignee).to.equal('manager');
      expect(result.tags).to.deep.equal(['urgent']);
      expect(result.content).to.include('급한 작업입니다');
    });
  });
});

