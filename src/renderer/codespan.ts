import { Tokens } from 'marked';

/**
 * renders the codespan to markdown
 * @returns the renderer
 */
export default function codespanRenderer(code : Tokens.Codespan) : string {
    return `\`${code.text}\``;
}
