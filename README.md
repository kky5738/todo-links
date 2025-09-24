# TODO Links

VSCode 확장으로 코드 주석에서 TODO를 찾아 추출하고 다양한 형식으로 내보낼 수 있는 도구입니다.

## 기능

- 📁 **자동 파일 스캔**: 프로젝트의 모든 소스 파일을 자동으로 스캔
- 🔍 **다양한 주석 형식 지원**: `//`, `/* */`, `#`, `<!-- -->` 등
- 🏷️ **메타데이터 파싱**: 우선순위, 담당자, 태그 자동 추출
- 📊 **다양한 출력 형식**: 터미널, TXT, JSON, CSV
- 🔗 **외부 서비스 연동**: Notion, Slack으로 직접 전송
- ⚙️ **유연한 설정**: 파일 타입, API 키 등 커스터마이징 가능

## 설치

1. 프로젝트를 클론합니다
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

- `Ctrl+Shift+P`를 눌러 명령 팔레트를 열고 다음 명령어들을 사용할 수 있습니다:
  - `TODO Links: Extract TODOs` - 터미널에 TODO 목록 출력
  - `TODO Links: Export TODOs to TXT` - TXT 파일로 내보내기
  - `TODO Links: Export TODOs to JSON` - JSON 파일로 내보내기
  - `TODO Links: Export TODOs to CSV` - CSV 파일로 내보내기
  - `TODO Links: Send TODOs to Notion` - Notion으로 전송
  - `TODO Links: Send TODOs to Slack` - Slack으로 전송

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

### 설정

VSCode 설정에서 다음 옵션들을 조정할 수 있습니다:

- `todoLinks.includeFileTypes`: 스캔할 파일 타입 (기본값: `*.js`, `*.ts`, `*.jsx`, `*.tsx`, `*.py`, `*.java`, `*.cpp`, `*.c`, `*.cs`, `*.php`, `*.rb`, `*.go`, `*.rs`, `*.swift`, `*.kt`, `*.scala`, `*.vue`, `*.svelte`)
- `todoLinks.excludeFolders`: 제외할 폴더 이름 (기본값: `node_modules`, `.git`, `dist`, `build`, `out`, `.vscode`, `coverage`, `.nyc_output`, `logs`, `tmp`, `temp`, `todotest`)
- `todoLinks.excludePatterns`: 제외할 Glob 패턴 (기본값: `**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/build/**`, `**/out/**`, `**/.vscode/**`, `**/coverage/**`, `**/.nyc_output/**`, `**/logs/**`, `**/tmp/**`, `**/temp/**`, `**/todotest/**`)
- `todoLinks.notionApiKey`: Notion API 키
- `todoLinks.notionDatabaseId`: Notion 데이터베이스 ID
- `todoLinks.slackWebhookUrl`: Slack 웹훅 URL

## Notion 연동

1. Notion에서 새 데이터베이스를 생성합니다
2. 다음 속성들을 추가합니다:
   - `제목` (Title)
   - `파일 경로` (Rich Text)
   - `라인 번호` (Number)
   - `상태` (Select) - "To Do", "In Progress", "Done" 등
   - `우선순위` (Select) - "높음", "보통", "낮음" (선택사항)
   - `담당자` (Rich Text) (선택사항)
   - `태그` (Multi-select) (선택사항)
3. 데이터베이스 ID를 복사하여 설정에 입력합니다
4. Notion API 키를 생성하여 설정에 입력합니다

## Slack 연동

1. Slack에서 Incoming Webhook 앱을 추가합니다
2. 웹훅 URL을 생성합니다
3. 설정에 웹훅 URL을 입력합니다

## 개발

### 프로젝트 구조

```
src/
├── extension.ts          # 메인 확장 파일
├── todoExtractor.ts      # TODO 추출 로직
├── exporters.ts          # 파일 내보내기 기능
├── notionService.ts      # Notion API 연동
├── slackService.ts       # Slack API 연동
└── types.ts              # 타입 정의
```

### 빌드

```bash
npm run compile
```

### 디버깅

1. VSCode에서 F5를 눌러 새 창에서 확장을 실행합니다
2. 새 창에서 프로젝트를 열고 명령어를 테스트합니다

## 라이선스

MIT License
# todo-links
# todo-links
