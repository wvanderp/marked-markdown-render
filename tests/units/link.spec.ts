import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('link', () => {
    it('renders nested inline content inside a link label', () => {
        const markdown = '[*Hello*](https://example.com)';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('outputs balanced parentheses without escaping', () => {
        const markdown = '[link](\\(foo\\))';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        // Balanced parens don't need escaping; both forms produce href "(foo)"
        expect(result).toEqual('[link]((foo))\n');
    });

    it('escapes unbalanced parentheses in destinations', () => {
        const markdownMarked = marked.use(markedMarkdownRenderer());

        // Unbalanced ) needs escaping
        const result = markdownMarked('[link](foo\\)bar)');
        expect(result).toEqual('[link](foo\\)bar)\n');
    });

    it('normalizes empty destinations and wraps spaced destinations in angle brackets', () => {
        const markdownMarked = marked.use(markedMarkdownRenderer());

        expect(markdownMarked('[link]()')).toEqual('[link]()\n');
        expect(markdownMarked('[link](<>)')).toEqual('[link]()\n');
        expect(markdownMarked('[](<>)')).toEqual('[]()\n');
        expect(markdownMarked('[link](</my uri>)')).toEqual('[link](</my uri>)\n');
    });

    it('renders email autolinks with angle brackets', () => {
        const markdown = '<test@example.com>';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders bare autolinks without angle brackets', () => {
        const markdown = 'https://example.com';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders bare email autolinks without mailto prefix', () => {
        const markdown = 'foo@bar.example.com';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders reflinks using the reference label', () => {
        const markdown = '[foo][bar]\n\n[bar]: /url "title"';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders complex reflinks instead of converting them to inline links', () => {
        const markdown = '[foo <bar attr="][ref]">\n\n[ref]: /uri';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });
});
