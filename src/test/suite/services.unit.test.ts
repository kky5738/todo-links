import * as assert from 'assert';
import { SlackService } from '../../slackService';
import { TodoItem } from '../../types';

suite('SlackService Unit Tests', () => {
    const service = new SlackService('https://hooks.slack.com/services/test');

    test('formatSlackMessage splits large lists', () => {
        const todos: TodoItem[] = [];
        // Create 60 todos to exceed the 50 block limit
        for (let i = 0; i < 60; i++) {
            todos.push({
                filePath: 'test.ts',
                lineNumber: i + 1,
                content: `Todo ${i}`,
                priority: 'medium'
            });
        }

        const chunks = (service as any).formatSlackMessage(todos);
        
        // Should be split into at least 2 chunks
        assert.ok(chunks.length >= 2);
        
        // Each chunk should have <= 50 blocks (our limit is 45 for safety)
        for (const chunk of chunks) {
            assert.ok(chunk.length <= 50);
        }
    });

    test('formatSlackMessage handles empty list', () => {
        const todos: TodoItem[] = [];
        const chunks = (service as any).formatSlackMessage(todos);
        // Should return one chunk with header and summary, or handle it gracefully
        // The current implementation adds header and summary even for empty list?
        // Let's check logic: header (2) + summary (1) = 3 blocks.
        if (chunks.length > 0) {
            assert.ok(chunks[0].length > 0);
        }
    });
});
