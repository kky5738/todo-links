# TODO Links

VSCode 확장으로 코드 주석에서 TODO를 찾아 추출하고 다양한 형식으로 내보낼 수 있는 도구입니다.

## 기능

- 📁 **자동 파일 스캔**: 프로젝트의 모든 소스 파일을 자동으로 스캔
- 🔍 **다양한 주석 형식 지원**: `//`, `/* */`, `#`, `<!-- -->` 등
- 🏷️ **메타데이터 파싱**: 우선순위, 담당자, 태그 자동 추출
- 📊 **다양한 출력 형식**: 터미널, TXT, JSON, CSV
- 🔗 **외부 서비스 연동**: Notion, Slack으로 직접 전송
- ⚙️ **유연한 설정**: 파일 타입, 키워드, API 키 등 커스터마이징 가능
- 🚀 **고성능 처리**: 동시성 제어를 통한 빠른 파일 스캔

## 설치

1. 프로젝트를 클론합니다:
   ```bash
   git clone <repository-url>
   cd todo-links
   ```

2. 의존성을 설치합니다:
   ```bash
   npm install
   ```

3. 프로젝트를 컴파일합니다:
   ```bash
   npm run compile
   ```

4. VSCode에서 F5를 눌러 확장을 실행합니다

## 사용법

### 기본 명령어

`Ctrl+Shift+P`를 눌러 명령 팔레트를 열고 다음 명령어들을 사용할 수 있습니다:

- `TODO Links: Extract TODOs` - 터미널에 TODO 목록 출력
- `TODO Links: Export TODOs to TXT` - TXT 파일로 내보내기
- `TODO Links: Export TODOs to JSON` - JSON 파일로 내보내기
- `TODO Links: Export TODOs to CSV` - CSV 파일로 내보내기
- `TODO Links: Send TODOs to Notion` - Notion으로 전송
- `TODO Links: Send TODOs to Slack` - Slack으로 전송
- `TODO Links: Open Settings` - 설정 창 열기

### TODO 주석 형식

다음과 같은 형식의 주석을 인식합니다:

```javascript
// TODO: 이것은 일반적인 TODO입니다
// FIXME: 버그 수정이 필요합니다
// HACK: 임시 해결책입니다
// NOTE: 중요한 정보입니다
// BUG: 알려진 버그입니다
// WARNING: 주의사항입니다

// TODO HIGH: 높은 우선순위 TODO
// TODO @john: 담당자 지정 TODO
// TODO #frontend #urgent: 태그가 있는 TODO
// TODO HIGH @john #frontend: 모든 메타데이터가 있는 TODO
```

**우선순위 형식:**
- `HIGH`, `H` → 높음
- `MEDIUM`, `M` → 보통
- `LOW`, `L` → 낮음

**담당자 형식:**
- `@username` 형식으로 지정

**태그 형식:**
- `#tag1 #tag2` 형식으로 여러 태그 지정 가능

### 설정

VSCode 설정(`Ctrl+,`)에서 다음 옵션들을 조정할 수 있습니다:

#### 파일 스캔 설정

- `todoLinks.includeFileTypes`: 스캔할 파일 타입 배열
  - 기본값: `*.js`, `*.ts`, `*.jsx`, `*.tsx`, `*.py`, `*.java`, `*.cpp`, `*.c`, `*.cs`, `*.php`, `*.rb`, `*.go`, `*.rs`, `*.swift`, `*.kt`, `*.scala`, `*.vue`, `*.svelte`, `*.html`

- `todoLinks.excludeFolders`: 제외할 폴더 이름 배열
  - 기본값: `node_modules`, `.git`, `dist`, `build`, `out`, `.vscode`, `coverage`, `.nyc_output`, `logs`, `tmp`, `temp`, `todotest`

- `todoLinks.excludePatterns`: 제외할 Glob 패턴 배열
  - 기본값: `**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/build/**`, `**/out/**`, `**/.vscode/**`, `**/coverage/**`, `**/.nyc_output/**`, `**/logs/**`, `**/tmp/**`, `**/temp/**`, `**/todotest/**`

#### 키워드 및 패턴 설정

