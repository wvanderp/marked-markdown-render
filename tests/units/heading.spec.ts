import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('Heading', () => {
    it('renders atx headings', () => {
        const markdown = '# Atx';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n\n');
    });

    it('renders setext headings', () => {
        const markdown = 'Setext\n======';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n\n');
    });
});
