import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('text', () => {
    it('should render the text to a text', () => {
        const markdown = 'Hello, World!';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should render the text and keep escaped characters', () => {
        const markdown = 'Hello, \\*World\\*!';

        console.log(JSON.stringify(marked.lexer(markdown), null, 2));

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
