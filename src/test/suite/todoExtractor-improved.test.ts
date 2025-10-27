import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { TodoExtractor } from '../../todoExtractor';
import { TestDataFactory } from '../helpers/testDataFactory';
import { TestHelpers } from '../helpers/testHelpers';

/**
 * TodoExtractor 개선된 테스트 - 확장 가능한 구조
 */
describe('TodoExtractor Tests (Improved)', () => {
  let extractor: TodoExtractor;

  beforeEach(() => {
    // Factory를 사용하여 설정 생성
    const config = TestDataFactory.createDefaultConfig();
    extractor = new TodoExtractor(config);
  });

  describe('초기화', () => {
    it('TodoExtractor가 올바르게 초기화되어야 함', () => {
      expect(extractor).to.exist;
      expect(extractor).to.be.instanceOf(TodoExtractor);
    });

    it('기본 설정으로 TodoExtractor 생성 가능', () => {
      const config = TestDataFactory.createDefaultConfig();
      const extractor2 = new TodoExtractor(config);
      expect(extractor2).to.exist;
    });

    it('커스텀 설정으로 TodoExtractor 생성 가능', () => {
      const customConfig = TestDataFactory.createCustomConfig({
        customKeywords: 'CUSTOM, TEST'
      });
      const extractor2 = new TodoExtractor(customConfig);
      expect(extractor2).to.exist;
    });
  });

  describe('설정 검증', () => {
    it('모든 필수 설정이 있어야 함', () => {
      const config = TestDataFactory.createDefaultConfig();
      
      expect(config).to.have.property('includeFileTypes');
      expect(config).to.have.property('excludeFolders');
      expect(config).to.have.property('excludePatterns');
      expect(config).to.have.property('customKeywords');
      expect(config).to.have.property('assigneePatterns');
      expect(config).to.have.property('tagPatterns');
    });

    it('includeFileTypes는 배열이어야 함', () => {
      const config = TestDataFactory.createDefaultConfig();
      expect(config.includeFileTypes).to.be.an('array');
      expect(config.includeFileTypes.length).to.be.greaterThan(0);
    });
  });

  describe('다양한 설정 조합', () => {
    it('사용자 지정 파일 타입', () => {
      const config = TestDataFactory.createCustomConfig({
        includeFileTypes: ['*.py', '*.java']
      });
      expect(config.includeFileTypes).to.include('*.py');
      expect(config.includeFileTypes).to.include('*.java');
    });

    it('사용자 지정 제외 폴더', () => {
      const config = TestDataFactory.createCustomConfig({
        excludeFolders: ['build', 'output']
      });
      expect(config.excludeFolders).to.include('build');
      expect(config.excludeFolders).to.include('output');
    });

    it('사용자 지정 키워드', () => {
      const config = TestDataFactory.createCustomConfig({
        customKeywords: 'REVIEW, CHECK, TEST'
      });
      expect(config.customKeywords).to.equal('REVIEW, CHECK, TEST');
    });
  });
});

