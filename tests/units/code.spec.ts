import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import codeRenderer from '../../src/renderer/code';
import { Tokens } from 'marked';

describe('Code', () => {
    it('should render the code block to a code block', () => {
        const markdown = '```typescript\nconsole.log("Hello, World!");\n```';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('should render the code block when the language is not specified', () => {
        const markdown = '```\nconsole.log("Hello, World!");\n```';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('should render indented code blocks', () => {
        const markdown = '    console.log("Hello, World!");\n';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should handle having a language specified', () => {
        const markdown = '```typescript\nconsole.log("Hello, World!");\n```';

        const markdownMarked = marked.use(markedMarkdownRenderer());    

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders empty fenced code block', () => {
        const markdown = '```\n```';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('handles undefined lang via direct call', () => {
        const code = { text: 'hello', lang: undefined } as Tokens.Code;
        expect(codeRenderer(code)).toBe('```\nhello\n```\n');
    });

    it('handles empty text with lang via direct call', () => {
        const code = { text: '', lang: 'js' } as Tokens.Code;
        expect(codeRenderer(code)).toBe('```js\n```\n');
    });
});
