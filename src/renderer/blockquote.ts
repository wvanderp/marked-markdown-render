import { Renderer, Tokens } from 'marked';

/**
 * renders the blockquote to markdown
 * @returns the renderer
 */
export default function blockquoteRenderer(this: Renderer, blockquote : Tokens.Blockquote) : string {
    return blockquote.tokens
        .map((token) => this.parser.parse([token]))
        .reduce((acc, cur) => acc + `> ` + cur, '')
        .trim();
}
