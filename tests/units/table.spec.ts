import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('Table', () => {
    it('should render the table to a table', () => {
        const markdown = '| Header | Header |\n|--------|--------|\n| Cell   | Cell   |';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });
});
