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



// Tests that are inherent limitations: the AST doesn't preserve enough info to round-trip
const skipTests = new Set([
    329, // code span delimiter/padding choice is ambiguous from codespan text
    333, // code span boundary spaces are normalized away (` b ` vs `b`)
    337, // single-line vs newline inside code span is not preserved in tokens
    340, // code span delimiter/padding form is ambiguous from codespan text
    349, // adjacent backticks across inline token boundaries are not encoded
    335, // multiline code span newlines collapse into spaces in tokens
    336, // multiline code span with trailing space loses newline form
    634, // backslash hard break (AST doesn't distinguish from space break)
    635, // exact trailing space count in hard break
    637, // backslash hard break with indentation
    640, // line break inside code span (collapsed to space by lexer)
    641, // backslash line break inside code span
    486, // empty destination style `()` vs `(<>)` is not preserved in link tokens
]);

describe('Commonmark', () => {

    Object.entries(sections).forEach(([section, tests]) => {
        describe(section, () => {
            tests.forEach((test) => {
                const testFn = skipTests.has(test.example) ? it.skip : it;
                testFn(`${test.section} ${test.example}`, () => {
                    const markdownMarked = marked.use(markedMarkdownRenderer())

                    // @ts-expect-error
                    expect(markdownMarked.parse(test.markdown).trim()).toBe(test.markdown.trim());
                });
            });
        });
    });
});
