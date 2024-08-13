import { describe, expect, it } from 'vitest';
import commonmark from './commonmark.json';
import markedMarkdownRenderer from '../../src';
import { marked } from 'marked';

// preprocess the commonmark tests to group them by section
const sections = commonmark.reduce<Record<string, any[]>>((acc, test) => {
    if (!acc[test.section]) {
        acc[test.section] = [];
    }
    
    acc[test.section].push(test);
    
    return acc;
    }, {});



describe('Commonmark', () => {

    Object.entries(sections).forEach(([section, tests]) => {
        describe(section, () => {
        tests.forEach((test) => {
            it(`${test.section} ${test.example}`, () => {
            const markdownMarked = marked.use(markedMarkdownRenderer())
    
            // @ts-expect-error
            expect(markdownMarked.parse(test.markdown).trim()).toBe(test.markdown.trim());
            });
        });
        });
    });
});
