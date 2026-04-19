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

describe('hr normalization', () => {
    // We only render the hr tags as three characters, so we need to test that the normalization works correctly.

    const testcases = [
        { markdown: '****', expected: '***\n' },
        { markdown: '* * * *', expected: '***\n' },
        { markdown: '-----', expected: '---\n' },
        { markdown: '- - - - -', expected: '---\n' },
        { markdown: '______', expected: '___\n' },
        { markdown: '_ _ _ _    _', expected: '___\n' },
    ];

    it.each(testcases)('normalizes hr markdown correctly', ({ markdown, expected }) => {
        const markdownMarked = marked.use(markedMarkdownRenderer());
        const result = markdownMarked(markdown);
        expect(result).toEqual(expected);
    });
});