- `todoLinks.customKeywords`: 검색할 키워드 (쉼표로 구분)
  - 기본값: `TODO, FIXME, HACK, NOTE, BUG, WARNING`
  - 예시: `TODO, FIXME, REVIEW, CHECK`

- `todoLinks.assigneePatterns`: 담당자 식별 패턴
  - 기본값: `@`

- `todoLinks.tagPatterns`: 태그 식별 패턴
  - 기본값: `#`

#### 외부 서비스 설정

- `todoLinks.notionApiKey`: Notion API 키
- `todoLinks.notionDatabaseId`: Notion 데이터베이스 ID
- `todoLinks.slackWebhookUrl`: Slack 웹훅 URL

## Notion 연동

1. Notion에서 새 데이터베이스를 생성합니다
2. 다음 속성들을 추가합니다:
   - `제목` (Title) - **필수**
   - `파일 경로` (Rich Text) - 선택사항
   - `라인 번호` (Number) - 선택사항
   - `상태` (Status 또는 Select) - "To Do", "In Progress", "Done" 등 - 선택사항
   - `우선순위` (Select) - "높음", "보통", "낮음" - 선택사항
   - `담당자` (Rich Text) - 선택사항
   - `태그` (Multi-select) - 선택사항
3. 데이터베이스 ID를 복사하여 설정에 입력합니다
   - 데이터베이스 URL에서 `database_id` 부분을 복사
4. Notion API 키를 생성하여 설정에 입력합니다
   - [Notion Integration](https://www.notion.so/my-integrations)에서 생성

**참고:** 확장은 데이터베이스 스키마를 자동으로 감지하여 적절한 속성에 매핑합니다. 속성명이 다르더라도 타입과 이름 패턴을 기반으로 자동 매핑됩니다.

## Slack 연동

1. Slack에서 Incoming Webhook 앱을 추가합니다
   - [Slack Apps](https://api.slack.com/apps)에서 앱 생성
2. 웹훅 URL을 생성합니다
3. 설정에 웹훅 URL을 입력합니다

**참고:** Slack 메시지는 파일별로 그룹화되어 전송되며, 많은 TODO가 있는 경우 여러 메시지로 분할됩니다.

## 개발

### 프로젝트 구조

```
todo-links/
├── src/
│   ├── extension.ts          # 메인 확장 파일
│   ├── todoExtractor.ts      # TODO 추출 로직
│   ├── exporters.ts          # 파일 내보내기 기능
│   ├── notionService.ts      # Notion API 연동
│   ├── slackService.ts       # Slack API 연동
│   ├── types.ts              # 타입 정의
│   └── test/                 # 테스트 코드
│       ├── suite/            # 테스트 파일들
│       ├── helpers/          # 테스트 헬퍼 함수
│       ├── runTest.ts        # 테스트 실행 진입점
│       └── README.md         # 테스트 가이드
├── out/                      # 컴파일된 JavaScript 파일
├── package.json              # 프로젝트 설정
├── tsconfig.json             # TypeScript 설정
└── README.md                 # 이 파일
```

### 빌드

```bash
# TypeScript 컴파일
npm run compile

# Watch 모드로 컴파일 (개발 중)
npm run watch
```

### 테스트

프로젝트는 Mocha, Chai, Sinon을 사용하여 단위 테스트와 통합 테스트를 포함합니다.

```bash
# 모든 테스트 실행
npm test

# 단위 테스트만 실행
npm run test:unit

# 통합 테스트만 실행
npm run test:integration
```

자세한 테스트 가이드는 `src/test/README.md`를 참조하세요.

### 디버깅

1. VSCode에서 F5를 눌러 새 창에서 확장을 실행합니다
2. 새 창에서 프로젝트를 열고 명령어를 테스트합니다
3. 디버그 콘솔에서 로그를 확인할 수 있습니다

### 의존성

**런타임 의존성:**
- `@notionhq/client`: Notion API 클라이언트
- `axios`: HTTP 요청 (Slack 연동)
- `p-limit`: 동시성 제어

**개발 의존성:**
- `typescript`: TypeScript 컴파일러
- `@vscode/test-cli`, `@vscode/test-electron`: VS Code 확장 테스트
- `mocha`, `chai`, `sinon`: 테스트 프레임워크

## 라이선스

MIT License
