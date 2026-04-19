import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import tableCellRenderer from '../../src/renderer/tableCell';
import { Tokens } from 'marked';

describe('TableCell', () => {
    it('should render the table cell to a table cell', () => {
        const markdown = '| Cell | Cell |';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('returns empty string (noop)', () => {
        expect(tableCellRenderer({} as Tokens.TableCell)).toBe('');
    });
});
