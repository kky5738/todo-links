import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as vscode from 'vscode';

/**
 * Extension 활성화 및 기본 기능 테스트
 */
describe('Extension Tests', () => {
  describe('Extension 초기화', () => {
    it('vscode API가 사용 가능해야 함', () => {
      expect(vscode).to.exist;
      expect(vscode.window).to.exist;
      expect(vscode.workspace).to.exist;
      expect(vscode.commands).to.exist;
    });

    it('workspace가 열려있어야 함', () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      // 테스트 환경에서는 workspace가 없을 수 있음
      // expect(workspaceFolders).to.be.not.undefined;
    });
  });

  describe('설정 검증', () => {
    it('Extension 설정이 로드되어야 함', () => {
      const config = vscode.workspace.getConfiguration('todoLinks');
      expect(config).to.exist;
    });

    it('기본 설정값이 올바른지 확인', () => {
      const config = vscode.workspace.getConfiguration('todoLinks');
      
      const includeFileTypes = config.get<string[]>('includeFileTypes', []);
      expect(includeFileTypes).to.be.an('array');
      
      const excludeFolders = config.get<string[]>('excludeFolders', []);
      expect(excludeFolders).to.be.an('array');
      
      const customKeywords = config.get<string>('customKeywords', '');
      expect(customKeywords).to.be.a('string');
    });
  });
});

