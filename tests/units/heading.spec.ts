import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import headingRenderer from '../../src/renderer/heading';

describe('Heading', () => {
    it('renders atx headings', () => {
        const markdown = '# Atx';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders setext headings', () => {
        const markdown = 'Setext\n======';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders setext h2 headings', () => {
        const markdown = 'Setext\n------';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('throws for unknown heading style', () => {
        expect(() => headingRenderer({ depth: 3, text: 'Test' } as any)).toThrow();
    });
});

describe('Setext Heading normalization', () => {
    // we underline the whole text with = or -, no less no more.

    const testcases = [
        [ 
            [
                'setext',
                '======'
            ],
            [
                'setext',
                '======'
            ]
        ],
        [
            [
                'setext',
                '==='
            ],
            [
                'setext',
                '======'
            ]
        ],
        [
            [
                'setext',
                '=============='
            ],
            [
                'setext',
                '======'
            ]
        ],
    ] as [[string, string], [string, string]][]
    
    it.each(testcases)('normalizes setext headings correctly', (markdown, expected) => {
        const markdownMarked = marked.use(markedMarkdownRenderer());
        const result = markdownMarked(markdown.join('\n'));
        expect(result).toEqual(expected.join('\n') + '\n');
    });
});
