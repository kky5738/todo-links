# VS Code Extension 테스트

이 폴더는 VS Code Extension의 단위 테스트 및 통합 테스트를 포함합니다.

## 테스트 구조

```
src/test/
├── suite/                       # 테스트 파일들
│   ├── todoExtractor.test.ts   # TodoExtractor 단위 테스트
│   ├── exporters.test.ts        # TodoExporter 단위 테스트
│   ├── notionService.test.ts   # NotionService Mock 테스트
│   ├── slackService.test.ts    # SlackService Mock 테스트
│   ├── services.test.ts        # 서비스 통합 테스트
│   ├── extension.test.ts       # Extension 활성화 테스트
│   ├── integration.test.ts     # 통합 테스트
│   └── index.ts                # 테스트 실행 로더
├── runTest.ts                   # 테스트 진입점
└── README.md                   # 이 파일
```

## 테스트 실행

### 기본 테스트 실행
```bash
npm test
```

## 테스트 구성

### 1. 단위 테스트 (Unit Tests)

#### TodoExtractor 테스트 (`todoExtractor.test.ts`)
- TodoExtractor 클래스의 초기화 테스트
- 파일 타입 검증
- 설정 검증

#### TodoExporter 테스트 (`exporters.test.ts`)
- TodoItem 데이터 구조 검증
- 필수/선택적 필드 검증
- 우선순위, 담당자, 태그 유효성 검증

#### NotionService 테스트 (`notionService.test.ts`)
- NotionService 초기화 및 설정 테스트
- TODO 데이터 구조 검증
- 연결 테스트 로직 검증

#### SlackService 테스트 (`slackService.test.ts`)
- SlackService 초기화 및 설정 테스트
- TODO 데이터 포맷팅 검증
- 연결 테스트 로직 검증

#### Services 통합 테스트 (`services.test.ts`)
- Notion & Slack 서비스 통합 테스트
- 다양한 TODO 데이터 형식 처리
- 서비스 간 데이터 일관성 검증

### 2. 통합 테스트 (Integration Tests)

#### Extension 테스트 (`extension.test.ts`)
- VS Code API 접근성 테스트
- Extension 설정 로드 테스트

#### 통합 테스트 (`integration.test.ts`)
- Extension 명령어 등록 검증
- 설정 관리 및 변경 이벤트 감지
- Workspace 연동 테스트

## 테스트 작성 가이드

### 기본 테스트 구조

```typescript
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

describe('Test Suite', () => {
  beforeEach(() => {
    // 테스트 전 설정
  });

  it('should do something', () => {
    expect(true).to.be.true;
  });
});
```

### Chai Assertions

```typescript
// 기본 검증
expect(value).to.exist;
expect(value).to.equal(expected);
expect(value).to.not.equal(unexpected);

// 타입 검증
expect(value).to.be.a('string');
expect(value).to.be.an('array');

// 배열 검증
expect(array).to.include(item);
expect(array.length).to.be.greaterThan(0);
```

### VS Code API 사용

```typescript
import * as vscode from 'vscode';

// 설정 읽기
const config = vscode.workspace.getConfiguration('todoLinks');
const value = config.get('customKeywords');

// 명령어 실행
const commands = await vscode.commands.getCommands();

// 이벤트 리스너
const disposable = vscode.workspace.onDidChangeConfiguration(event => {
  // 처리
});
```

## 참고 자료

- [VS Code Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [@vscode/test-cli](https://github.com/microsoft/vscode-test-cli)

