import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('Image', () => {
    it('should render the image to a image', () => {
        const markdown = '![Hello, World!](https://example.com/image.png)';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });

    it('should render the image to a image with title', () => {
        const markdown = '![Hello, World!](https://example.com/image.png "Title")';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
