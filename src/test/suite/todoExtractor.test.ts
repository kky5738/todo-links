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
});

