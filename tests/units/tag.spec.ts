import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import tagRenderer from '../../src/renderer/tag';
import { Tokens } from 'marked';

describe('Tag', () => {
    it('should render the tag to a tag', () => {
        const markdown = '<tag>Hello, World!</tag>';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('returns empty string (noop)', () => {
        expect(tagRenderer({} as Tokens.Tag)).toBe('');
    });
});
