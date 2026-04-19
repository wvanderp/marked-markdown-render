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

    it('renders center-aligned table', () => {
        const markdown = '| Header |\n|:------:|\n|  Cell  |';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders right-aligned table', () => {
        const markdown = '| Header |\n|-------:|\n|   Cell |';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders left-aligned table', () => {
        const markdown = '| Header |\n|:-------|\n| Cell   |';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders header-only table without body rows', () => {
        const markdown = '| Header |\n|--------|';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });
});
