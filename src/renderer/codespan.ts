import { decode } from 'html-entities';
import { Tokens } from 'marked';

/**
 * renders the codespan to markdown
 * @returns the renderer
 */
export default function codespanRenderer(code : Tokens.Codespan) : string {
    return `\`${decode(code.text)}\``;
}
