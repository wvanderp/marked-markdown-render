import { describe, expect, it } from 'vitest';
import markedMarkdownRenderer from '../src';
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

const examplesPath = path.join(__dirname, 'examples');

const examples = fs.readdirSync(examplesPath)
    .filter((file) => file.endsWith('.md'));

const disabledExamples = new Set([
    'cheatsheet.md',
    'marked-readme.md',
    'marked-test.md',
]);

describe('examples', () => {

    examples.forEach((example) => {
        const testCase = disabledExamples.has(example) ? it.skip : it;

        testCase(example, () => {
            const markdown = fs.readFileSync(`${examplesPath}/${example}`, 'utf-8');
            const markdownMarked = marked.use(markedMarkdownRenderer());

            expect((markdownMarked(markdown) as string).trim()).toBe(markdown.trim());
        });
    });
});
