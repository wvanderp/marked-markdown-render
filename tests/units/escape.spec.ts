import { describe, it, expect } from 'vitest';

import { marked } from 'marked';
import markedMarkdownRenderer from '../../src';
import { escapeChars } from '../../src/renderer/escape';
/*
* \	backslash
* `	backtick
* *	asterisk
* _	underscore
* { }	curly braces
* [ ]	brackets
* ( )	parentheses
* #	pound sign
* +	plus sign
* -	minus sign
* .	dot
* !	exclamation mark
* |	pipe
*/

describe('escapeCharacters', () => {
    it('should escape the characters', () => {
        const markdown = '\`*_{}[]()#-.!|';
        const escaped = '\\`\\*\\_\\{\\}\\[\\]\\(\\)\\#\\-\\.\\!\\|';

        expect(escapeChars(markdown)).toEqual(escaped);
    });

    it('should escape the backslash', () => {
        const markdown = '\\';
        const escaped = '\\';

        expect(escapeChars(markdown)).toEqual(escaped);
    });
});

describe('escapeRenderer', () => {
    it('should escape the characters', () => {
        const markdown = '\\\\\`\*\_\{\}\[\]\(\)\#\-\.\!\|';

        const markdownMarked = marked.use(markedMarkdownRenderer());

        const result = markdownMarked(markdown);

        expect(result).toEqual(markdown);
    });
});
