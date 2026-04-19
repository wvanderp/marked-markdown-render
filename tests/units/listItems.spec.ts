import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import listItemRenderer from '../../src/renderer/listItem';

describe('listItems', () => {
    it('should render the list item to a list item', () => {
        const markdown = '- Hello, World!';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders list item by parsing inline tokens', () => {
        const mockRenderer = {
            parser: {
                parseInline: () => 'item text'
            }
        } as any;
        const listItem = { tokens: [{ type: 'text', text: 'item text' }] } as any;
        const result = listItemRenderer.call(mockRenderer, listItem);
        expect(result).toBe('item text');
    });
});
