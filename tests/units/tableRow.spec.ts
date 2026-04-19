import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import tableRowRenderer from '../../src/renderer/tableRow';
import { Tokens } from 'marked';

describe('TableRow', () => {
    it('should render the table row to a table row', () => {
        const markdown = '| Cell | Cell |';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('returns empty string (noop)', () => {
        expect(tableRowRenderer({} as Tokens.TableRow)).toBe('');
    });
});
