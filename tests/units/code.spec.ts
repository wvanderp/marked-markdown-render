import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('Code', () => {
    it('should render the code block to a code block', () => {
        const markdown = '```typescript\nconsole.log("Hello, World!");\n```';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should render the code block when the language is not specified', () => {
        const markdown = '```\nconsole.log("Hello, World!");\n```';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
