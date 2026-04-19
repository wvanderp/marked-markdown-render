import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('List', () => {
    it('renders unordered list bullet characters from tokens', () => {
        const markdown = '+ alpha\n+ beta';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders ordered list delimiter characters from tokens', () => {
        const markdown = '1) one\n2) two';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders ordered list with non-sequential numbers', () => {
        const markdown = '1. one\n1. two\n3. three';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders list item containing a blockquote', () => {
        const markdown = '- item\n\n  > blockquote';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders list item containing a code block', () => {
        const markdown = '- item\n\n      code';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders loose list with blank lines', () => {
        const markdown = '- foo\n\n- bar';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders loose list with empty item', () => {
        const markdown = '* a\n*\n\n* c';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders multi-line list item with continuation indent', () => {
        const markdown = '- first\n    second\n- other';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders checked checkbox in list', () => {
        const markdown = '- [x] Done';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders list item with marker on its own line', () => {
        const markdown = '-\n  foo\n-\n  bar';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders list item with marker on own line and blank line in content', () => {
        const markdown = '-\n  foo\n\n  bar';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });
});
