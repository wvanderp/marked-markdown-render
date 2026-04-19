import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import emRenderer from '../../src/renderer/em';
import { Tokens } from 'marked';

describe('em', () => {
    it('should render the emphasis to an emphasis', () => {
        const markdown = '*Hello, World!*';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders underscore emphasis', () => {
        const markdown = '_Hello, World!_';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('falls back to underscore for unknown em delimiter', () => {
        const em = { raw: '~text~', text: 'text' } as unknown as Tokens.Em;
        expect(emRenderer(em)).toBe('_text_');
    });
});
