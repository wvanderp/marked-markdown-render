import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('space', () => {
    it('should render two newlines between paragraphs (one blank line)', () => {
        const markdown = 'Hello\n\nWorld';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should render three newlines between paragraphs (two blank lines)', () => {
        const markdown = 'Hello\n\n\nWorld';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should render four newlines between paragraphs (three blank lines)', () => {
        const markdown = 'Hello\n\n\n\nWorld';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should handle standard block separation (no space token, absorbed by lexer)', () => {
        const markdown = 'Hello\n\nWorld';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
