import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';

describe('Image', () => {
    it('should render the image to a image', () => {
        const markdown = '![Hello, World!](https://example.com/image.png)';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('should render the image to a image with title', () => {
        const markdown = '![Hello, World!](https://example.com/image.png "Title")';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders nested inline content inside alt text', () => {
        const markdown = '![foo *bar*](train.jpg)';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('escapes image destinations that need parentheses', () => {
        const markdown = '![x](foo\\(and\\(bar\\))';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('wraps spaced image destinations in angle brackets', () => {
        const markdown = '![x](<https://example.com/a b>)';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders reflink images using the reference label', () => {
        const markdown = '![foo][bar]\n\n[bar]: /url';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });

    it('renders shortcut reflink images when label matches alt text', () => {
        const markdown = '![foo]\n\n[foo]: /url "title"';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown + '\n');
    });
});
