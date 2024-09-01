import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('hr', () => {
    it('should render the hr back to hr', () => {
        const markdown = '***\n---\n___\n';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
