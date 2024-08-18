import { Tokens } from 'marked';

/**
 * this function will escape the following characters in a string
 * 
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
 * 
 * @param {string} text the text to escape
 * @returns the escaped text
 * 
 */
export function escapeChars(text : string) : string {
    return decodeURIComponent(text).replace(/\\|`|\*|_|{|}|\[|\]|\(|\)|#|\+|-|\.|!|\|/g, '\\$&');
}

/**
 * renders the escape token to markdown
 * @returns the renderer
 */
export default function escapeRenderer(escape : Tokens.Escape) : string {
    return escapeChars(escape.text);
}
