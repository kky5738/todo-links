import * as assert from 'assert';
import { TodoExtractor } from '../../todoExtractor';
import { TodoExtractorConfig } from '../../types';

suite('TodoExtractor Unit Tests', () => {
    const config: TodoExtractorConfig = {
        notionApiKey: '',
        notionDatabaseId: '',
        slackWebhookUrl: '',
        includeFileTypes: ['*.ts', '*.js'],
        excludeFolders: ['node_modules'],
        excludePatterns: ['**/dist/**'],
        customKeywords: 'TODO, FIXME',
        assigneePatterns: '@',
        tagPatterns: '#'
    };

    const extractor = new TodoExtractor(config);

    test('findTodoInLine parses standard TODO', () => {
        const line = '// TODO: Fix this';
        const result = (extractor as any).findTodoInLine(line);
        assert.ok(result);
        assert.strictEqual(result.content, '[TODO] Fix this');
    });

    test('findTodoInLine parses TODO with priority', () => {
        const line = '// TODO: [HIGH] Critical bug';
        const result = (extractor as any).findTodoInLine(line);
        assert.ok(result);
        assert.strictEqual(result.priority, 'high');
        assert.strictEqual(result.content, '[TODO] Critical bug');
    });

    test('findTodoInLine parses TODO with assignee', () => {
        const line = '// FIXME: @user1 Fix it';
        const result = (extractor as any).findTodoInLine(line);
        assert.ok(result);
        assert.strictEqual(result.assignee, 'user1');
        assert.strictEqual(result.content, '[FIXME] Fix it');
    });

    test('findTodoInLine parses TODO with tags', () => {
        const line = '// TODO: #bug #ui Fix UI';
        const result = (extractor as any).findTodoInLine(line);
        assert.ok(result);
        assert.deepStrictEqual(result.tags, ['bug', 'ui']);
        assert.strictEqual(result.content, '[TODO] Fix UI');
    });

    test('findTodoInLine ignores non-todo comments', () => {
        const line = '// This is a normal comment';
        const result = (extractor as any).findTodoInLine(line);
        assert.strictEqual(result, null);
    });

    test('isSourceFile matches extensions', () => {
        assert.strictEqual((extractor as any).isSourceFile('test.ts'), true);
        assert.strictEqual((extractor as any).isSourceFile('test.js'), true);
        assert.strictEqual((extractor as any).isSourceFile('test.txt'), false);
    });
});
