# VS Code Extension 테스트 가이드

이 프로젝트는 `@vscode/test-cli`, `@vscode/test-electron`, `sinon`, `mocha`, `chai`를 사용하여 VS Code Extension을 테스트합니다.

## 📦 설치된 패키지

```json
{
  "devDependencies": {
    "@types/chai": "^5.2.3",
    "@types/mocha": "^10.0.10",
    "@types/sinon": "^17.0.5",
    "@vscode/test-cli": "^0.0.12",
    "@vscode/test-electron": "^2.5.2",
    "chai": "^6.2.0",
    "mocha": "^11.7.4",
    "sinon": "^18.2.0",
    "typescript": "^4.9.4"
  }
}
```

## 🚀 테스트 실행

### 기본 테스트 실행
```bash
npm test
```

## 📋 테스트 구성

### 1. 단위 테스트 (Unit Tests)

#### `todoExtractor.test.ts`
- TodoExtractor 클래스 초기화 검증
- 파일 타입 및 설정 검증
- 다양한 설정 조합 테스트

#### `exporters.test.ts`
- TodoItem 데이터 구조 검증
- 필수/선택적 필드 유효성 검증
- 우선순위, 담당자, 태그 검증

#### `notionService.test.ts`
- NotionService 초기화 및 설정 테스트
- TODO 데이터 구조 검증
- 연결 테스트 로직 검증
- Mock을 사용한 외부 API 분리 테스트

#### `slackService.test.ts`
- SlackService 초기화 및 설정 테스트
- TODO 데이터 포맷팅 검증
- 연결 테스트 로직 검증
- Mock을 사용한 외부 API 분리 테스트

### 2. 통합 테스트 (Integration Tests)

#### `services.test.ts`
- Notion & Slack 서비스 통합 테스트
- 다양한 TODO 데이터 형식 처리
- 서비스 간 데이터 일관성 검증

#### `extension.test.ts`
- VS Code API 접근성 테스트
- Extension 설정 로드 및 검증

#### `integration.test.ts`
- Extension 명령어 등록 검증
- 설정 관리 및 변경 이벤트 감지
- Workspace 연동 테스트

## 🎯 Mock 테스트 예제

### NotionService Mock 테스트

```typescript
import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import { NotionService } from '../../notionService';

describe('NotionService Tests', () => {
  it('초기화 테스트', () => {
    const service = new NotionService('test-key', 'test-id');
    expect(service).to.exist;
  });

  it('연결 테스트 실패 시나리오', async () => {
    const service = new NotionService();
    const result = await service.testConnection();
    expect(result).to.be.false;
  });
});
```

### SlackService Mock 테스트

```typescript
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { SlackService } from '../../slackService';

describe('SlackService Tests', () => {
  it('초기화 테스트', () => {
    const service = new SlackService('test-webhook-url');
    expect(service).to.exist;
  });

  it('설정 업데이트 테스트', () => {
    const service = new SlackService();
    service.updateConfig('new-webhook-url');
    expect(service).to.exist;
  });
});
```

## 🔍 Chai Assertions 사용법

```typescript
import { expect } from 'chai';

// 기본 검증
expect(value).to.exist;
expect(value).to.equal(expected);
expect(value).to.be.true;
expect(value).to.be.false;

// 타입 검증
expect(value).to.be.a('string');
expect(value).to.be.an('array');
expect(value).to.be.an('object');

// 배열 검증
expect(array).to.include(item);
expect(array).to.have.length(3);
expect(array.length).to.be.greaterThan(0);

// 객체 검증
expect(obj).to.have.property('key');
expect(obj).to.have.all.keys('key1', 'key2');
expect(obj.key).to.equal('value');
```

## 🛠️ Sinon Mock 사용법

```typescript
import * as sinon from 'sinon';
import { describe, it, beforeEach, afterEach } from 'mocha';

describe('Mock Example', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should mock axios calls', () => {
    const mockPost = sandbox.stub(axios, 'post');
    mockPost.resolves({ status: 200, data: {} });
    
    // 테스트 로직
  });
});
```

## 📊 현재 테스트 결과

```
61 passing (264ms)

- TodoExtractor Tests: 6 passing
- TodoExporter Tests: 9 passing
- NotionService Tests: 6 passing
- SlackService Tests: 6 passing
- Services Integration Tests: 12 passing
- Extension Tests: 4 passing
- Integration Tests: 8 passing
```

## 📚 참고 자료

- [VS Code Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [Sinon Documentation](https://sinonjs.org/)
- [@vscode/test-cli](https://github.com/microsoft/vscode-test-cli)
- [@vscode/test-electron](https://github.com/microsoft/vscode-test)

## 💡 테스트 작성 팁

1. **단위 테스트**: 각 클래스와 메서드를 독립적으로 테스트
2. **통합 테스트**: 여러 컴포넌트가 함께 동작하는지 테스트
3. **Mock 사용**: 외부 API 호출은 Mock으로 대체하여 테스트 속도 향상
4. **의존성 분리**: Mock을 사용하여 의존성을 분리하고 독립적인 테스트 가능

