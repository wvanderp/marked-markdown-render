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
