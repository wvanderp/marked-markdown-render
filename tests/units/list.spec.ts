import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('List', () => {
    it('renders unordered list bullet characters from tokens', () => {
        const markdown = '+ alpha\n+ beta';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('renders ordered list delimiter characters from tokens', () => {
        const markdown = '1) one\n2) two';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('renders ordered list with non-sequential numbers', () => {
        const markdown = '1. one\n1. two\n3. three';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
