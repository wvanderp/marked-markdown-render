import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import checkboxRenderer from '../../src/renderer/checkbox';
import { Tokens } from 'marked';

describe('Checkbox', () => {
    it('should render the checkbox to a checkbox', () => {
        const markdown = '- [ ] Hello, World!';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders checked checkbox directly', () => {
        expect(checkboxRenderer({ checked: true } as Tokens.Checkbox)).toBe('[x]');
    });

    it('renders unchecked checkbox directly', () => {
        expect(checkboxRenderer({ checked: false } as Tokens.Checkbox)).toBe('[ ]');
    });
});
