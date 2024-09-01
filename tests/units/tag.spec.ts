import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('Blockquote', () => {
    it('should render the blockquote to a blockquote', () => {
        const markdown = '> Hello, World!';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
