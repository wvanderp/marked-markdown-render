import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import strongRenderer from '../../src/renderer/strong';
import { Tokens } from 'marked';

describe('Strong', () => {
    it('should render the strong to a strong', () => {
        const markdown = '**Hello, World!**';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders underscore strong', () => {
        const markdown = '__Hello, World!__';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('falls back to double asterisks for unknown strong delimiter', () => {
        const strong = { raw: '~text~', text: 'text' } as unknown as Tokens.Strong;
        expect(strongRenderer(strong)).toBe('**text**');
    });
});
