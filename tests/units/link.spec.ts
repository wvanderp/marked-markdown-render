import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('link', () => {
    it('renders nested inline content inside a link label', () => {
        const markdown = '[*Hello*](https://example.com)';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('escapes destinations that need parentheses', () => {
        const markdown = '[link](\\(foo\\))';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('normalizes empty destinations and wraps spaced destinations in angle brackets', () => {
        const markdownMarked = marked.use(markedMarkdownRenderer());

        expect(markdownMarked('[link]()')).toEqual('[link]()');
        expect(markdownMarked('[link](<>)')).toEqual('[link]()');
        expect(markdownMarked('[](<>)')).toEqual('[]()');
        expect(markdownMarked('[link](</my uri>)')).toEqual('[link](</my uri>)');
    });

    it('renders email autolinks with angle brackets', () => {
        const markdown = '<test@example.com>';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('renders bare autolinks without angle brackets', () => {
        const markdown = 'https://example.com';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('renders reflinks using the reference label', () => {
        const markdown = '[foo][bar]\n\n[bar]: /url "title"';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('renders complex reflinks instead of converting them to inline links', () => {
        const markdown = '[foo <bar attr="][ref]">\n\n[ref]: /uri';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
