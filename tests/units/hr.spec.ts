import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import hrRenderer from '../../src/renderer/hr';

describe('hr', () => {
    it('renders star thematic breaks', () => {
        const markdown = '***';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders dash thematic breaks', () => {
        const markdown = '---';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders underscore thematic breaks', () => {
        const markdown = '___';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('throws for unknown hr character', () => {
        expect(() => hrRenderer({ character: '!' } as any)).toThrow('Unknown hr type: !');
    });
});
